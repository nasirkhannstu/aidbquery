import { LuMessageSquare } from "react-icons/lu";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { type Message as AIMessage } from "ai";

import Message from "./Message";

interface MessagesProps {
  messages: AIMessage[];
  isThinking: boolean;
}

const Messages = ({ messages, isThinking }: MessagesProps) => {
  return (
    <div className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch max-h-[calc(100vh-56px-75px)] flex-1 flex-col-reverse gap-4 overflow-y-auto border-zinc-200 p-3 ">
      {messages && messages.length > 0 ? (
        messages.map((message, index) => {
          const samePersonAsPrevious =
            messages[index - 1]?.sender === messages[index]?.sender;

          if (index === messages.length - 1)
            return (
              <Message
                key={message.id}
                message={message}
                isSamePerson={samePersonAsPrevious}
              />
            );
          else {
            return (
              <Message
                key={message.id}
                message={message}
                isSamePerson={samePersonAsPrevious}
              />
            );
          }
        })
      ) : isThinking ? (
        <Spin indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />} />
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <LuMessageSquare className="h-8 w-8 text-primary/60" />
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
