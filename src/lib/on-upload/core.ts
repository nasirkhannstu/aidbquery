import { getServerSession } from "next-auth";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import path from "path";
import { FileType } from "@prisma/client";
import { readFile } from "fs/promises";

import { getPineconeClient } from "@/lib/pinecone";
import { getUserSubscriptionPlan } from "@/config/using_mode";
import { db } from "@/db/prisma";
import { authOptions } from "@/lib/auth/authOption";
import { pinecone_index } from "../utils";

export const middleware = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user || !user.id) throw new Error("Unauthorized");

  const subscriptionPlan = await getUserSubscriptionPlan();

  return { subscriptionPlan, userId: user.id };
};

/**
 * @param param0 metadata
 * @param param1 file
 * @returns void
 */
export const onUploadCompletePDF = async ({
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
    },
  });

  try {
    const filePath = path.join(process.cwd(), "public/uploads/pdfs", file.path);
    const fileData = await readFile(filePath);
    const blob = new Blob([fileData], { type: "application/pdf" });

    const loader = new PDFLoader(blob);
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

    await db.files.update({
      data: {
        uploadStatus: "SUCCESS",
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

// NOTE: get data from url
export const onUploadCompleteURL = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>;
  file: {
    key: string;
    name: string;
    url: string;
    path: string;
    fileType: FileType;
    text: string;
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
      texts: file.text,
    },
  });

  try {
    const filePath = path.join(
      process.cwd(),
      "public/uploads/texts",
      file.path,
    );
    const fileData = await readFile(filePath);
    const blob = new Blob([fileData], { type: "text/plain" });

    const loader = new TextLoader(blob);
    const pageLevelDocs = await loader.load();

    const pinecone = await getPineconeClient();
    const pineconeIndex = pinecone.Index(pinecone_index);
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
      pineconeIndex,
      namespace: String(createdFile.id),
    });

    await db.files.update({
      data: {
        uploadStatus: "SUCCESS",
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

// NOTE: get data from url
export const onUploadCompleteImage = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>;
  file: {
    key: string;
    name: string;
    url: string;
    path: string;
    fileType: "IMAGE";
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
    await db.files.update({
      data: {
        uploadStatus: "SUCCESS",
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

/**
 *
 * @param param0 metadata
 * @param param1 file
 * @returns void
 */
export const onUploadCompleteText = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>;
  file: {
    key: string;
    name: string;
    url: string;
    path: string;
    type: FileType;
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
      fileType: file.type,
    },
  });

  try {
    const filePath = path.join(
      process.cwd(),
      "public/uploads/texts",
      file.path,
    );
    const fileData = await readFile(filePath);
    const blob = new Blob([fileData], { type: "text/plain" });
    const texts = await blob.text();
    const loader = new TextLoader(blob);
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
