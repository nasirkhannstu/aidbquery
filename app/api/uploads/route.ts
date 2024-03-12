import { NextResponse, type NextRequest } from "next/server";

import { getServerAuthSession } from "@/lib/authOptions";
import { APIErrors, alerts } from "@/lib/alerts/alerts.api";
import {
  fileUploader,
  type EmbeddingResponse,
  embeddingAICSV,
  embeddingAIJSON,
} from "@/lib/embedding";
import { mimeTypeToFileType } from "@/lib/utils";
import { type MimeTypes } from "@/types/types";

export const POST = async (request: NextRequest) => {
  try {
    const session = await getServerAuthSession();
    if (!session)
      return NextResponse.json(
        { msg: APIErrors.unauthorized.message },
        { status: APIErrors.unauthorized.code },
      );

    const formData = await request.formData();
    const file = formData.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json(
        { msg: APIErrors.fileNotFound.message },
        { status: APIErrors.fileNotFound.code },
      );
    }

    if (!["application/json", "text/csv"].includes(file.type)) {
      return NextResponse.json(
        { msg: APIErrors.invalidFile.message },
        { status: APIErrors.invalidFile.code },
      );
    }

    const { fileName, filePath } = await fileUploader(
      file,
      mimeTypeToFileType(file.type as MimeTypes),
      session.user.id,
    );

    let embeddings: EmbeddingResponse = { fileId: null, success: false };

    if (file.type === "text/csv") {
      embeddings = await embeddingAICSV(session.user.id, fileName, filePath);
    } else if (file.type === "application/json") {
      embeddings = await embeddingAIJSON(session.user.id, fileName, filePath);
    }

    if (embeddings.success) {
      return NextResponse.json(
        {
          success: true,
          msg: alerts.uploadSucceed.message,
          fileId: embeddings.fileId,
        },
        { status: alerts.uploadSucceed.code },
      );
    } else {
      return NextResponse.json(
        { msg: APIErrors.catchAll.message },
        { status: APIErrors.catchAll.code },
      );
    }
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, msg: APIErrors.catchAll.message },
      { status: APIErrors.catchAll.code },
    );
  }
};
