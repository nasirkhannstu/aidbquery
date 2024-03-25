import { extname, join } from "path";
import { mkdir, access, writeFile, readFile } from "fs/promises";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { PineconeStore } from "@langchain/pinecone";
import { eq } from "drizzle-orm";

import { type FileType } from "@/db/schema";
import { pineconeClient } from "./pinecne";
import { embeddings } from "./openai";
import { db } from "@/db";
import { files } from "@/db/schema";

type TFileTypes = FileType | "AVATAR";

export interface EmbeddingResponse {
  success: boolean;
  fileId: string | null;
}

/**
 * @description Uploads file to public folder
 * @param file {File}
 * @param fileType {FileTypes}
 * @returns {Promise<{ filePath: string; fileName: string }>}
 */
export const fileUploader = async (
  file: File,
  fileType: TFileTypes,
  userId: string,
) => {
  const path =
    fileType === "CSV" ? "csvs" : fileType === "JSON" ? "jsons" : "avatars";

  const uploadFolder = join(process.cwd(), "public", "uploads", path);

  // create folder if not exists
  await access(uploadFolder).catch(
    async () => await mkdir(uploadFolder, { recursive: true }),
  );

  const fileExt = extname(file.name);
  const fileName =
    path === "avatars"
      ? `avatar-${userId}${fileExt}`
      : `${userId}-${Date.now()}${fileExt}`;
  const filePath = join(uploadFolder, fileName);

  await writeFile(filePath, new Uint8Array(await file.arrayBuffer()));

  return { filePath, fileName: file.name, customizeName: fileName };
};

/**
 * @description Embedding AI for CSV files
 * @param userId {string}
 * @param fileName {string}
 * @param filePath {string}
 * @returns boolean
 */
export const embeddingAICSV = async (
  userId: string,
  fileName: string,
  filePath: string,
): Promise<EmbeddingResponse> => {
  try {
    await db.insert(files).values({
      name: fileName,
      path: filePath,
      userId: userId,
      type: "CSV",
      status: "PROCESSING",
    });

    const uploadedFile = await db.query.files.findFirst({
      where: (files, { eq, and }) =>
        and(eq(files.name, fileName), eq(files.status, "PROCESSING")),
    });
    if (!uploadedFile) throw new Error("File not found");

    const data = await readFile(filePath);
    const blob = new Blob([data], { type: "text/csv" });

    const loader = new CSVLoader(blob);
    const document = await loader.load();

    const index = pineconeClient.index(process.env.PINECONE_INDEX);

    await PineconeStore.fromDocuments(document, embeddings, {
      pineconeIndex: index,
      namespace: uploadedFile.id,
    });

    await db
      .update(files)
      .set({ status: "SUCCESS" })
      .where(eq(files.id, uploadedFile.id));

    return { success: true, fileId: uploadedFile.id };
  } catch (error: unknown) {
    await db
      .update(files)
      .set({ status: "FAILED" })
      .where(eq(files.name, fileName));

    return { success: false, fileId: null };
  }
};

/**
 * @description Embedding AI JSON
 * @param userId {string}
 * @param fileName {string}
 * @param filePath {string}
 * @returns boolean
 */
export const embeddingAIJSON = async (
  userId: string,
  fileName: string,
  filePath: string,
): Promise<EmbeddingResponse> => {
  try {
    await db.insert(files).values({
      name: fileName,
      path: filePath,
      userId: userId,
      type: "JSON",
      status: "PROCESSING",
    });

    const uploadedFile = await db.query.files.findFirst({
      where: (files, { eq, and }) =>
        and(eq(files.name, fileName), eq(files.status, "PROCESSING")),
    });
    if (!uploadedFile) throw new Error("File not found");

    const data = await readFile(filePath);
    const blob = new Blob([data], { type: "application/json" });

    const loader = new JSONLoader(blob);
    const document = await loader.load();

    const index = pineconeClient.index(process.env.PINECONE_INDEX);

    await PineconeStore.fromDocuments(document, embeddings, {
      pineconeIndex: index,
      namespace: uploadedFile.id,
    });

    await db
      .update(files)
      .set({ status: "SUCCESS" })
      .where(eq(files.id, uploadedFile.id));

    return { success: true, fileId: uploadedFile.id };
  } catch (error: unknown) {
    await db
      .update(files)
      .set({ status: "FAILED" })
      .where(eq(files.name, fileName));

    return { success: false, fileId: null };
  }
};
