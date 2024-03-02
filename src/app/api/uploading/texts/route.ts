import path from "path";
import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { v4 } from "uuid";

import { middleware, onUploadCompleteText } from "@/lib/on-upload/core";
import { authOptions } from "@/lib/auth/authOption";
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
    const file: File | null = formData.get("text") as unknown as File;
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

    // Check if image is allowed
    if (!plan.txt?.isAllowed) {
      return NextResponse.json(
        {
          title: "Insufficient Permissions",
          message:
            "Sorry, you do not have the necessary permissions to upload TEXT files.",
        },
        { status: 500 },
      );
    }

    // Check file size
    if (file.size > plan.txt!.fileSize * 1000) {
      return NextResponse.json(
        {
          title: "File Size Exceeded",
          message:
            "The uploaded TEXT file exceeds the maximum allowed file size.",
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
    if ((userLimit?.textQuoteUsed ?? 0) >= plan.txt!.quota) {
      return NextResponse.json(
        {
          title: "Text file Upload Quota Exceeded",
          message:
            "You have reached the maximum TEXT file upload limit for this session.",
        },
        { status: 500 },
      );
    }

    if (file.type === "text/plain") {
      const bites = await file.arrayBuffer();
      if (bites.byteLength === 0) {
        return NextResponse.json(
          {
            success: false,
            title: "File is empty",
            message: "Empty document uploaded.",
          },
          { status: 400 },
        );
      }
      const buffer = Buffer.from(bites);
      const fileExt = path.extname(file.name);
      const fileName = `${session?.user?.id}-${Date.now()}` + fileExt;
      const filePath = path.join(
        process.cwd(),
        "public/uploads/texts",
        fileName,
      );

      await fs.writeFile(filePath, buffer);
      const key = v4();

      await onUploadCompleteText({
        metadata: await middleware(),
        file: {
          key: key,
          name: file.name,
          url: `${process.env.ORIGIN}/uploads/texts/${fileName}`,
          path: fileName,
          type: "TEXT",
        },
      });

      await db.userSettings.update({
        where: { id: userLimit?.id },
        data: {
          documentUploadQuoteUsed: { increment: 1 },
          textQuoteUsed: { increment: 1 },
        },
      });

      return NextResponse.json(
        { success: true, pdf: filePath, key },
        { status: 201 },
      );
    } else {
      return NextResponse.json(
        {
          title: "Invalid File Format or Size",
          message:
            "The file you are trying to upload is either not in .txt format or exceeds the allowable size limit.",
        },
        { status: 400 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
};
