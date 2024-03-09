import { type Metadata } from "next";
import { type PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

const LoginLayout = ({ children }: PropsWithChildren) => {
  return <>{children}</>;
};

export default LoginLayout;
