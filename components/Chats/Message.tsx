import ReactMarkdown from "react-markdown";
import moment from "moment";
import { FiUser } from "react-icons/fi";
import { SiOpenai } from "react-icons/si";

import { cn } from "@/lib/utils";
import { type Message as AIMessage } from "ai";

interface MessageProps {
  message: AIMessage;
  isSamePerson: boolean;
}

const Message = ({ isSamePerson, message }: MessageProps) => {
  return (
    <div
      className={cn("flex items-end", {
        "justify-end": message.role === "user",
      })}
    >
      <div
        className={cn(
          "relative flex aspect-square h-6 w-6 items-center justify-center",
          {
            "order-2 rounded-sm bg-zinc-800": message.role === "user",
            "order-1 rounded-sm bg-zinc-800": message.role === "assistant",
            invisible: isSamePerson,
          },
        )}
      >
        {message.role === "assistant" ? (
          <SiOpenai className="h-3/4 w-3/4 text-white" />
        ) : (
          <FiUser className="h-3/4 w-3/4 text-white" />
        )}
      </div>

      <div
        className={cn("mx-2 flex max-w-md flex-col space-y-2 text-base", {
          "order-1 items-end": message.role === "user",
          "order-2 items-start": message.role === "assistant",
        })}
      >
        <div
          className={cn("inline-block rounded-lg px-4 py-2", {
            "bg-white text-slate-800": message.role === "user",
            "bg-slate-300 text-gray-900": message.role === "assistant",
            "rounded-br-none": !isSamePerson && message.role === "user",
            "rounded-bl-none": !isSamePerson && message.role === "assistant",
          })}
        >
          {typeof message.content === "string" ? (
            <ReactMarkdown
              className={cn("prose", {
                "text-slate-900": message.role === "user",
              })}
            >
              {message.content}
            </ReactMarkdown>
          ) : (
            message.content
          )}
          {String(message.id) !== "loading-message" ? (
            <div
              className={cn("mt-2 w-full select-none text-right text-xs", {
                "text-zinc-800": message.role === "assistant",
                "text-slate-700": message.role === "user",
              })}
            >
              {moment(message.createdAt).calendar()}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Message;
