import React, { PropsWithChildren } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billing",
  description: "User billing page",
};

const BillingLayout = ({ children }: PropsWithChildren) => {
  return <>{children}</>;
};

export default BillingLayout;
