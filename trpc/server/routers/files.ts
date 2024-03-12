import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { withCursorPagination } from "drizzle-pagination";

import { createTRPCRouter, protectedProcedure } from "@/trpc/server/api/trpc";
import { files } from "@/db/schema";
import { PAGE_SIZE } from "@/lib/utils";

export const fileRouter = createTRPCRouter({
  fileStatus: protectedProcedure
    .input(
      z.object({
        fileId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      if (!ctx.session) return;

      const file = await ctx.db
        .select()
        .from(files)
        .where(
          and(
            eq(files.id, input.fileId),
            eq(files.userId, ctx.session?.user.id),
          ),
        );

      if (file.length === 0) {
        return { success: false, status: "PENDING" as const };
      }

      return { success: true, status: file[0].status };
    }),

  filesListCSV: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(PAGE_SIZE),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const myFiles = await ctx.db.query.files.findMany(
        withCursorPagination({
          where: and(
            eq(files.userId, ctx.session.user.id),
            eq(files.type, "CSV"),
          ),
          limit: input.limit,
          cursors: [
            [
              files.createdAt,
              "desc",
              input.cursor ? new Date(input.cursor) : undefined,
            ],
          ],
        }),
      );

      return {
        messages: myFiles,
        nextCursor: myFiles.length
          ? myFiles[myFiles.length - 1]?.createdAt.toISOString()
          : null,
      };
    }),
  filesListJSON: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(PAGE_SIZE),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const myFiles = await ctx.db.query.files.findMany(
        withCursorPagination({
          where: and(
            eq(files.userId, ctx.session.user.id),
            eq(files.type, "JSON"),
          ),
          limit: input.limit,
          cursors: [
            [
              files.createdAt,
              "desc",
              input.cursor ? new Date(input.cursor) : undefined,
            ],
          ],
        }),
      );

      return {
        messages: myFiles,
        nextCursor: myFiles.length
          ? myFiles[myFiles.length - 1]?.createdAt.toISOString()
          : null,
      };
    }),
});
