import FileListMenu from "@/components/FileListMenu";
import { type ReactNode } from "react";

const ChatLayout = ({
  children,
  params: { chatId },
}: {
  children: ReactNode;
  params: { chatId: string };
}) => {
  return (
    <div className="flex h-full w-full gap-x-3">
      <>
        <FileListMenu />
      </>
      <>{children}</>
    </div>
  );
};

export default ChatLayout;
