import { z } from "zod";
import { Settings } from "@prisma/client";

import { adminProcedure, publicProcedure } from "../trpc";
import { db } from "@/db/prisma";

export const getSocialMedia = () =>
  publicProcedure.query(async () => {
    let settings: Settings | null;
    settings = await db.settings.findFirst();

    if (!settings) {
      settings = await db.settings.create({
        data: {},
      });
    }

    return settings;
  });

export const setupSocialMedia = () =>
  adminProcedure
    .input(
      z.object({
        type: z.enum(["facebook", "twitter", "support"]),
        facebook: z.string().url({ message: "Invalid URL format." }).optional(),

        twitter: z.string().url({ message: "Invalid URL format." }).optional(),
        support: z
          .string()
          .email({ message: "Invalid email format." })
          .optional(),
      }),
    )
    .mutation(async ({ input }) => {
      let settings: Settings | null;
      settings = await db.settings.findFirst();

      if (!settings) {
        settings = await db.settings.create({
          data: {},
        });
      }

      await db.settings.update({
        data: {
          [input.type]: input[input.type],
        },
        where: {
          id: settings.id,
        },
      });

      return { success: true, type: input.type };
    });
