import React from "react";
import { Metadata } from "next";

import FixMaxWidth from "@/components/FixMaxWidth";
import { absURL } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: absURL("/") as unknown as URL, // (1
  title: "Login",
  description: "User login page",
  openGraph: {
    images: ["./opengraph-image.png"],
  },
};

const LoginLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <FixMaxWidth className="flex min-h-screen w-full items-center justify-center">
      {children}
    </FixMaxWidth>
  );
};

export default LoginLayout;
