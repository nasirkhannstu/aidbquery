import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth/authOption";

const AuthenticationLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;
  const user = session?.user;

  if (session || id || user) redirect("/files");

  return <>{children}</>;
};

export default AuthenticationLayout;
