import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { withCursorPagination } from "drizzle-pagination";
import { TRPCError } from "@trpc/server";
import { unlink } from "fs/promises";

import { createTRPCRouter, protectedProcedure } from "@/trpc/server/api/trpc";
import { files } from "@/db/schema";
import { PAGE_SIZE } from "@/lib/utils";
import { fileErrors } from "@/lib/alerts/errors.trpc";
import { isFileExist } from "@/lib/utils.server";
import { pineconeClient } from "@/lib/pinecne";

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

  userFirstFile: protectedProcedure.query(async ({ ctx }) => {
    const file = await ctx.db.query.files.findFirst({
      where: (files, { eq }) => eq(files.userId, ctx.session.user.id),
    });
    return file;
  }),

  userFileById: protectedProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ input, ctx }) => {
      const file = await ctx.db.query.files.findFirst({
        where: (files, { eq, and }) =>
          and(
            eq(files.id, input.fileId),
            eq(files.userId, ctx.session.user.id),
          ),
      });

      return file;
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
        files: myFiles,
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
        files: myFiles,
        nextCursor: myFiles.length
          ? myFiles[myFiles.length - 1]?.createdAt.toISOString()
          : null,
      };
    }),

  deleteFile: protectedProcedure
    .input(z.object({ fileId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const file = await ctx.db.query.files.findFirst({
        where: (files, { eq, and }) =>
          and(
            eq(files.id, input.fileId),
            eq(files.userId, ctx.session.user.id),
          ),
      });

      if (!file) {
        throw new TRPCError({
          code: fileErrors.fileNotFound.code,
          message: fileErrors.fileNotFound.message,
        });
      }

      const isExist = isFileExist(file.path);
      console.log("isExist: >> ", isExist);

      if (isExist) {
        await unlink(file.path);

        await ctx.db
          .delete(files)
          .where(
            and(
              eq(files.id, input.fileId),
              eq(files.userId, ctx.session.user.id),
            ),
          );

        const index = pineconeClient.index(process.env.PINECONE_INDEX);
        const namespace = index.namespace(file.id);
        await namespace.deleteAll();

        return { success: true };
      } else {
        await ctx.db
          .delete(files)
          .where(
            and(
              eq(files.id, input.fileId),
              eq(files.userId, ctx.session.user.id),
            ),
          );
        throw new TRPCError({
          code: fileErrors.deleteFailed.code,
          message: fileErrors.deleteFailed.message,
        });
      }
    }),
});
