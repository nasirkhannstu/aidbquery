import { forwardRef } from "react";
import ReactMarkdown from "react-markdown";
import moment from "moment";

import { cn } from "@/lib/utils";
import { ExtendedMessage } from "@/types/message";
import { Icons } from "@/components/Icons";

interface MessageProps {
  message: ExtendedMessage;
  isNextMessageSamePerson: boolean;
}

const MainMessage = forwardRef<HTMLDivElement, MessageProps>(
  ({ message, isNextMessageSamePerson }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-end", {
          "justify-end": message.isUserMessage,
        })}
      >
        <div
          className={cn(
            "relative flex aspect-square h-6 w-6 items-center justify-center",
            {
              "order-2 rounded-sm bg-primary/70": message.isUserMessage,
              "order-1 rounded-sm bg-zinc-800": !message.isUserMessage,
              invisible: isNextMessageSamePerson,
            },
          )}
        >
          {message.isUserMessage ? (
            <Icons.user className="h-3/4 w-3/4 text-white" />
          ) : (
            <Icons.logo className="h-3/4 w-3/4 text-white" />
          )}
        </div>

        <div
          className={cn("mx-2 flex max-w-md flex-col space-y-2 text-base", {
            "order-1 items-end": message.isUserMessage,
            "order-2 items-start": !message.isUserMessage,
          })}
        >
          <div
            className={cn("inline-block rounded-lg px-4 py-2", {
              "bg-primary/90 text-white": message.isUserMessage,
              "bg-gray-200 text-gray-900": !message.isUserMessage,
              "rounded-br-none":
                !isNextMessageSamePerson && message.isUserMessage,
              "rounded-bl-none":
                !isNextMessageSamePerson && !message.isUserMessage,
            })}
          >
            {typeof message.text === "string" ? (
              <ReactMarkdown
                className={cn("prose", {
                  "text-zinc-50": message.isUserMessage,
                })}
              >
                {message.text}
              </ReactMarkdown>
            ) : (
              message.text
            )}
            {String(message.id) !== "loading-message" ? (
              <div
                className={cn("mt-2 w-full select-none text-right text-xs", {
                  "text-zinc-500": !message.isUserMessage,
                  "text-white": message.isUserMessage,
                })}
              >
                {moment(message.createdAt).format("LLLL")}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  },
);

MainMessage.displayName = "MainMessage";

export default MainMessage;
