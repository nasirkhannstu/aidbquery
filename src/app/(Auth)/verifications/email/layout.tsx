import React, { PropsWithChildren } from "react";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/authOption";

export const metadata: Metadata = {
  title: "Email Verification",
  description: "Verify your email address",
};

const EmailVerifyLayout = async ({ children }: PropsWithChildren) => {
  const session = await getServerSession(authOptions);

  if (session?.user?.isEmailVerify) return redirect("/files");

  return <>{children}</>;
};

export default EmailVerifyLayout;
