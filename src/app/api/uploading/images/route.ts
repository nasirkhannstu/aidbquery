import path from "path";
import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { v4 } from "uuid";

import { middleware, onUploadCompleteImage } from "@/lib/on-upload/core";
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

    if (user?.status === "SUSPEND") {
      return NextResponse.json(
        {
          message: "Your account is suspended, you cannot upload documents.",
          title: "Account Suspended",
        },
        { status: 500 },
      );
    }
    const userLimit = await db.userSettings.findFirst({
      where: { id: user?.userSettingId },
    });

    const formData = await request.formData();
    const file: File | null = formData.get("image") as unknown as File;
    if (!file) {
      return NextResponse.json({ message: "File not found." }, { status: 404 });
    }

    // Check if image is allowed
    if (!plan.image?.isAllowed) {
      return NextResponse.json(
        {
          title: "Insufficient Permissions",
          message:
            "Sorry, you do not have the necessary permissions to upload image files.",
        },
        { status: 500 },
      );
    }

    // Check file size
    if (file.size > plan.image!.fileSize * 1000) {
      return NextResponse.json(
        {
          title: "File Size Exceeded",
          message:
            "The uploaded image file exceeds the maximum allowed file size.",
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
    if ((userLimit?.imageQuoteUsed ?? 0) >= plan.image!.quota) {
      return NextResponse.json(
        {
          title: "Upload Quota Exceeded",
          message:
            "You have reached the maximum image upload limit for this session.",
        },
        { status: 500 },
      );
    }

    // Check file type
    if (
      file.type === "image/png" ||
      file.type === "image/jpeg" ||
      file.type === "image/jpg"
    ) {
      const bites = await file.arrayBuffer();
      const buffer = Buffer.from(bites);
      const fileExt = path.extname(file.name);
      const fileName = `${session?.user?.id}-${Date.now()}` + fileExt;
      const filePath = path.join(
        process.cwd(),
        "public/uploads/images",
        fileName,
      );

      await fs.writeFile(filePath, buffer);
      const key = v4();

      await onUploadCompleteImage({
        metadata: await middleware(),
        file: {
          key: key,
          name: file.name,
          url: `${process.env.ORIGIN}/uploads/images/${fileName}`,
          path: fileName,
          fileType: "IMAGE",
        },
      });

      await db.userSettings.update({
        where: { id: userLimit?.id },
        data: {
          documentUploadQuoteUsed: { increment: 1 },
          imageQuoteUsed: { increment: 1 },
        },
      });

      return NextResponse.json(
        { success: true, image: filePath, key },
        { status: 201 },
      );
    } else {
      return NextResponse.json(
        {
          title: "Invalid File Format or Size",
          message:
            "The file you are trying to upload is either not in image format or exceeds the allowable size limit.",
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
