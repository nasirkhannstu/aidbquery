import { type PropsWithChildren } from "react";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Pricing plans",
};

const PricingLayout = ({ children }: PropsWithChildren) => {
  return <>{children}</>;
};

export default PricingLayout;
