import FilesListMenu from "@/components/FilesListMenu";
import { type ReactNode } from "react";

const ChatLayout = ({
  children,
  params: { chatId },
}: {
  children: ReactNode;
  params: { chatId: string };
}) => {
  return (
    <div className="flex h-full max-h-full w-full flex-1 gap-x-3">
      <>
        <FilesListMenu />
      </>
      <>{children}</>
    </div>
  );
};

export default ChatLayout;
