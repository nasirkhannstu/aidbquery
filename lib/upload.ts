import { extname, join } from "path";
import { mkdir, access, writeFile, readFile } from "fs/promises";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { PineconeStore } from "@langchain/pinecone";

import { type FileTypes } from "@/types/types";
import { pineconeClient } from "./pinecne";
import { embeddings } from "./openai";
import { db } from "@/db";
import { files } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * @description Uploads file to public folder
 * @param file {File}
 * @param fileType {FileTypes}
 */
export const fileUploader = async (
  file: File,
  fileType: FileTypes,
  userId: string,
) => {
  const uploadFolder = join(
    process.cwd(),
    "public",
    "uploads",
    fileType === "CSV" ? "csvs" : "jsons",
  );

  // create folder if not exists
  await access(uploadFolder).catch(
    async () => await mkdir(uploadFolder, { recursive: true }),
  );

  const fileExt = extname(file.name);
  const fileName = `${userId}-${Date.now()}${fileExt}`;
  const filePath = join(uploadFolder, fileName);

  await writeFile(filePath, new Uint8Array(await file.arrayBuffer()));

  return { filePath, fileName };
};

/**
 *
 * @param userId {string}
 * @param fileName {string}
 * @param filePath {string}
 * @returns boolean
 */
export const embeddingInPineconeCSV = async (
  userId: string,
  fileName: string,
  filePath: string,
) => {
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

    const file = join(filePath);
    const data = await readFile(file);
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
