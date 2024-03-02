import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/authOption";
import { db } from "@/db/prisma";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Files",
  description: "Authenticated users can view their files here.",
};

const MyFileLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user || !user.id) redirect("/authentication/login");
  const dbUser = await db.users.findFirst({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) redirect("/authentication/login");

  return <>{children}</>;
};

export default MyFileLayout;
