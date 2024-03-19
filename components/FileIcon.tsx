import { TiAttachmentOutline } from "react-icons/ti";
import { LuFileJson2 } from "react-icons/lu";
import { BsFiletypeCsv } from "react-icons/bs";

import { cn } from "@/lib/utils";
import { type FileType } from "@/db/schema";

export const FileIcon = ({
  type,
  size = 7,
}: {
  type: FileType;
  size?: number;
}) => {
  const iconSize = `h-${size} w-${size}`;

  return type === "CSV" ? (
    <BsFiletypeCsv className={cn("text-zinc-500", iconSize)} />
  ) : type === "JSON" ? (
    <LuFileJson2 className={cn("text-zinc-500", iconSize)} />
  ) : (
    <TiAttachmentOutline className={cn("text-zinc-500", iconSize)} />
  );
};
