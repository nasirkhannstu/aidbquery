import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { privateProcedure } from "../trpc";
import { db } from "@/db/prisma";

export const getTextTexts = () => {
  return privateProcedure
    .input(z.object({ path: z.string() }))
    .query(async ({ ctx, input }) => {
      const file = await db.files.findFirst({
        where: {
          path: input.path,
          userId: ctx.userId,
        },
      });

      if (!file)
        throw new TRPCError({ code: "NOT_FOUND", message: "File not found" });

      return { texts: file.texts, title: file.name };
    });
};
