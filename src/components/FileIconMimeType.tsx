import { FaFileCsv } from "react-icons/fa6";
import { LuFile, LuFileJson } from "react-icons/lu";

import { cn } from "@/lib/utils";

export type MimeType = "text/csv" | "application/json";

interface FileIconProps {
  mimeType: MimeType;
  size?: number;
}

const FileIconMimeType = ({ mimeType, size = 4 }: FileIconProps) => {
  const iconSize = `h-${size} w-${size}`;

  return mimeType === "text/csv" ? (
    <FaFileCsv className={cn("text-green-700", iconSize)} />
  ) : mimeType === "application/json" ? (
    <LuFileJson className={cn("text-yellow-500", iconSize)} />
  ) : (
    <LuFile className={cn("text-slate-500", iconSize)} />
  );
};

export default FileIconMimeType;
