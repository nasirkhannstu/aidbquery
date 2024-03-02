import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { DocxLoader } from "langchain/document_loaders/fs/docx";
import path from "path";
import { readFile } from "fs/promises";

import { middleware } from "./middleware";
import { db } from "@/db/prisma";
import { getPineconeClient } from "../pinecone";
import { textExtractorFromDoc } from "../doc";
import { pinecone_index } from "../utils";

// NOTE: This stuff is working on MS Word (.doc, .docx)
export const onUploadCompleteDOC = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>;
  file: {
    key: string;
    name: string;
    url: string;
    path: string;
    fileType: "DOC";
    mimeType:
      | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      | "application/msword"
      | "application/ms-doc"
      | "application/doc";
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
      fileType: file.fileType,
    },
  });

  try {
    const filePath = path.join(process.cwd(), "public/uploads/docs", file.path);
    const fileData = await readFile(filePath);
    const blob = new Blob([fileData], { type: file.mimeType });
    const loader = new DocxLoader(blob);
    const pageLevelDocs = await loader.load();

    // vectorize and index entire document
    const pinecone = await getPineconeClient();
    const pineconeIndex = pinecone.Index(pinecone_index);
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
    await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
      pineconeIndex,
      namespace: String(createdFile.id),
    });

    const texts = await textExtractorFromDoc(file.path);

    await db.files.update({
      data: {
        uploadStatus: "SUCCESS",
        texts,
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
