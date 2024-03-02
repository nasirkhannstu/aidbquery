import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { OpenAIStream, StreamingTextResponse } from "ai";
import fs from "fs";
import path from "path";

import { SendMessageValidator } from "@/lib/validators/MessageValidator";
import { db } from "@/db/prisma";
import { openai } from "@/lib/openai";
import { authOptions } from "@/lib/auth/authOption";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const id = user?.id;

  if (!id) return new Response("Unauthorized", { status: 401 });

  const { fileId, message } = SendMessageValidator.parse(body);

  const file = await db.files.findFirst({
    where: {
      id: fileId,
      userId: id,
    },
  });

  if (!file) return new Response("Not found", { status: 404 });

  const imageAsBase64 = fs.readFileSync(
    path.join(`${process.cwd()}/public/uploads/images/${file.path}`),
    "base64",
  );
  const image_url = `data:image/png;base64,${imageAsBase64}`;

  await db.messages.create({
    data: {
      text: message,
      isUserMessage: true,
      userId: id,
      fileId: fileId,
    },
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    temperature: 0,
    stream: true,
    messages: [
      { role: "system", content: message },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: image_url },
          },
        ],
      },
    ],
    max_tokens: 2000,
  });

  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      await db.messages.create({
        data: {
          text: completion,
          isUserMessage: false,
          fileId: fileId,
          userId: id,
        },
      });
    },
  });

  return new StreamingTextResponse(stream);
};
