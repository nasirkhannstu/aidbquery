import { type PropsWithChildren } from "react";
import { type Metadata } from "next";

import { getServerAuthSession } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard Layout",
  description: "Dashboard layout",
};

const DashboardLayout = async ({ children }: PropsWithChildren) => {
  const session = await getServerAuthSession();

  if (session?.user.role === "USER")
    return redirect(`/users/${session?.user.id}`);

  return <>{children}</>;
};

export default DashboardLayout;
