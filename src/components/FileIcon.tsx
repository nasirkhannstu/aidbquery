import React from "react";
import { FaFileCsv } from "react-icons/fa6";
import { LuFileJson } from "react-icons/lu";
import { FileType } from "@prisma/client";

import { cn } from "@/lib/utils";

const FileIcon = ({ type, size = 7 }: { type: FileType; size?: number }) => {
  const iconSize = `h-${size} w-${size}`;

  return type === "CSV" ? (
    <FaFileCsv className={cn("text-green-500", iconSize)} />
  ) : type === "JSON" ? (
    <LuFileJson className={cn("text-slate-500", iconSize)} />
  ) : null;
};

export default FileIcon;
