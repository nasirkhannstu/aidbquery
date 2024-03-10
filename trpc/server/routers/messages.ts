import { z } from "zod";
import { eq } from "drizzle-orm";
import { withCursorPagination } from "drizzle-pagination";
import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/trpc/server/api/trpc";
import { files, messages, users } from "@/db/schema";
import { INFINITY_QUERY } from "@/lib/utils";
import { fileErrors } from "@/lib/alerts/errors.trpc";

export const messageRouter = createTRPCRouter({
  messagesOfFile: protectedProcedure
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

      const msgs = await ctx.db.query.messages.findMany(
        withCursorPagination({
          where: eq(messages.fileId, input.fileId),
          limit: input.limit,
          cursors: [
            [
              messages.createdAt,
              "asc",
              input.cursor ? new Date(input.cursor) : undefined,
            ],
          ],
        }),
      );

      return {
        messages: msgs,
        nextCursor: msgs.length
          ? msgs[msgs.length - 1]?.createdAt.toISOString()
          : null,
      };
    }),
});
