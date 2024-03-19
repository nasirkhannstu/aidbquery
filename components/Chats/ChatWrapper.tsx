"use client";

import { RxReload } from "react-icons/rx";
import { useChat } from "ai/react";
import { Typography } from "antd";

import { api } from "@/trpc/provider";
import ChatInput from "./ChatInput";
import { alerts } from "@/lib/alerts/alerts";
import Messages from "./Messages";

const { Text, Title } = Typography;

interface ChatWrapperProps {
  fileId: string;
}

const ChatWrapper = ({ fileId }: ChatWrapperProps) => {
  const { data: _messages, isLoading } = api.messages.fileMessages.useQuery({
    fileId,
  });

  const {
    isLoading: isThinking,
    messages,
    handleSubmit,
    input,
    handleInputChange,
  } = useChat({
    api: "/api/chats",
    initialMessages: _messages?.messages ?? [],
    body: {
      fileId: fileId,
    },
  });

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
        {/* <ChatInput /> */}
      </div>
    );

  return (
    <div className="flex h-full min-h-[calc(100vh-56px)] flex-col justify-between gap-2">
      <div className="flex h-full flex-1 items-center justify-center">
        <Messages isThinking={isThinking} messages={messages} />
      </div>

      <ChatInput
        input={input}
        handleSubmit={handleSubmit}
        handleChange={handleInputChange}
      />
    </div>
  );
};

export default ChatWrapper;
