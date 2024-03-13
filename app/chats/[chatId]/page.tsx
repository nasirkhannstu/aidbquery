import { redirect } from "next/navigation";

import ChatWrapper from "@/components/Chats/ChatWrapper";
import { db } from "@/db";

const ChatPage = async ({
  params: { chatId },
}: {
  params: { chatId: string };
}) => {
  const file = await db.query.files.findFirst({
    where: (files, { eq }) => eq(files.id, chatId),
  });

  if (!file) return redirect("/chats");

  return (
    <div className="container min-h-[calc(100vh-56px)] w-full max-w-screen-md bg-slate-200 p-0">
      <ChatWrapper fileId={chatId} />
    </div>
  );
};

export default ChatPage;
