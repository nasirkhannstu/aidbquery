import { forwardRef } from "react";
import ReactMarkdown from "react-markdown";
import moment from "moment";
import { FiUser } from "react-icons/fi";
import { SiOpenai } from "react-icons/si";

import { cn } from "@/lib/utils";

interface NoMessage {
  createdAt: Date;
  id: string;
  sender: string;
  text: JSX.Element;
}
interface Message {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  text: string | null;
  sender: "BOT" | "USER" | null;
  fileId: string;
}

interface MessageProps {
  message: NoMessage | Message;
  isSamePerson: boolean;
}

const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ isSamePerson, message }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-end", {
          "justify-end": message.sender === "USER",
        })}
      >
        <div
          className={cn(
            "relative flex aspect-square h-6 w-6 items-center justify-center",
            {
              "order-2 rounded-sm bg-zinc-800": message.sender === "USER",
              "order-1 rounded-sm bg-zinc-800": message.sender === "BOT",
              invisible: isSamePerson,
            },
          )}
        >
          {message.sender === "BOT" ? (
            <SiOpenai className="h-3/4 w-3/4 text-white" />
          ) : (
            <FiUser className="h-3/4 w-3/4 text-white" />
          )}
        </div>

        <div
          className={cn("mx-2 flex max-w-md flex-col space-y-2 text-base", {
            "order-1 items-end": message.sender === "USER",
            "order-2 items-start": message.sender === "BOT",
          })}
        >
          <div
            className={cn("inline-block rounded-lg px-4 py-2", {
              "bg-white text-slate-800": message.sender === "USER",
              "bg-slate-300 text-gray-900": message.sender === "BOT",
              "rounded-br-none": !isSamePerson && message.sender === "USER",
              "rounded-bl-none": !isSamePerson && message.sender === "BOT",
            })}
          >
            {typeof message.text === "string" ? (
              <ReactMarkdown
                className={cn("prose", {
                  "text-slate-900": message.sender === "USER",
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
                  "text-zinc-800": message.sender === "BOT",
                  "text-slate-700": message.sender === "USER",
                })}
              >
                {moment(message.createdAt).calendar()}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  },
);

Message.displayName = "Message";

export default Message;
