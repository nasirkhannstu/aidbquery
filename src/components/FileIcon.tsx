import { FaFileCsv } from "react-icons/fa6";
import { LuFile, LuFileJson } from "react-icons/lu";
import { FileType } from "@prisma/client";

import { cn } from "@/lib/utils";

const FileIcon = ({ type, size = 7 }: { type: FileType; size?: number }) => {
  const iconSize = `h-${size} w-${size}`;

  return type === "CSV" ? (
    <FaFileCsv className={cn("text-green-700", iconSize)} />
  ) : type === "JSON" ? (
    <LuFileJson className={cn("text-yellow-700", iconSize)} />
  ) : (
    <LuFile className={cn("text-slate-500", iconSize)} />
  );
};

export default FileIcon;
