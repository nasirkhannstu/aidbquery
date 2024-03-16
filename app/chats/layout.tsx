import { type PropsWithChildren } from "react";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat",
  description: "Chat with your files",
};

const ChatsLayout = ({ children }: PropsWithChildren) => {
  return <>{children}</>;
};

export default ChatsLayout;
