import React from "react";
import { Metadata } from "next";

import FixMaxWidth from "@/components/FixMaxWidth";

export const metadata: Metadata = {
  title: "Change your password",
  description: "logged in user can change his password.",
};

const ChangePasswordLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <FixMaxWidth className="flex min-h-screen w-full items-center justify-center">
      {children}
    </FixMaxWidth>
  );
};

export default ChangePasswordLayout;
