import moment from "moment";
import { MdDriveFileRenameOutline, MdOutlineChat } from "react-icons/md";
import { BsFiletypeCsv } from "react-icons/bs";
import { CiTimer } from "react-icons/ci";
import { FileType } from "@prisma/client";
import { LuFileType } from "react-icons/lu";

import { convertMBtoKB } from "@/lib/utils";

interface CSVRenderProps {
  name: string;
  size: number;
  messages: number;
  fileType: FileType;
  createdAt: Date;
}

const JSONRender = ({
  createdAt,
  name,
  size,
  messages,
  fileType,
}: CSVRenderProps) => {
  return (
    <div className="px-8 py-12">
      <h2 className="my-3 text-xl font-semibold">File Information</h2>
      <ul className="grid gap-y-2">
        <li className="flex items-center gap-x-3">
          <MdDriveFileRenameOutline className="h-5 w-5 text-slate-600" />
          <div className="flex gap-x-1.5">
            <span className="font-bold">Name:</span>
            <span className="text-slate-600">{name}</span>
          </div>
        </li>
        <li className="flex items-center gap-x-3">
          <LuFileType className="h-5 w-5 text-slate-600" />
          <div className="flex gap-x-1.5">
            <span className="font-bold">File type:</span>
            <span className="text-slate-600">{fileType}</span>
          </div>
        </li>
        <li className="flex items-center gap-x-3">
          <BsFiletypeCsv className="h-5 w-5 text-slate-600" />
          <div className="flex gap-x-1.5">
            <span className="font-bold">File size:</span>
            <span className="text-slate-600">{convertMBtoKB(size)}</span>
          </div>
        </li>
        <li className="flex items-center gap-x-3">
          <MdOutlineChat className="h-5 w-5 text-slate-600" />
          <div className="flex gap-x-1.5">
            <span className="font-bold">Chats:</span>
            <span className="text-slate-600">{messages}</span>
          </div>
        </li>
        <li className="flex items-center gap-x-3">
          <CiTimer className="h-5 w-5 text-slate-600" />
          <div className="flex gap-x-1.5">
            <span className="font-bold">Upload date:</span>
            <span className="text-slate-600">
              {moment(createdAt).startOf("minute").fromNow()}
            </span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default JSONRender;
