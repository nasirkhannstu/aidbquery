import React from "react";
import { Input } from "antd";
import { BsFillSendFill } from "react-icons/bs";

const { TextArea } = Input;

interface ChatInputProps {
  isDisabled?: boolean;
}

const ChatInput = ({ isDisabled }: ChatInputProps) => {
  return (
    <div className="bg-slate-50 px-5 py-3">
      <div className="flex items-center gap-x-3">
        <TextArea
          disabled={isDisabled}
          placeholder="Type a message"
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
        <button aria-label="Message send" disabled={isDisabled}>
          <BsFillSendFill className="h-6 w-6 text-primary" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
