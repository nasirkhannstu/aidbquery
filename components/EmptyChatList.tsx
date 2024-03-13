"use client";
import { Button, Empty } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { useUtils } from "@/hooks/useUtils";

const EmptyChatList = () => {
  const { setOpenUploadModal } = useUtils();

  return (
    <div className="flex flex-1 justify-center">
      <Empty description="You don’t have any chats yet." className="mt-28">
        <Button
          type="primary"
          size="large"
          onClick={setOpenUploadModal}
          icon={<PlusOutlined />}
        >
          Upload Now
        </Button>
      </Empty>
    </div>
  );
};

export default EmptyChatList;
