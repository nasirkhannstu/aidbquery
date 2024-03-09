import { z } from "zod";
import { and, eq } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "@/trpc/server/api/trpc";
import { files } from "@/db/schema";

export const fileRouter = createTRPCRouter({
  fileStatus: publicProcedure
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
});
