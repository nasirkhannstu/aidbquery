"use client";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";
import { IoIosArrowForward } from "react-icons/io";

import { useUtils } from "@/hooks/useUtils";
import FileUpload from "./FileUpload";
import { FileIcon } from "./FileIcon";
import { FileListCard } from "./FileListCard";
import { type File } from "@/db/schema";
import { cn } from "@/lib/utils";

interface FileListProps {
  files: File[] | undefined;
}

const FilesListMenu = ({ files }: FileListProps) => {
  const { setOpenUploadModal, isSidebarOpen, toggleSidebar } = useUtils();

  const csvFiles = files?.filter((file) => file.type === "CSV");
  const jsonFiles = files?.filter((file) => file.type === "JSON");

  return (
    <div
      className={cn(
        "fixed  top-[--navbar-h] z-50 flex h-full w-[350px] flex-col overflow-y-auto border-r bg-slate-50 px-7 py-2 shadow-lg transition delay-150 duration-300 ease-in-out lg:w-[400px]",
        isSidebarOpen ? "left-0" : "-left-full",
      )}
    >
      <div className="my-3 flex items-center justify-between">
        <div>
          <Typography.Title level={3} style={{ fontWeight: "bold" }}>
            Files
          </Typography.Title>
        </div>
        <div className="flex gap-x-1">
          <Button
            type="dashed"
            size="large"
            shape="default"
            icon={<PlusOutlined />}
            onClick={setOpenUploadModal}
            aria-label="Upload file"
            color="red"
          >
            Upload
          </Button>
          <FileUpload />
          <Button
            icon={<CloseOutlined />}
            size="large"
            onClick={toggleSidebar}
          />
        </div>
      </div>
      <div className="mt-2 max-h-full flex-1">
        <div className="flex max-h-full flex-1 flex-col gap-y-1.5">
          <div className="flex items-center gap-x-3 rounded py-1.5 transition hover:cursor-pointer hover:bg-slate-100">
            <FileIcon type="CSV" size={8} />
            <div className="flex flex-1 items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Csv Files</h3>
                <Typography.Text type="secondary">
                  {csvFiles?.length}{" "}
                  {csvFiles && csvFiles?.length > 1 ? "files" : "file"}{" "}
                  available
                </Typography.Text>
              </div>
              <IoIosArrowForward className="h-5 w-5 text-slate-600" />
            </div>
          </div>
          <div className="h-auto w-full flex-1">
            <ul className="ml-4 flex flex-col gap-y-2">
              {csvFiles?.map((file) => (
                <FileListCard key={file.id} fileName={file.name} id={file.id} />
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-x-3 rounded py-1.5 transition hover:cursor-pointer hover:bg-slate-100">
            <FileIcon type="JSON" size={8} />
            <div className="flex flex-1 items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Json Files</h3>
                <Typography.Text type="secondary">
                  {jsonFiles?.length}{" "}
                  {jsonFiles && jsonFiles?.length > 1 ? "files" : "file"}{" "}
                  available
                </Typography.Text>
              </div>
              <IoIosArrowForward className="h-5 w-5 text-slate-600" />
            </div>
          </div>
          <div className="h-auto w-full flex-1">
            <ul className="ml-4 flex flex-col gap-y-2">
              {jsonFiles?.map((file) => (
                <FileListCard key={file.id} fileName={file.name} id={file.id} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilesListMenu;
