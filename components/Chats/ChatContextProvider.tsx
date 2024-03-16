import { type ReactNode, createContext, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { v4 } from "uuid";

import { api } from "@/trpc/provider";
import { INFINITY_QUERY } from "@/lib/utils";

type StreamResponse = {
  addMessage: () => void;
  message: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
};

export const ChatContext = createContext<StreamResponse>({
  addMessage: () => {
    //
  },
  message: "",
  handleInputChange: () => {
    //
  },
  isLoading: false,
});

interface ChatContextProps {
  fileId: string;
  children: ReactNode;
}

const ChatContextProvider = ({ fileId, children }: ChatContextProps) => {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const utils = api.useUtils();
  const backupMessage = useRef("");

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      // NOTE: invalidate the messages query according to the file type
      const response = await fetch("/api/chats", {
        method: "POST",
        body: JSON.stringify({
          fileId,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      return response.body;
    },
    onMutate: async ({ message }) => {
      backupMessage.current = message;
      setMessage("");

      await utils.messages.fileMessages.cancel();

      const previousMessages = utils.messages.fileMessages.getInfiniteData();

      utils.messages.fileMessages.setInfiniteData(
        { fileId, limit: INFINITY_QUERY },
        (old) => {
          if (!old) {
            return {
              pages: [],
              pageParams: [],
            };
          }

          const newPages = [...old.pages];

          const latestPage = newPages[0];

          latestPage.messages = [
            {
              createdAt: new Date(),
              id: v4(),
              text: message,
              sender: "USER",
              fileId: "",
              updatedAt: new Date(),
              userId: "",
            },
            ...latestPage.messages,
          ];

          newPages[0] = latestPage;

          return {
            ...old,
            pages: newPages,
          };
        },
      );

      setIsLoading(true);

      return {
        previousMessages:
          previousMessages?.pages.flatMap((page) => page.messages) ?? [],
      };
    },
    onSuccess: async (stream) => {
      setIsLoading(false);

      if (!stream) {
        return;
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;

      // accumulated response
      let accResponse = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);

        accResponse += chunkValue;

        // append chunk to the actual message
        utils.messages.fileMessages.setInfiniteData(
          { fileId, limit: INFINITY_QUERY },
          //@ts-expect-error @ts-ignore
          (old) => {
            if (!old) return { pages: [], pageParams: [] };

            const aiResponse = old.pages.some((page) =>
              page.messages.some((message) => message.id === "ai-response"),
            );

            const updatedPages = old.pages.map((page) => {
              if (page === old.pages[0]) {
                let updatedMessages;

                if (!aiResponse) {
                  updatedMessages = [
                    {
                      createdAt: new Date().toISOString(),
                      id: "ai-response",
                      text: accResponse,
                      sender: "BOT",
                    },
                    ...page.messages,
                  ];
                } else {
                  updatedMessages = page.messages.map((message) => {
                    if (message.id === "ai-response") {
                      return {
                        ...message,
                        text: accResponse,
                      };
                    }
                    return message;
                  });
                }

                return {
                  ...page,
                  messages: updatedMessages,
                  nextCursor: "",
                };
              }

              return page;
            });

            return { ...old, pages: updatedPages };
          },
        );
      }
    },

    onError: (_, __, context) => {
      setMessage(backupMessage.current);
      utils.messages.fileMessages.setData(
        { fileId },
        { messages: context?.previousMessages ?? [], nextCursor: null },
      );
    },
    onSettled: async () => {
      setIsLoading(false);

      await utils.messages.fileMessages.invalidate({ fileId });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const addMessage = () => sendMessage({ message });

  return (
    <ChatContext.Provider
      value={{
        addMessage,
        message,
        handleInputChange,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;
