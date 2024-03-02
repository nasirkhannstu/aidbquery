import React, { PropsWithChildren } from "react";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth/authOption";
import FixMaxWidth from "@/components/FixMaxWidth";
import DashboardItemList from "@/components/Admin/DashboardItemList";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Admin Dashboard",
};

const AdminRootLayout = async ({ children }: PropsWithChildren) => {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") redirect("/files");

  return (
    <FixMaxWidth className="flex min-w-full gap-4 px-0 md:min-h-[calc(100vh-56px)] md:px-0">
      <DashboardItemList />
      {children}
    </FixMaxWidth>
  );
};

export default AdminRootLayout;
