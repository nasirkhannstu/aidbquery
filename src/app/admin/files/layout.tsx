import React, { PropsWithChildren } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "File List",
  description: "Files Dashboard",
};

const DashboardFilesLayout = async ({ children }: PropsWithChildren) => {
  return <>{children}</>;
};

export default DashboardFilesLayout;
