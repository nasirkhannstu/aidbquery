import React, { type PropsWithChildren } from "react";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Register new account",
  description: "Register new account",
};

const RegisterLayout = ({ children }: PropsWithChildren) => {
  return <>{children}</>;
};

export default RegisterLayout;
