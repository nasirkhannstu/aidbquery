import React, { useContext, useRef } from "react";
import { Input } from "antd";
import { BsFillSendFill } from "react-icons/bs";
import { ChatContext } from "./ChatContextProvider";

const { TextArea } = Input;

interface ChatInputProps {
  isDisabled?: boolean;
}

const ChatInput = ({ isDisabled }: ChatInputProps) => {
  const { addMessage, handleInputChange, isLoading, message } =
    useContext(ChatContext);

  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="bg-slate-50 px-5 py-3">
      <div className="flex items-center gap-x-3">
        <TextArea
          onChange={handleInputChange}
          value={message}
          onKeyDown={(event) => {
            const trim = message.replace(/^\s+|\s+$/g, "");
            if (trim.length >= 0) {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                addMessage();
                messageInputRef.current?.focus();
              }
            }
          }}
          disabled={isDisabled}
          placeholder="Ask your question..."
          autoSize={{ maxRows: 4 }}
          size="large"
          styles={{
            textarea: {
              borderRadius: "10px",
              paddingTop: "10px",
              paddingBottom: "10px",
              borderWidth: "2px",
            },
          }}
        />
        <button
          aria-label="Message send"
          disabled={isDisabled ?? isLoading}
          onClick={() => {
            const trimStr = message.replace(/^\s+|\s+$/g, "");
            if (trimStr.length >= 2) {
              addMessage();
              messageInputRef.current?.focus();
            }
          }}
        >
          <BsFillSendFill className="h-6 w-6 text-primary" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
