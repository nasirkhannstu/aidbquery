import { Metadata } from "next";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Settings",
  description: "Dashboard settings",
};

const DashboardSettingsLayout = ({ children }: PropsWithChildren) => {
  return <>{children}</>;
};

export default DashboardSettingsLayout;
