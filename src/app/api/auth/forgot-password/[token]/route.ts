import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { db } from "@/db/prisma";

export const POST = async (
  request: Request,
  { params: { token } }: { params: { token: string } },
) => {
  try {
    const { password, confirmPassword } = await request.json();

    const forgotPassword = await db.forgotPasswords.findFirst({
      where: {
        token,
      },
    });

    if (!forgotPassword)
      return NextResponse.json({ message: "Not found" }, { status: 400 });

    if (password !== confirmPassword)
      return NextResponse.json(
        { message: "The password did not match." },
        { status: 400 },
      );

    const hashPass = await bcrypt.hash(password, 12);

    const user = await db.users.update({
      where: {
        email: forgotPassword.email,
      },
      data: {
        password: hashPass,
      },
    });

    await db.forgotPasswords.update({
      where: {
        userId: user.id,
        token,
        id: forgotPassword.id,
      },
      data: {
        status: "SUCCESS",
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: "something went wrong!" },
      { status: 500 },
    );
  }
};
