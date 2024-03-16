export type FileTypes = "JSON" | "CSV";
export type MimeTypes = "text/csv" | "application/json";
export type FileStatus = "PENDING" | "PROCESSING" | "FAILED" | "SUCCESS";

export type File = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  status: FileStatus;
  path: string;
  type: FileTypes;
  userId: string;
};

export interface Message {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  text: string | null;
  sender: "BOT" | "USER" | null;
  fileId: string;
}
