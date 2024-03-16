import { z } from "zod";
import { eq } from "drizzle-orm";
import { withCursorPagination } from "drizzle-pagination";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "@/trpc/server/api/trpc";
import { messages } from "@/db/schema";
import { INFINITY_QUERY } from "@/lib/utils";
import { fileErrors } from "@/lib/alerts/errors.trpc";

export const messageRouter = createTRPCRouter({
  fileMessages: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(INFINITY_QUERY),
        cursor: z.string().nullish(),
        fileId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const file = await ctx.db.query.files.findFirst({
        where: (files, { and, eq }) =>
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

      const prevMessages = await ctx.db.query.messages.findMany(
        withCursorPagination({
          where: eq(messages.fileId, input.fileId),
          limit: input.limit,
          cursors: [
            [messages.id, "asc", input.cursor ? input.cursor : undefined],
          ],
        }),
      );

      return {
        messages: prevMessages,
        nextCursor: prevMessages.length
          ? prevMessages[prevMessages.length - 1]?.id
          : null,
      };
    }),
});
