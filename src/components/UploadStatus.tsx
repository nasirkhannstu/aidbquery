import { UploadStatus } from "@prisma/client";

const FileUploadStatus = (status: UploadStatus, value: string) => {
  return status === "SUCCESS" ? (
    <span className="bg-green-200 px-2 py-1 text-green-600">{value}</span>
  ) : null;
};

export default FileUploadStatus;
