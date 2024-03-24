import { z } from "zod";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/trpc/server/api/trpc";
import { users } from "@/db/schema";
import { userErrors } from "@/lib/alerts/errors.trpc";
import { messages } from "@/lib/alerts/alerts.trpc";
import { eq } from "drizzle-orm";

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
});
