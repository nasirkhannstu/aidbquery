import path from "path";
import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { v4 } from "uuid";

import { middleware, onUploadCompletePDF } from "@/lib/on-upload/core";
import { authOptions } from "@/lib/auth/authOption";
import { db } from "@/db/prisma";
import { getUserSubscriptionPlan } from "@/config/using_mode";

export const POST = async (request: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    const plan = await getUserSubscriptionPlan();

    if (!session || !session.user || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 409 });
    }
    const user = await db.users.findFirst({ where: { id: session.user.id } });
    const userLimit = await db.userSettings.findFirst({
      where: { id: user?.userSettingId },
    });
    const formData = await request.formData();
    const file: File | null = formData.get("pdf") as unknown as File;
    if (!file) {
      return NextResponse.json({ message: "File not found!" }, { status: 404 });
    }

    if (user?.status === "SUSPEND") {
      return NextResponse.json(
        {
          message: "Your account is suspended, you cannot upload documents.",
          title: "Account Suspended",
        },
        { status: 500 },
      );
    }

    // Check if image is allowed
    if (!plan.pdf?.isAllowed) {
      return NextResponse.json(
        {
          message:
            "Sorry, you do not have the necessary permissions to upload PDF files.",
          title: "Insufficient Permissions",
        },
        { status: 500 },
      );
    }

    // Check file size
    if (file.size > plan.pdf!.fileSize * 1000) {
      return NextResponse.json(
        {
          message:
            "The uploaded PDF file exceeds the maximum allowed file size.",
          title: "File Size Exceeded",
        },
        { status: 500 },
      );
    }

    // check all quota
    if ((userLimit?.documentUploadQuoteUsed ?? 0) >= (plan!.quota as number)) {
      return NextResponse.json(
        {
          title: "Upload Quota Exceeded",
          message:
            "You have reached the maximum upload limit for this session.",
        },
        { status: 500 },
      );
    }

    // Check quota
    if ((userLimit?.pdfQuoteUsed ?? 0) >= plan.pdf!.quota) {
      return NextResponse.json(
        {
          message:
            "You have reached the maximum PDF file upload limit for this session.",
          title: "PDF Upload Quota Exceeded",
        },
        { status: 500 },
      );
    }

    // page size checked
    const loader = new PDFLoader(file);

    if ((loader.filePathOrBlob as File).size === 0) {
      return NextResponse.json(
        {
          message: "Empty document uploaded.",
          title: "File is empty",
        },
        { status: 500 },
      );
    }

    const pageLevelDocs = await loader.load();
    const pagesAmt = pageLevelDocs.length;
    if (pagesAmt > plan.pdf!.pagesPerPdf) {
      return NextResponse.json(
        {
          message:
            "The uploaded PDF contains pages that exceed the allowable size limit based on your current plan.",
          title: "Page Size Limit Exceeded",
        },
        { status: 500 },
      );
    }

    if (file.type === "application/pdf") {
      const bites = await file.arrayBuffer();
      const buffer = Buffer.from(bites);
      const fileExt = path.extname(file.name);
      const fileName = `${session?.user?.id}-${Date.now()}` + fileExt;
      const filePath = path.join(
        process.cwd(),
        "public/uploads/pdfs",
        fileName,
      );

      await fs.writeFile(filePath, buffer);
      const key = v4();

      await onUploadCompletePDF({
        metadata: await middleware(),
        file: {
          key: key,
          name: file.name,
          url: `${process.env.ORIGIN}/uploads/pdfs/${fileName}`,
          path: fileName,
        },
      });

      await db.userSettings.update({
        where: { id: userLimit?.id },
        data: {
          documentUploadQuoteUsed: { increment: 1 },
          pdfQuoteUsed: { increment: 1 },
        },
      });

      return NextResponse.json(
        { success: true, pdf: filePath, key },
        { status: 201 },
      );
    } else {
      return NextResponse.json(
        {
          message:
            "The file you are attempting to upload is not in a supported format. Please try again with a PDF file.",
          title: "Unsupported File Format.",
        },
        { status: 400 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Something went wrong!" },
      { status: 500 },
    );
  }
};
