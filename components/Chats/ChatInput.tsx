import React from "react";
import { Button, Input } from "antd";
import { BsFillSendFill } from "react-icons/bs";

const { TextArea } = Input;

const ChatInput = () => {
  return (
    <div className="bg-slate-50 p-3">
      <div className="flex items-center gap-x-2">
        <TextArea
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
        <Button
          type="link"
          icon={<BsFillSendFill className="h-7 w-7" />}
          size="large"
          aria-label="Message send"
        />
      </div>
    </div>
  );
};

export default ChatInput;
