import { type PropsWithChildren } from "react";
import { type Metadata } from "next";

import { getServerAuthSession } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { DashboardSideBar } from "@/components/Admin/Sidebar";

export const metadata: Metadata = {
  title: "Dashboard Layout",
  description: "Dashboard layout",
};

const DashboardLayout = async ({ children }: PropsWithChildren) => {
  const session = await getServerAuthSession();

  if (session?.user.role === "USER")
    return redirect(`/users/${session?.user.id}`);

  return (
    <div className="flex max-h-[calc(100vh-var(--navbar-h))]">
      <DashboardSideBar />
      <div className="container">{children}</div>
    </div>
  );
};

export default DashboardLayout;
