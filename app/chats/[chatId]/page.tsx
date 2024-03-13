"use client";
import { useRouter } from "next/navigation";

import ChatWrapper from "@/components/Chats/ChatWrapper";
import { api } from "@/trpc/provider";

const ChatPage = ({ params: { chatId } }: { params: { chatId: string } }) => {
  const router = useRouter();
  const { data: file } = api.files.userFileById.useQuery({ fileId: chatId });

  if (!file) {
    return router.push("/chats");
  }

  return (
    <div className="container min-h-[calc(100vh-56px)] w-full max-w-screen-md bg-slate-200 p-0">
      <ChatWrapper fileId={file.id} />
    </div>
  );
};

export default ChatPage;
