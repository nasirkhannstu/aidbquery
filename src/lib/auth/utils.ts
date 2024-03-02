import { redirect } from "next/navigation";

import { db } from "@/db/prisma";

export const verifyForgotPasswordToken = async (
  token: string,
): Promise<"expired" | "done"> => {
  const expireTime = 15 * 60 * 1000;
  const verify = await db.forgotPasswords.findFirst({
    where: {
      token,
    },
  });

  if (!verify) redirect("/authentication/forgot-password");

  const time = Date.now() - Number(verify.createdAt);

  if (time > expireTime) {
    return "expired";
  } else {
    return "done";
  }
};

export const LOGIN_ERRORS: Readonly<{
  wrongCredentials: string;
  inactive: string;
}> = {
  wrongCredentials: "Invalid credentials",
  inactive: "Your account is inactive, please contact with admin.",
};
