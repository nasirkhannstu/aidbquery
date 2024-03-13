import { type ReactNode } from "react";

import FilesListMenu from "@/components/FilesListMenu";

const ChatLayout = ({ children }: { children: ReactNode }) => {
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
