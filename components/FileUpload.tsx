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

const { Dragger } = Upload;

const FileUpload: React.FC = () => {
  const { isOpenUploadModal, setCloseUploadModal } = useUtils();

  const props: UploadProps = {
    name: "file",
    multiple: false,
    accept: ".csv,.json",
    style: {
      marginTop: 10,
      marginBottom: 10,
    },
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    async onChange(info) {
      console.log("info: >> ", info);

      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        await message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        await message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files: >> ", e.dataTransfer.files);
    },
  };

  return (
    <>
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
