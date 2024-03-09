"use client";
import { RxReload } from "react-icons/rx";
import { Typography } from "antd";

import { type FileTypes } from "@/types/types";
import { api } from "@/trpc/provider";
import ChatInput from "./ChatInput";
import { alerts } from "@/lib/alerts/alerts";

const { Text } = Typography;

interface ChatWrapperProps {
  fileId: string;
  fileType: FileTypes;
}

const ChatWrapper = ({ fileId, fileType }: ChatWrapperProps) => {
  // const { data: fileStatus, isLoading } = api.files.fileStatus.useQuery(
  //   {
  //     fileId: fileId,
  //   },
  //   {
  //     refetchInterval: (data) =>
  //       data?.status === "PENDING" || data?.status === "SUCCESS" ? false : 500,
  //   },
  // );

  const isLoading = true;

  if (isLoading)
    return (
      <div className="flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 bg-zinc-50">
        <div className="mb-28 flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <RxReload className="h-8 w-8 animate-spin text-primary" />
            <h3 className="text-xl font-semibold">Loading...</h3>
            <Text type="secondary" strong>
              {alerts.chatLoading.message}
            </Text>
          </div>
        </div>

        <ChatInput />
      </div>
    );
};

export default ChatWrapper;
