import { OpenAIEmbeddings } from "@langchain/openai";
import { OpenAI } from "openai";

export const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
