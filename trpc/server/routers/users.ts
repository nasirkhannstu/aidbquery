import { z } from "zod";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/trpc/server/api/trpc";
import { users } from "@/db/schema";
import { userErrors } from "@/lib/messages/errors.trpc";
import { messages } from "@/lib/messages/toast.trpc";

export const userRouters = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        name: z.string().trim(),
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
        fullName: input.name,
        email: input.email,
        password: hashedPassword,
      });

      return { success: true, message: messages.userRegister.message };
    }),
});
