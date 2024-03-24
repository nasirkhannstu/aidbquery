import { NextResponse, type NextRequest } from "next/server";

import { getServerAuthSession } from "@/lib/authOptions";
import { APIErrors } from "@/lib/alerts/alerts.api";
import { fileUploader } from "@/lib/embedding";

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

    if (!["image/png", "image/jpg", "image/jpeg"].includes(file.type)) {
      return NextResponse.json(
        { msg: APIErrors.invalidFile.message },
        { status: APIErrors.invalidFile.code },
      );
    }

    const { fileName } = await fileUploader(file, "AVATAR", session.user.id);

    return NextResponse.json({ success: true, avatar: fileName });
  } catch (error: unknown) {
    console.log(error);

    return NextResponse.json(
      { success: false, msg: APIErrors.catchAll.message },
      { status: APIErrors.catchAll.code },
    );
  }
};
