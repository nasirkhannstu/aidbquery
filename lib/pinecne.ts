import { Pinecone } from "@pinecone-database/pinecone";

/**
 * Pinecone client configuration
 * @description Pinecone client configuration
 * @see `https://pinecone.io/docs/quickstart`
 */
export const pineconeClient = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});
