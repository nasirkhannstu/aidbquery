import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import path from "path";
import { readFile } from "fs/promises";
import { FileType } from "@prisma/client";

import { getPineconeClient } from "@/lib/pinecone";
import { db } from "@/db/prisma";
import { pinecone_index } from "../utils";
import { middleware } from "./middleware";

/**
 * @param param0 metadata
 * @param param1 file
 * @returns void
 */
export const onUploadCompleteCSV = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>;
  file: {
    key: string;
    name: string;
    url: string;
    path: string;
  };
}) => {
  const isFileExist = await db.files.findFirst({
    where: {
      key: file.key,
    },
  });

  if (isFileExist) return;

  const createdFile = await db.files.create({
    data: {
      key: file.key,
      name: file.name,
      userId: metadata.userId,
      url: file.url,
      uploadStatus: "PROCESSING",
      path: file.path,
      fileType: FileType.CSV,
    },
  });

  try {
    const filePath = path.join(process.cwd(), "public/uploads/csvs", file.path);
    const fileData = await readFile(filePath);
    const blob = new Blob([fileData], { type: "text/csv" });

    const loader = new CSVLoader(blob);
    const rowsLevelDoc = await loader.load();

    // vectorize and index entire document
    const pinecone = await getPineconeClient();
    const pineconeIndex = pinecone.Index(pinecone_index);

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    await PineconeStore.fromDocuments(rowsLevelDoc, embeddings, {
      pineconeIndex,
      namespace: String(createdFile.id),
    });

    await db.files.update({
      data: {
        uploadStatus: "SUCCESS",
        fileSize: blob.size / 1024,
        csvRowCount: rowsLevelDoc.length,
      },
      where: {
        id: createdFile.id,
      },
    });
  } catch (err: any) {
    await db.files.update({
      data: {
        uploadStatus: "FAILED",
      },
      where: {
        id: createdFile.id,
      },
    });
  }
};
