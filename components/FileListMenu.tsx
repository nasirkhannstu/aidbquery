"use client";
import { PlusOutlined } from "@ant-design/icons";
import { FaFileCsv } from "react-icons/fa6";
import {
  Button,
  Menu,
  Typography,
  Tooltip,
  type MenuProps,
  type GetProp,
} from "antd";
import { BsFiletypeJson } from "react-icons/bs";

import { useUtils } from "@/hooks/useUtils";
import FileUpload from "./FileUpload";

type MenuItem = GetProp<MenuProps, "items">[number];

const FileListMenu: React.FC = () => {
  const { setOpenUploadModal } = useUtils();

  const items: MenuItem[] = [
    {
      label: (
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <Typography.Text strong style={{ fontSize: 20 }}>
              CSVs
            </Typography.Text>
            <Typography.Text type="secondary">
              20 files available
            </Typography.Text>
          </div>
        </div>
      ),
      key: "1",
      icon: <FaFileCsv style={{ color: "green", fontSize: 30 }} />,
      style: {
        height: "auto",
        marginBottom: 5,
        paddingTop: 7,
        paddingBottom: 7,
      },
    },
    {
      label: (
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <Typography.Text strong style={{ fontSize: 20 }}>
              JSONs
            </Typography.Text>
            <Typography.Text type="secondary">
              32 files available
            </Typography.Text>
          </div>
        </div>
      ),
      key: "2",
      icon: <BsFiletypeJson style={{ color: "rosybrown", fontSize: 30 }} />,
      style: {
        height: "auto",
        marginBottom: 5,
        paddingTop: 7,
        paddingBottom: 7,
      },
    },
  ];

  return (
    <div className="flex max-w-sm flex-col bg-slate-200 px-5 py-2">
      <div className="my-3 flex items-center justify-between">
        <div>
          <Typography.Title level={3} style={{ fontWeight: "bold" }}>
            Files
          </Typography.Title>
        </div>
        <div>
          <Tooltip title="Upload new file">
            <Button
              type="primary"
              size="large"
              shape="circle"
              icon={<PlusOutlined />}
              onClick={setOpenUploadModal}
              aria-label="Upload file"
            />
          </Tooltip>
          <FileUpload />
        </div>
      </div>
      <Menu
        style={{ width: 350, backgroundColor: "transparent" }}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        items={items}
      />
    </div>
  );
};

export default FileListMenu;
