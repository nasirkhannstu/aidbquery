import { z } from "zod";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/trpc/server/api/trpc";
import { users } from "@/db/schema";
import { userErrors } from "@/lib/alerts/errors.trpc";
import { messages } from "@/lib/alerts/alerts.trpc";

export const userRouters = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        firstName: z.string().trim(),
        lastName: z.string().trim(),
        email: z.string().email().trim(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userExists = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, input.email),
      });

      if (userExists) {
        throw new TRPCError({
          code: userErrors.userExists.code,
          message: userErrors.userExists.message,
        });
      }

      const hashedPassword = await bcrypt.hash(input.password, 12);

      await ctx.db.insert(users).values({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        password: hashedPassword,
      });

      return { success: true, message: messages.userRegister.message };
    }),

  userProfile: protectedProcedure.query(async ({ ctx }) => {
    // Get the user profile
    const user = await ctx.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, ctx.session.user.id),
    });

    if (!user)
      throw new TRPCError({
        code: userErrors.userNotFound.code,
        message: userErrors.userNotFound.message,
      });

    return user;
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        firstName: z.string().trim().optional(),
        lastName: z.string().trim().optional(),
        bio: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, ctx.session.user.id),
      });

      if (!user) {
        throw new TRPCError({
          code: userErrors.userNotFound.code,
          message: userErrors.userNotFound.message,
        });
      }

      await ctx.db
        .update(users)
        .set({
          firstName: input.firstName ?? user.firstName,
          lastName: input.lastName ?? user.lastName,
          bio: input.bio ?? user.bio,
        })
        .where(eq(users.id, ctx.session.user.id));

      return { success: true, message: messages.profileUpdate.message };
    }),

  /**
   * @description Change the user password
   * @param input  currentPassword, newPassword:, confirmPassword
   * @returns success message
   */
  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string(),
        newPassword: z.string(),
        confirmPassword: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, ctx.session.user.id),
      });

      if (!user) {
        throw new TRPCError({
          code: userErrors.userNotFound.code,
          message: userErrors.userNotFound.message,
        });
      }

      const isPasswordValid = await bcrypt.compare(
        input.currentPassword,
        user.password,
      );

      if (!isPasswordValid) {
        throw new TRPCError({
          code: userErrors.invalidPassword.code,
          message: userErrors.invalidPassword.message,
        });
      }

      if (input.newPassword !== input.confirmPassword) {
        throw new TRPCError({
          code: userErrors.passwordNotMatch.code,
          message: userErrors.passwordNotMatch.message,
        });
      }

      const hashedPassword = await bcrypt.hash(input.newPassword, 12);

      await ctx.db
        .update(users)
        .set({ password: hashedPassword })
        .where(eq(users.id, ctx.session.user.id));

      return { success: true, message: messages.passwordChange.message };
    }),

  /**
   * @description Request for account reactivation
   * @param input none
   * @returns success message
   */
  reactiveAccount: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, ctx.session.user.id),
    });

    if (!user)
      throw new TRPCError({
        code: userErrors.userNotFound.code,
        message: userErrors.userNotFound.message,
      });

    await ctx.db
      .update(users)
      .set({ status: "ACTIVE" })
      .where(eq(users.id, ctx.session.user.id));

    return { success: true, message: messages.reactiveAccount.message };
  }),

  /**
   * @description Deactivate the user account
   * @param input none
   * @returns success message
   */
  deactivateAccount: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, ctx.session.user.id),
    });

    if (!user)
      throw new TRPCError({
        code: userErrors.userNotFound.code,
        message: userErrors.userNotFound.message,
      });

    await ctx.db
      .update(users)
      .set({ status: "DEACTIVATED" })
      .where(eq(users.id, ctx.session.user.id));

    return { success: true, message: messages.deactivateAccount.message };
  }),

  /**
   * @description Delete the user account
   * @param input none
   * @returns success message
   */
  deleteUser: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, ctx.session.user.id),
    });

    if (!user)
      throw new TRPCError({
        code: userErrors.userNotFound.code,
        message: userErrors.userNotFound.message,
      });

    await ctx.db.delete(users).where(eq(users.id, ctx.session.user.id));

    return { success: true, message: "User deleted successfully" };
  }),
});
