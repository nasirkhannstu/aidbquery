"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Empty } from "antd";

import ChatWrapper from "@/components/Chats/ChatWrapper";
import FileListMenu from "@/components/FilesListMenu";
import { api } from "@/trpc/provider";

const ChatsPage = () => {
  const searchParams = useSearchParams();
  const _id = searchParams.get("_id");

  const { data } = api.files.filesList.useInfiniteQuery({ limit: 10 });
  const filesList = data?.pages.flatMap((page) => page.files);

  return (
    <div className="flex max-h-[calc(100vh-56px)] min-h-full w-full">
      <FileListMenu files={filesList} />

      {!filesList?.length ? (
        <div className="container min-h-[calc(100vh-56px)] w-full max-w-screen-md">
          <Empty
            className="my-24"
            description={
              <span>
                You don&apos;t have any files yet, upload a file to start chat.
              </span>
            }
          >
            <Button size="large">Upload Now</Button>
          </Empty>
        </div>
      ) : _id ? (
        <div className="container min-h-full w-full max-w-screen-md bg-slate-200 p-0">
          <ChatWrapper fileId={_id} />
        </div>
      ) : (
        <div className="container min-h-[calc(100vh-56px)] w-full max-w-screen-md p-0">
          <Empty
            className="my-24 rounded bg-white px-10 py-12"
            description={
              <span>Select a file to start chat with your files.</span>
            }
          />
        </div>
      )}
    </div>
  );
};

const ChatsPageWrapper = () => {
  return (
    <Suspense fallback="Loading...">
      <ChatsPage />
    </Suspense>
  );
};

export default ChatsPageWrapper;
