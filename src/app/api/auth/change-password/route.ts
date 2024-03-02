import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOption";
import { db } from "@/db/prisma";

export const POST = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

    const { currentPassword, newPassword, confirmNewPassword } =
      await request.json();

    const user = await db.users.findFirst({
      where: {
        id: session.user?.id,
      },
    });

    if (!user)
      return NextResponse.json(
        { path: "currentPassword", message: "The user does not exist." },
        { status: 409 },
      );

    const isCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isCorrect)
      return NextResponse.json(
        { path: "currentPassword", message: "The password is wrong." },
        { status: 403 },
      );

    const isMatched = newPassword === confirmNewPassword;
    if (!isMatched)
      return NextResponse.json(
        {
          path: "confirmNewPassword",
          message: "The password did not match.",
        },
        { status: 409 },
      );

    const hashPass = await bcrypt.hash(newPassword, 12);

    await db.users.update({
      where: { id: session?.user?.id },
      data: {
        password: hashPass,
      },
    });

    await db.forgotPasswords.create({
      data: {
        email: user.email,
        userId: user.id,
        reason: "CHANGE",
        status: "SUCCESS",
        token: null,
      },
    });

    return NextResponse.json(
      { message: "The password was successfully changed." },
      { status: 200 },
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 },
    );
  }
};
