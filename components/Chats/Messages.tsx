import { useContext, useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { LuMessageSquare } from "react-icons/lu";
import { RxReload } from "react-icons/rx";

import { api } from "@/trpc/provider";
import { INFINITY_QUERY } from "@/lib/utils";
import Message from "./Message";
import { ChatContext } from "./ChatContextProvider";

const Messages = ({ fileId }: { fileId: string }) => {
  const { isLoading: isThinking } = useContext(ChatContext);
  const { data, isLoading, fetchNextPage } =
    api.messages.messagesOfFile.useInfiniteQuery(
      {
        fileId,
        limit: INFINITY_QUERY,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        keepPreviousData: true,
      },
    );

  const messages = data?.pages.flatMap((page) => page.messages);

  const messageLoading = {
    createdAt: new Date(),
    id: "loading-message",
    sender: "BOT",
    text: (
      <span className="flex h-full items-center justify-center">
        <RxReload className="h-4 w-4 animate-spin" />
      </span>
    ),
  };

  const allMessages = [
    ...(isThinking ? [messageLoading] : []),
    ...(messages ?? []),
  ];

  const endMessageRef = useRef<HTMLDivElement>(null);

  const { ref, entry } = useIntersection({
    root: endMessageRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      void fetchNextPage();
    }
  }, [entry?.isIntersecting, fetchNextPage]);

  return (
    <div className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch max-h-[calc(100vh-56px-75px)] flex-1 flex-col-reverse gap-4 overflow-y-auto border-zinc-200 p-3 ">
      {allMessages && allMessages.length > 0 ? (
        allMessages.map((message, index) => {
          const samePersonAsPrevious =
            allMessages[index - 1]?.sender === allMessages[index]?.sender;

          if (index === allMessages.length - 1)
            return (
              <Message
                key={message.id}
                ref={ref}
                message={message}
                isSamePerson={samePersonAsPrevious}
              />
            );
          else {
            return (
              <Message
                key={message.id}
                ref={ref}
                message={message}
                isSamePerson={samePersonAsPrevious}
              />
            );
          }
        })
      ) : isLoading ? (
        <div className="flex w-full flex-col gap-2">
          <div className="h-16" />
          <div className="h-16" />
          <div className="h-16" />
          <div className="h-16" />
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <LuMessageSquare className="text-primary/60 h-8 w-8" />
          <h3 className="text-xl font-semibold">You&apos;re all set!</h3>
          <p className="text-sm text-zinc-500">
            Ask your first question to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default Messages;
