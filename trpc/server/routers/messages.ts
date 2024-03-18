import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "@/trpc/server/api/trpc";
import { fileErrors } from "@/lib/alerts/errors.trpc";

export const messageRouter = createTRPCRouter({
  fileMessages: protectedProcedure
    .input(
      z.object({
        fileId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const file = await ctx.db.query.files.findFirst({
        where: (files, { eq, and }) =>
          and(
            eq(files.id, input.fileId),
            eq(files.userId, ctx.session?.user.id),
          ),
      });

      if (!file)
        throw new TRPCError({
          code: fileErrors.fileNotFound.code,
          message: fileErrors.fileNotFound.message,
        });

      const messages = await ctx.db.query.messages.findMany({
        where: (messages, { eq, and }) =>
          and(
            eq(messages.fileId, input.fileId),
            eq(messages.userId, ctx.session?.user.id),
          ),
        orderBy: (messages, { asc }) => asc(messages.createdAt),
      });

      return { messages };
    }),
});
