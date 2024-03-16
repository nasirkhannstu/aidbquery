"use client";
import { useRouter } from "next/navigation";

import EmptyChatList from "@/components/EmptyChatList";
import { api } from "@/trpc/provider";
import FilesListMenu from "@/components/FilesListMenu";

const ChatsPage = () => {
  const router = useRouter();
  const { data: file } = api.files.userFirstFile.useQuery();

  if (file) {
    return router.push(`/chats/${file.id}`);
  }

  return (
    <div className="flex h-full min-h-[calc(100vh-56px)] w-full flex-1 gap-x-3">
      <>
        <FilesListMenu />
      </>
      <EmptyChatList />
    </div>
  );
};

export default ChatsPage;
