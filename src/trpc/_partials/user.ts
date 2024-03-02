import { z } from "zod";
import { TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { unlink } from "fs/promises";
import path from "path";

import { privateProcedure, publicProcedure } from "../trpc";
import { INFINITE_QUERY_LIMIT_FILES } from "@/config/infinite-query";
import { db } from "@/db/prisma";
import {
  emailVerifyTemplate,
  mailServer,
  forgotPasswordTemplate,
} from "@/lib/mailServer";
import { JwtPayload } from "@/app/(Auth)/email-verify/[token]/layout";
import { deleteUnExistingFile } from "@/lib/file";
import { getPineconeClient } from "@/lib/pinecone";
import { pinecone_index } from "@/lib/utils";

export const registerNewUser = () => {
  return publicProcedure
    .input(
      z
        .object({
          fullName: z.string(),
          email: z.string().email(),
          password: z.string().min(6).max(32),
          confirmPassword: z.string().min(6).max(32),
        })
        .superRefine(({ password, confirmPassword }, ctx: z.RefinementCtx) => {
          if (password !== confirmPassword) {
            ctx.addIssue({
              code: "invalid_date",
              message: "Password did not matched",
            });
          }
        }),
    )
    .mutation(async ({ input }) => {
      const existingUser = await db.users.findFirst({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User already exist",
        });
      }

      const hashPass = await bcrypt.hash(input.password, 12);
      const userSetting = await db.userSettings.create({ data: {} });

      const user = await db.users.create({
        data: {
          userSettingId: userSetting.id,
          name: input.fullName,
          email: input.email,
          password: hashPass,
          isEmailVerify:
            process.env.EMAIL_VERIFY_OPTION === "ON" ? false : true,
          status: process.env.USING_MODE === "PERSONAL" ? "INACTIVE" : "ACTIVE",
        },
      });

      // TODO: send email conditionally
      if (process.env.EMAIL_VERIFY_OPTION === "ON") {
        const token = jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET as string,
          {
            expiresIn: "100d",
          },
        );
        const emailTemplate = emailVerifyTemplate(token);
        await mailServer(user.email, "New account created", emailTemplate);
      }

      return {
        success: true,
        message:
          "Congratulations! Your account has been created successfully. Please check your email inbox for verification.",
      };
    });
};

export const forgotPassword = () => {
  return publicProcedure
    .input(
      z.object({
        email: z
          .string()
          .email({ message: "Email must be a valid email." })
          .trim(),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await db.users.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The user was not found with the email provided.",
        });
      }

      const token = crypto.randomBytes(20).toString("hex");
      const mailTemplate = forgotPasswordTemplate(token);
      const res = await mailServer(
        input.email,
        "Forgot Password: You request for reset your password.",
        mailTemplate,
      );

      const messageId = res?.id;
      await db.forgotPasswords.create({
        data: {
          email: input.email,
          messageId: messageId,
          token,
          userId: user.id,
          reason: "FORGOT",
        },
      });
    });
};

export const getUserFilesWithPagination = () => {
  return privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { cursor } = input;
      const limit = input.limit ?? INFINITE_QUERY_LIMIT_FILES;

      const files = await db.files.findMany({
        take: limit + 1,
        where: {
          userId: userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        cursor: cursor ? { id: cursor } : undefined,
        select: {
          id: true,
          fileType: true,
          name: true,
          createdAt: true,
          _count: {
            select: {
              messages: true,
            },
          },
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (files.length > limit) {
        const nextItem = files.pop();
        nextCursor = nextItem?.id;
      }

      return {
        files,
        nextCursor,
      };
    });
};

export const getUserFilesDrawer = () => {
  return privateProcedure.query(async ({ ctx }) => {
    const files = await db.files.findMany({
      where: {
        userId: ctx.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        fileType: true,
        name: true,
        createdAt: true,
        _count: {
          select: {
            messages: true,
          },
        },
      },
    });

    return files;
  });
};

export const changeName = () => {
  return privateProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(3, { message: "The name must be at least 3 characters." })
          .max(32),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db.users.update({
        where: {
          id: ctx.userId,
        },
        data: {
          name: input.name,
        },
      });

      return { success: true, name: input.name };
    });
};

export const emailVerify = () => {
  return privateProcedure.mutation(async ({ ctx }) => {
    // TODO: send email
    const token = jwt.sign(
      { id: ctx.userId },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "100d",
      },
    );
    const emailTemplate = emailVerifyTemplate(token);
    await mailServer(ctx.user.email, "Email Verification", emailTemplate);

    await db.users.update({
      where: {
        id: ctx.userId,
      },
      data: {
        emailVerifyAt: new Date(),
        isEmailVerify: false,
      },
    });

    return { success: true };
  });
};

export const emailVerifyAccept = () => {
  return publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      const decoded = jwt.verify(
        input.token,
        process.env.JWT_SECRET,
      ) as JwtPayload;

      const user = await db.users.update({
        where: {
          id: decoded.id,
        },
        data: {
          isEmailVerify: true,
          emailVerifyAt: null,
        },
      });

      return {
        id: decoded.id,
        email: user.email,
        success: true,
      };
    });
};

export const deleteUserFiles = () => {
  return privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const file = await db.files.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      if (file.fileType === "PDF") {
        const filePath = path.join(
          process.cwd(),
          "public/uploads/pdfs",
          file.path,
        );
        const isExist = await deleteUnExistingFile(filePath);
        if (isExist) {
          await unlink(filePath);
        }
      } else if (file.fileType === "TEXT" || file.fileType === "URL") {
        const filePath = path.join(
          process.cwd(),
          "public/uploads/texts",
          file.path,
        );
        const isExist = await deleteUnExistingFile(filePath);
        if (isExist) {
          await unlink(filePath);
        }
      } else if (file.fileType === "IMAGE") {
        const filePath = path.join(
          process.cwd(),
          "public/uploads/images",
          file.path,
        );
        const isExist = await deleteUnExistingFile(filePath);
        if (isExist) {
          await unlink(filePath);
        }
      } else if (file.fileType === "DOC") {
        const filePath = path.join(
          process.cwd(),
          "public/uploads/docs",
          file.path,
        );
        const isExist = await deleteUnExistingFile(filePath);
        if (isExist) {
          await unlink(filePath);
        }
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed delete file",
        });
      }
      await db.files.delete({
        where: {
          id: input.id,
          userId: ctx.userId,
        },
      });

      if (file.fileType !== "IMAGE") {
        // TODO: delete pinecone namespace
        const pineconeClient = await getPineconeClient();
        const index = pineconeClient.Index(pinecone_index);
        const ns = index.namespace(input.id);
        await ns.deleteAll();
      }

      return { success: true, fileId: input.id };
    });
};
