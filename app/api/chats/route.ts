import { db } from "@/db";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { PineconeStore } from "@langchain/pinecone";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { openai, embeddings } from "@/lib/openai";
import { pineconeClient } from "@/lib/pinecne";
import { getServerAuthSession } from "@/lib/authOptions";
import { APIErrors } from "@/lib/alerts/alerts.api";
import { messages } from "@/db/schema";

export const runtime = "edge";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const session = await getServerAuthSession();

  if (!session?.user.id) return new Response("Unauthorized", { status: 401 });

  const { fileId, message } = z
    .object({
      fileId: z.string(),
      message: z.string(),
    })
    .parse(body);

  const file = await db.query.files.findFirst({
    where: (files, { eq, and }) =>
      and(eq(files.id, fileId), eq(files.userId, session.user.id)),
  });

  if (!file)
    return NextResponse.json(
      { msg: APIErrors.fileNotFound.message },
      { status: APIErrors.fileNotFound.code },
    );

  await db.insert(messages).values({
    fileId,
    content: message,
    userId: session.user.id,
    role: "user",
  });

  const index = pineconeClient.index(process.env.PINECONE_INDEX);
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
    namespace: file.id,
  });

  const results = await vectorStore.similaritySearch(message, 4);

  const prevMessages = await db.query.messages.findMany({
    where: (messages, { eq }) => eq(messages.fileId, fileId),
    limit: 6,
    orderBy: (messages, { asc }) => asc(messages.createdAt),
  });

  const formattedPrevMessages = prevMessages.map((msg) => ({
    role: msg.role === "user" ? ("user" as const) : ("assistant" as const),
    content: msg.content,
  }));

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0.2,
    stream: true,
    messages: [
      {
        role: "system",
        content:
          "Use the following pieces of context (or previous conversation if needed) to answer the users question in markdown format.",
      },
      {
        role: "user",
        content: `Use the following pieces of context (or previous conversation if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
        
  \n----------------\n
  
  PREVIOUS CONVERSATION:
  ${formattedPrevMessages
    .map((message) => {
      if (message.role === "user") return `User: ${message.content}\n`;
      return `Assistant: ${message.content}\n`;
    })
    .join("")}
  
  \n----------------\n
  
  CONTEXT:
  ${results.map((r) => r.pageContent).join("\n\n")}
  
  USER INPUT: ${message}`,
      },
    ],
  });

  console.log(
    "with join: ",
    formattedPrevMessages
      .map((message) => {
        if (message.role === "user") return `User: ${message.content}\n`;
        return `Assistant: ${message.content}\n`;
      })
      .join(""),
  );

  console.log(
    "without join: ",
    formattedPrevMessages.map((message) => {
      if (message.role === "user") return `User: ${message.content}\n`;
      return `Assistant: ${message.content}\n`;
    }),
  );

  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      await db.insert(messages).values({
        fileId,
        content: completion,
        role: "assistant",
        userId: session.user.id,
      });
    },
  });

  return new StreamingTextResponse(stream);
};

export const GET = async (request: NextRequest) => {
  const session = await getServerAuthSession();
  if (session) return new Response("Unauthorized", { status: 401 });

  const { fileId } = await request.json();
  if (!fileId) return;

  const messages = await db.query.messages.findMany({
    where: (messages, { eq }) => eq(messages.fileId, fileId as string),
    orderBy: (messages, { asc }) => asc(messages.createdAt),
  });

  return NextResponse.json(messages, { status: 200 });
};
