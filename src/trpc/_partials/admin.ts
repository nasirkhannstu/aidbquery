import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { db } from "@/db/prisma";
import { adminProcedure } from "../trpc";
import { makeBase64 } from "@/lib/file";

export const files = () => {
  return adminProcedure.query(async () => {
    const files = await db.files.findMany({
      select: {
        createdAt: true,
        name: true,
        id: true,
        fileType: true,
        uploadStatus: true,
        _count: {
          select: {
            messages: true,
          },
        },
        userId: true,
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    if (files.length === 0) return files;

    await Promise.all(
      files.map(async (file) => {
        if (file.User) {
          const avatarBase64 = await makeBase64(
            "avatars",
            file.User.avatar as string,
          );
          file.User.avatar = avatarBase64;
        }
      }),
    );

    return files;
  });
};

export const users = () => {
  return adminProcedure.query(async () => {
    const users = await db.users.findMany({
      select: {
        createdAt: true,
        name: true,
        id: true,
        email: true,
        avatar: true,
        role: true,
        stripeCustomerId: true,
        stripeCurrentPeriodEnd: true,
        subscriptionStatus: true,
        status: true,
        isEmailVerify: true,
        _count: {
          select: {
            File: true,
            Message: true,
          },
        },
      },
    });

    if (users.length === 0) return users;

    await Promise.all(
      users.map(async (user) => {
        if (user) {
          const avatarBase64 = await makeBase64(
            "avatars",
            user.avatar as string,
          );
          user.avatar = avatarBase64;
        }
      }),
    );

    return users;
  });
};

export const deleteUser = () => {
  return adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (input.id === ctx.userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can not delete yourself",
        });
      }

      await db.users.delete({
        where: { id: input.id, NOT: { id: ctx.user.id } },
      });

      return { success: true };
    });
};

export const suspendUser = () => {
  return adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (input.id === ctx.userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can not suspend yourself",
        });
      }

      await db.users.update({
        where: {
          id: input.id,
          NOT: { id: ctx.user.id },
        },
        data: {
          status: "SUSPEND",
        },
      });

      return { success: true };
    });
};
export const restrictUser = () => {
  return adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (input.id === ctx.userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can not restrict yourself",
        });
      }

      await db.users.update({
        where: { id: input.id, NOT: { id: ctx.user.id } },
        data: {
          status: "RESTRICTED",
        },
      });

      return { success: true };
    });
};

export const activeUser = () => {
  return adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db.users.update({
        where: { id: input.id },
        data: {
          status: "ACTIVE",
        },
      });
    });
};
