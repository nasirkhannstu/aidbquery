import path from "path";
import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { v4 } from "uuid";

import { onUploadCompleteCSV } from "@/lib/on-upload/csv";
import { authOptions } from "@/lib/auth/authOption";
import { db } from "@/db/prisma";
import { getUserSubscriptionPlan } from "@/config/using_mode";
import { account_actions, file_actions } from "@/lib/messages/messages";
import { middleware } from "@/lib/on-upload/middleware";

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
    const file: File | null = formData.get("csv") as unknown as File;
    if (!file) {
      return NextResponse.json({ message: "File not found!" }, { status: 404 });
    }

    if (user?.status === "SUSPEND") {
      return NextResponse.json(
        {
          message: account_actions.accountSuspend.message,
          title: account_actions.accountSuspend.title,
        },
        { status: account_actions.accountSuspend.code },
      );
    }

    // Check if image is allowed
    if (!plan.csv?.isAllowed) {
      return NextResponse.json(
        {
          message: file_actions.csv.fileNotAllowed.message,
          title: file_actions.csv.fileNotAllowed.title,
        },
        { status: file_actions.csv.fileNotAllowed.code },
      );
    }

    // Check file size
    if (file.size > plan.csv!.fileSize * 1000) {
      return NextResponse.json(
        {
          message: file_actions.csv.fileSizeExceeded.message,
          title: file_actions.csv.fileSizeExceeded.title,
        },
        { status: file_actions.csv.fileSizeExceeded.code },
      );
    }

    // check all quota
    if ((userLimit?.documentUploadQuoteUsed ?? 0) >= (plan!.quota as number)) {
      return NextResponse.json(
        {
          title: file_actions.uploadQuotaExceeded.title,
          message: file_actions.uploadQuotaExceeded.message,
        },
        { status: file_actions.uploadQuotaExceeded.code },
      );
    }

    // Check quota
    if ((userLimit?.csvQuoteUsed ?? 0) >= plan.csv!.quota) {
      return NextResponse.json(
        {
          message: file_actions.csv.quotaExceeded.message,
          title: file_actions.csv.quotaExceeded.title,
        },
        { status: file_actions.csv.quotaExceeded.code },
      );
    }

    // page size checked
    const loader = new CSVLoader(file);

    if ((loader.filePathOrBlob as File).size === 0) {
      return NextResponse.json(
        {
          message: file_actions.emptyFile.message,
          title: file_actions.emptyFile.title,
        },
        { status: file_actions.emptyFile.code },
      );
    }

    const rowsLevelDocs = await loader.load();
    const rowsAmt = rowsLevelDocs.length;
    if (rowsAmt > plan.csv!.rows) {
      return NextResponse.json(
        {
          message: file_actions.csv.rowsExceeded.message,
          title: file_actions.csv.rowsExceeded.title,
        },
        { status: file_actions.csv.rowsExceeded.code },
      );
    }

    if (file.type === "text/csv") {
      const bites = await file.arrayBuffer();
      const buffer = Buffer.from(bites);
      const fileExt = path.extname(file.name);
      const fileName = `${session?.user?.id}-${Date.now()}` + fileExt;
      const filePath = path.join(
        process.cwd(),
        "public/uploads/csvs",
        fileName,
      );

      await fs.writeFile(filePath, buffer);
      const key = v4();

      await onUploadCompleteCSV({
        metadata: await middleware(),
        file: {
          key: key,
          name: file.name,
          url: `${process.env.ORIGIN}/uploads/csvs/${fileName}`,
          path: fileName,
        },
      });

      await db.userSettings.update({
        where: { id: userLimit?.id },
        data: {
          documentUploadQuoteUsed: { increment: 1 },
          csvQuoteUsed: { increment: 1 },
        },
      });

      return NextResponse.json(
        { success: true, csv: filePath, key },
        { status: 201 },
      );
    } else {
      return NextResponse.json(
        {
          message: file_actions.csv.wrongFileType.message,
          title: file_actions.csv.wrongFileType.title,
        },
        { status: file_actions.csv.wrongFileType.code },
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: file_actions.catchAll.message,
        title: file_actions.catchAll.title,
      },
      { status: file_actions.catchAll.code },
    );
  }
};
