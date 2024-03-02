import React from "react";
import { Metadata } from "next";

import FixMaxWidth from "@/components/FixMaxWidth";

export const metadata: Metadata = {
  title: "Forgot your password",
  description: "Existing user can reset his/her forgotten password.",
  openGraph: {
    images: ["./opengraph-image.png"],
  },
};

const ForgotPasswordLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <FixMaxWidth className="flex min-h-screen w-full items-center justify-center">
      {children}
    </FixMaxWidth>
  );
};

export default ForgotPasswordLayout;
