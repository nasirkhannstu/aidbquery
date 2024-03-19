import { type FormEvent, type ChangeEvent } from "react";
import { Input } from "antd";
import { BsFillSendFill } from "react-icons/bs";
import { type ChatRequestOptions } from "ai";

const { TextArea } = Input;

interface ChatInputProps {
  isLoading?: boolean;
  input: string;
  handleSubmit: (
    event: FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions | undefined,
  ) => void;
  handleChange: (
    e: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>,
  ) => void;
}

const ChatInput = ({
  isLoading,
  handleSubmit,
  handleChange,
  input,
}: ChatInputProps) => {
  return (
    <div className="bg-slate-50 px-5 py-3">
      <div className="flex items-center gap-x-3">
        <form
          onSubmit={handleSubmit}
          className="flex w-full items-center gap-x-2"
        >
          <TextArea
            onChange={handleChange}
            value={input}
            disabled={isLoading}
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
          <button type="submit" aria-label="Message send" disabled={isLoading}>
            <BsFillSendFill className="h-6 w-6 text-primary" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
