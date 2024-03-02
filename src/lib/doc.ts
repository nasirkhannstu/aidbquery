import { TRPCError } from "@trpc/server";
import mammoth from "mammoth";
import path from "path";

export const textExtractorFromDoc = async (docPath: string) => {
  try {
    const result = await mammoth.extractRawText({
      path: path.join(process.cwd(), "public/uploads/docs", docPath),
    });

    return result.value;
  } catch (err: any) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: err.message || "something went wrong",
    });
  }
};
