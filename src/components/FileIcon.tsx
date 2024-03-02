import React from "react";
import { FaLink, FaRegFileImage, FaRegFilePdf } from "react-icons/fa";
import { PiMicrosoftWordLogoFill } from "react-icons/pi";
import { TbFileTypeTxt } from "react-icons/tb";
import { TiAttachmentOutline } from "react-icons/ti";
import { FileType } from "@prisma/client";
import { cn } from "@/lib/utils";

const FileIcon = ({ type, size = 7 }: { type: FileType; size?: number }) => {
  const iconSize = `h-${size} w-${size}`;

  return type === "PDF" ? (
    <FaRegFilePdf className={cn("text-red-600", iconSize)} />
  ) : type === "IMAGE" ? (
    <FaRegFileImage className={cn("text-sky-600", iconSize)} />
  ) : type === "DOC" ? (
    <PiMicrosoftWordLogoFill className={cn("text-blue-600", iconSize)} />
  ) : type === "TEXT" ? (
    <TbFileTypeTxt className={cn("text-zinc-700", iconSize)} />
  ) : type === "URL" ? (
    <FaLink className={cn("text-green-600", iconSize)} />
  ) : (
    <TiAttachmentOutline className={cn("text-zinc-500", iconSize)} />
  );
};

export default FileIcon;
