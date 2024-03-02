import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs, { unlink } from "fs/promises";

import { authOptions } from "@/lib/auth/authOption";
import { db } from "@/db/prisma";

export const POST = async (request: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("avatar") as unknown as File;
    if (!file) {
      return NextResponse.json(
        { message: "You file is not found" },
        { status: 404 },
      );
    }

    const user = await db.users.findUnique({
      where: {
        id: session?.user.id,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found!" }, { status: 404 });
    }

    if (user?.avatar !== "avatar.png") {
      await unlink(
        path.join(process.cwd(), "public/uploads/avatars", user?.avatar),
      );
    }

    const bites = await file.arrayBuffer();
    const buffer = Buffer.from(bites);
    const fileExt = path.extname(file.name);
    const fileName = `avatar-${session?.user?.id}` + fileExt;
    const filePath = path.join(
      process.cwd(),
      "public/uploads/avatars",
      fileName,
    );
    await fs.writeFile(filePath, buffer);

    const updatedUser = await db.users.update({
      where: {
        id: session?.user?.id,
      },
      data: {
        avatar: fileName,
      },
    });

    return NextResponse.json(
      { success: true, message: "Avatar uploaded", avatar: updatedUser.avatar },
      { status: 200 },
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
};
