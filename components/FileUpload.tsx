"use client";
import {
  Button,
  Modal,
  Upload,
  type UploadProps,
  message,
  Typography,
  Divider,
} from "antd";
import { CloseOutlined, CloudUploadOutlined } from "@ant-design/icons";

import { useUtils } from "@/hooks/useUtils";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/provider";

const { Dragger } = Upload;

const FileUpload: React.FC = () => {
  const { isOpenUploadModal, setCloseUploadModal } = useUtils();
  const [messageHandler, messageHolder] = message.useMessage();
  const router = useRouter();
  const utils = api.useUtils();

  const props: UploadProps = {
    name: "file",
    multiple: false,
    accept: ".csv,.json",
    style: {
      marginTop: 10,
      marginBottom: 10,
    },
    action: "/api/uploads",
    async onChange(info) {
      const { status } = info.file;

      if (status === "done") {
        await messageHandler.open({
          type: "success",
          content: info.file.response.msg,
        });
        await utils.files.invalidate();
        setCloseUploadModal();
        router.push(`/chats?_id=${info.file.response?.fileId}`);
      } else if (status === "error") {
        await messageHandler.open({
          type: "error",
          content: info.file.response.msg,
        });
      }
    },
  };

  return (
    <>
      {messageHolder}
      <Modal
        open={isOpenUploadModal}
        title={
          <Typography.Title
            level={4}
            className="my-3"
            style={{ fontWeight: "bold" }}
          >
            Upload File
          </Typography.Title>
        }
        onOk={setCloseUploadModal}
        onCancel={setCloseUploadModal}
        footer={[
          <Button
            key="submit"
            loading={false}
            onClick={setCloseUploadModal}
            danger
            ghost
            size="large"
            icon={<CloseOutlined />}
          >
            Cancel
          </Button>,
        ]}
        width={700}
      >
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <CloudUploadOutlined />
          </p>
          <Typography.Text className="ant-upload-text">
            To upload a file,{" "}
            <Typography.Text strong>Click here</Typography.Text> or{" "}
            <Typography.Text strong>drag</Typography.Text> it here.
          </Typography.Text>
          <Divider style={{ marginBlock: 8 }}>or</Divider>
          <Button type="default" size="middle">
            Browse files
          </Button>

          <Typography.Text
            type="secondary"
            style={{ marginTop: 5, display: "block" }}
          >
            Supports CSV up to 10MB and JSON up to 5MB.
          </Typography.Text>
        </Dragger>
      </Modal>
    </>
  );
};

export default FileUpload;
