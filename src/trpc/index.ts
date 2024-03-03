import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { privateProcedure, router } from "./trpc";
import { db } from "@/db/prisma";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { clientSubscription } from "./_partials/plan";
import {
  changeName,
  deleteUserFiles,
  emailVerify,
  emailVerifyAccept,
  getUserFilesDrawer,
  getUserFilesWithPagination,
  registerNewUser,
  forgotPassword,
} from "./_partials/user";
import {
  activeUser,
  deleteUser,
  files,
  restrictUser,
  suspendUser,
  users,
} from "./_partials/admin";
import { createStripeSession } from "./_partials/stripe";

export const appRouter = router({
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    return await db.files.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        messages: {
          select: {
            id: true,
          },
        },
      },
    });
  }),

  getFileMessages: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        fileId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { fileId, cursor } = input;
      const limit = input.limit ?? INFINITE_QUERY_LIMIT;

      const file = await db.files.findFirst({
        where: {
          id: fileId,
          userId,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      const messages = await db.messages.findMany({
        take: limit + 1,
        where: {
          fileId: fileId,
        },
        orderBy: {
          createdAt: "desc",
        },
        cursor: cursor ? { id: cursor } : undefined,
        select: {
          id: true,
          isUserMessage: true,
          createdAt: true,
          text: true,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (messages.length > limit) {
        const nextItem = messages.pop();
        nextCursor = nextItem?.id;
      }

      return {
        messages,
        nextCursor,
      };
    }),

  getFileUploadStatus: privateProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ input, ctx }) => {
      const file = await db.files.findFirst({
        where: {
          id: input.fileId,
          userId: ctx.userId,
        },
      });

      if (!file) return { status: "PENDING" as const };

      return { status: file.uploadStatus };
    }),

  getFile: privateProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const file = await db.files.findFirst({
        where: {
          key: input.key,
          userId,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      return file;
    }),

  // TODO: payment
  createStripeSession: createStripeSession(),
  deleteFile: deleteUserFiles(),
  // TODO: get all user files with pagination should be in a separate file
  register: registerNewUser(),
  forgotPassword: forgotPassword(),
  getUserFilesWithPagination: getUserFilesWithPagination(),
  getUserFilesDrawer: getUserFilesDrawer(),
  changeName: changeName(),
  emailVerify: emailVerify(),
  emailVerifyAccept: emailVerifyAccept(),
  subscriptionPlan: clientSubscription(),
  // TODO: admin related stuff should be in a separate file
  adminFils: files(),
  adminUsers: users(),
  adminUserDelete: deleteUser(),
  adminUserSuspend: suspendUser(),
  adminUserRestrict: restrictUser(),
  adminMakeActiveUser: activeUser(),
});

export type AppRouter = typeof appRouter;
