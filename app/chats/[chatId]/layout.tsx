import { type ReactNode } from "react";

const ChatLayout = ({
  children,
  params: { chatId },
}: {
  children: ReactNode;
  params: { chatId: string };
}) => {
  return <>{children}</>;
};

export default ChatLayout;
