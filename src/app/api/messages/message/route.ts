import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIStream, StreamingTextResponse } from "ai";

import { getPineconeClient } from "@/lib/pinecone";
import { SendMessageValidator } from "@/lib/validators/MessageValidator";
import { db } from "@/db/prisma";
import { openai } from "@/lib/openai";
import { authOptions } from "@/lib/auth/authOption";
import { pinecone_index } from "@/lib/utils";

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

  await db.messages.create({
    data: {
      text: message,
      isUserMessage: true,
      userId: id,
      fileId: fileId,
    },
  });

  // 1: vectorize message
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
  const pinecone = await getPineconeClient();
  const pineconeIndex = pinecone.Index(pinecone_index);
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    namespace: String(file.id),
  });
  const results = await vectorStore.similaritySearch(message, 4);

  const prevMessages = await db.messages.findMany({
    where: {
      fileId: fileId,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 6,
  });

  const formattedPrevMessages = prevMessages.map((msg) => ({
    role: msg.isUserMessage ? ("user" as const) : ("assistant" as const),
    content: msg.text,
  }));

  const response = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    temperature: 0,
    stream: true,
    messages: [
      {
        role: "system",
        content:
          "Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.",
      },
      {
        role: "user",
        content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
        
  \n----------------\n
  
  PREVIOUS CONVERSATION:
  ${formattedPrevMessages.map((message) => {
    if (message.role === "user") return `User: ${message.content}\n`;
    return `Assistant: ${message.content}\n`;
  })}
  
  \n----------------\n
  
  CONTEXT:
  ${results.map((r) => r.pageContent).join("\n\n")}
  
  USER INPUT: ${message}`,
      },
    ],
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
