"use client";
import Link from "next/link";
import { LuChevronLeft, LuLoader2, LuXCircle } from "react-icons/lu";
import { FileType } from "@prisma/client";

import { trpc } from "@/app/_trpc/client";
import ChatInputComponent from "@/components/chat/ChatInputComponent";
import MessagesWrapper from "@/components/chat/MessagesWrapper";
import { buttonVariants } from "@/components/ui/button";
import { ChatContextProvider } from "./ChatContextProvider";

interface ChatWrapperProps {
  fileId: string;
  isSubscribed: boolean;
  fileType: FileType;
}

const MainChatWrapper = ({
  fileId,
  isSubscribed,
  fileType,
}: ChatWrapperProps) => {
  const { data: fileStatus, isLoading } = trpc.getFileUploadStatus.useQuery(
    {
      fileId,
    },
    {
      refetchInterval: (data) =>
        data?.status === "SUCCESS" || data?.status === "FAILED" ? false : 500,
    },
  );

  if (isLoading)
    return (
      <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 bg-zinc-50">
        <div className="mb-28 flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <LuLoader2 className="h-8 w-8 animate-spin text-blue-500" />
            <h3 className="text-xl font-semibold">Loading...</h3>
            <p className="text-sm text-zinc-500">
              We&apos;re preparing your {fileType}.
            </p>
          </div>
        </div>

        <ChatInputComponent isDisabled />
      </div>
    );

  if (fileStatus?.status === "PROCESSING")
    return (
      <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 bg-zinc-50">
        <div className="mb-28 flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <LuLoader2 className="h-8 w-8 animate-spin text-blue-500" />
            <h3 className="text-xl font-semibold">Processing {fileType}...</h3>
            <p className="text-sm text-zinc-500">This won&apos;t take long.</p>
          </div>
        </div>

        <ChatInputComponent isDisabled />
      </div>
    );

  if (fileStatus?.status === "FAILED")
    return (
      <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 bg-zinc-50">
        <div className="mb-28 flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <LuXCircle className="h-8 w-8 text-red-500" />
            <h3 className="text-xl font-semibold">
              Something went wrong with your document.
            </h3>
            <p className="text-sm text-zinc-500">
              Your{" "}
              <span className="font-medium">
                {isSubscribed ? "Premium" : "Free"}
              </span>{" "}
              plan maybe not support {fileType} files.
            </p>
            <Link
              href="/files"
              className={buttonVariants({
                variant: "secondary",
                className: "mt-4",
              })}
            >
              <LuChevronLeft className="mr-1.5 h-3 w-3" />
              Back
            </Link>
          </div>
        </div>

        <ChatInputComponent isDisabled />
      </div>
    );

  return (
    <ChatContextProvider fileId={fileId} fileType={fileType}>
      <div className="relative flex min-h-full flex-col justify-between gap-2 bg-zinc-50">
        <div className="mb-28 flex flex-1 flex-col justify-between">
          <MessagesWrapper fileId={fileId} />
        </div>

        <ChatInputComponent />
      </div>
    </ChatContextProvider>
  );
};

export default MainChatWrapper;
