import path from "path";
import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { v4 } from "uuid";

import { onUploadCompleteDOC } from "@/lib/on-upload/doc";
import { authOptions } from "@/lib/auth/authOption";
import { middleware } from "@/lib/on-upload/middleware";
import { getUserSubscriptionPlan } from "@/config/using_mode";
import { db } from "@/db/prisma";

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
    const file: File | null = formData.get("doc") as unknown as File;
    if (!file) {
      return NextResponse.json({ message: "File not found" }, { status: 404 });
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

    // Check if doc is allowed
    if (!plan.docx?.isAllowed) {
      return NextResponse.json(
        {
          message:
            "Sorry, you do not have the necessary permissions to upload Doc files.",
          title: "Insufficient Permissions",
        },
        { status: 500 },
      );
    }

    // Check file size
    if (file.size > plan.docx!.fileSize * 1000) {
      return NextResponse.json(
        {
          message:
            "The uploaded Doc file exceeds the maximum allowed file size.",
          title: "File size exceeded",
        },
        { status: 500 },
      );
    }

    // check all quota
    if ((userLimit?.documentUploadQuoteUsed ?? 0) >= (plan.quota as number)) {
      return NextResponse.json(
        {
          title: "Upload Quota Exceeded",
          message:
            "You have reached the maximum upload limit for this session.",
        },
        { status: 500 },
      );
    }

    // Check docx quota
    if ((userLimit?.docxQuoteUsed ?? 0) >= plan.docx!.quota) {
      return NextResponse.json(
        {
          title: "Doc Upload Quota Exceeded",
          message:
            "You have reached the maximum Doc file upload limit for this session.",
        },
        { status: 500 },
      );
    }

    // FIXME: there is a bug here to get doc/docx file page size (pagesPerDocx)

    if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "application/msword" ||
      file.type === "application/doc" ||
      file.type === "application/ms-doc"
    ) {
      const bites = await file.arrayBuffer();
      if (bites.byteLength === 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Empty Document uploaded",
            title: "File is empty",
          },
          { status: 400 },
        );
      }
      const buffer = Buffer.from(bites);
      const fileExt = path.extname(file.name);
      const fileName = `${session?.user?.id}-${Date.now()}` + fileExt;
      const filePath = path.join(
        process.cwd(),
        "public/uploads/docs",
        fileName,
      );

      await fs.writeFile(filePath, buffer);
      const key = v4();

      await onUploadCompleteDOC({
        metadata: await middleware(),
        file: {
          key: key,
          name: file.name,
          url: `${process.env.ORIGIN}/uploads/docs/${fileName}`,
          path: fileName,
          fileType: "DOC",
          mimeType: file.type,
        },
      });

      await db.userSettings.update({
        where: { id: userLimit?.id },
        data: {
          documentUploadQuoteUsed: { increment: 1 },
          docxQuoteUsed: { increment: 1 },
        },
      });

      return NextResponse.json(
        { success: true, doc: filePath, key },
        { status: 201 },
      );
    } else {
      return NextResponse.json(
        {
          message:
            "The file you are trying to upload is either not in Doc format or exceeds the allowable size limit.",
        },
        { status: 400 },
      );
    }
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Something went wrong!" },
      { status: 500 },
    );
  }
};
