import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Pricing",
  description: "User pricing page",
  openGraph: {
    images: ["./opengraph-image.png"],
  },
};

const PricingLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default PricingLayout;
