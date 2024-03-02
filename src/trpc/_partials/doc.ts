import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { privateProcedure } from "../trpc";
import { db } from "@/db/prisma";

export const getDOCTexts = () => {
  return privateProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ ctx, input }) => {
      const file = await db.files.findFirst({
        where: {
          id: input.fileId,
          userId: ctx.userId,
        },
      });

      if (!file)
        throw new TRPCError({ code: "NOT_FOUND", message: "File not found" });

      return { title: file.name, texts: file.texts, path: file.path };
    });
};
