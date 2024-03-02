import path from "path";
import puppeteer from "puppeteer";
import { writeFile } from "fs/promises";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 } from "uuid";

import { privateProcedure } from "../trpc";
import { middleware, onUploadCompleteURL } from "@/lib/on-upload/core";
import { db } from "@/db/prisma";
import { getUserSubscriptionPlan } from "@/config/using_mode";

export const setUrlData = () => {
  return privateProcedure
    .input(
      z.object({
        url: z.string().url({
          message:
            "Invalid website URL, please try with proper formatting in `http://` or `https://`",
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const plan = await getUserSubscriptionPlan();
      const filesCount = await db.files.count({
        where: {
          id: ctx.userId,
          fileType: "URL",
        },
      });
      // Check if image is allowed
      if (!plan.link?.isAllowed) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You don't have permission for this option.",
        });
      }

      // Check quota
      if (filesCount >= plan.link!.quota) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have reached the text upload limit.",
        });
      }

      const window = await puppeteer.launch();
      const page = await window.newPage();
      await page.goto(input.url);
      const title = await page.title();
      const textContent = await page.evaluate(() => document.body.innerText);

      const filename = ctx.userId + "-" + Date.now() + ".txt";
      const fileUrl = process.env.ORIGIN + "/public/uploads/texts/" + filename;
      const key = v4();
      const filePath = path.join(
        process.cwd(),
        "public/uploads/texts",
        filename,
      );

      await window.close();
      await writeFile(filePath, textContent);

      await onUploadCompleteURL({
        metadata: await middleware(),
        file: {
          key,
          name: title,
          path: filename,
          url: fileUrl,
          fileType: "URL",
          text: textContent,
        },
      });

      return { success: true };
    });
};

export const getUrlData = () => {
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

      return { title: file.name, texts: file.texts };
    });
};
