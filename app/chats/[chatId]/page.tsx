import ChatWrapper from "@/components/Chats/ChatWrapper";
import { db } from "@/db";
import { files } from "@/db/schema";
import { getServerAuthSession } from "@/lib/authOptions";
import { notFound } from "next/navigation";

const ChatPage = async ({
  params: { chatId },
}: {
  params: { chatId: string };
}) => {
  const session = await getServerAuthSession();

  if (!session || !chatId) return notFound();

  const file = await db.query.files.findFirst({
    where: (files, { and, eq }) =>
      and(eq(files.id, chatId), eq(files.userId, session?.user.id)),
  });

  if (!file) return notFound();

  return (
    <div className="container min-h-[calc(100vh-56px)] w-full max-w-screen-md bg-slate-100 p-0">
      <ChatWrapper fileId={chatId} fileType={file.type} />
    </div>
  );
};

export default ChatPage;
