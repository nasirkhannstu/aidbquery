import React, { PropsWithChildren } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register new account",
  description: "Register new account",
};

const RegisterLayout = ({ children }: PropsWithChildren) => {
  return <>{children}</>;
};

export default RegisterLayout;
