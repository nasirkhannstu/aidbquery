import React, { ReactNode } from "react";

import { type FileTypes } from "@/types/types";
interface ChatContextProviderProps {
  fileId: string;
  fileType: FileTypes;
  children: ReactNode;
}

const ChatContextProvider = ({
  fileId,
  fileType,
  children,
}: ChatContextProviderProps) => {
  return <>{children}</>;
};

export default ChatContextProvider;
