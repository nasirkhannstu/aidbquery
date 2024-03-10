"use client";
import { RxReload } from "react-icons/rx";
import { Typography } from "antd";

import { api } from "@/trpc/provider";
import ChatInput from "./ChatInput";
import { alerts } from "@/lib/alerts/alerts";
import ChatContextProvider from "@/components/Chats/ChatContextProvider";
import Messages from "./Messages";

const { Text, Title } = Typography;

interface ChatWrapperProps {
  fileId: string;
}

const ChatWrapper = ({ fileId }: ChatWrapperProps) => {
  const { data: fileStatus, isLoading } = api.files.fileStatus.useQuery(
    {
      fileId: fileId,
    },
    {
      refetchInterval: (data) =>
        data?.status === "PENDING" || data?.status === "SUCCESS" ? false : 500,
    },
  );

  if (isLoading)
    return (
      <div className="flex h-full min-h-[calc(100vh-56px)] flex-col justify-between gap-2">
        <div className="flex h-full flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <RxReload className="h-8 w-8 animate-spin text-primary" />
            <Title className="text-xl font-semibold" level={4}>
              Loading...
            </Title>
            <Text type="secondary">{alerts.chatLoading.message}</Text>
          </div>
        </div>
        <ChatInput isDisabled />
      </div>
    );

  return (
    <ChatContextProvider fileId={fileId}>
      <div className="flex h-full min-h-[calc(100vh-56px)] flex-col justify-between gap-2">
        <div className="flex h-full flex-1 items-center justify-center">
          <Messages fileId={fileId} />
        </div>

        <ChatInput />
      </div>
    </ChatContextProvider>
  );
};

export default ChatWrapper;
