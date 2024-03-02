import React from "react";
import { Metadata } from "next";

import FixMaxWidth from "@/components/FixMaxWidth";

export const metadata: Metadata = {
  title: "Register New User",
  description: "User can create new account",
  openGraph: {
    images: ["./opengraph-image.png"],
  },
};

const RegisterLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <FixMaxWidth className="flex min-h-screen w-full items-center justify-center">
      {children}
    </FixMaxWidth>
  );
};

export default RegisterLayout;
