import React, { PropsWithChildren } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User List",
  description: "User list Dashboard",
};

const DashboardUserLayout = async ({ children }: PropsWithChildren) => {
  return <>{children}</>;
};

export default DashboardUserLayout;
