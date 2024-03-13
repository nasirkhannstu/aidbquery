"use client";
import { useParams, usePathname, useRouter } from "next/navigation";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, message } from "antd";

import { cn } from "@/lib/utils";
import { api } from "@/trpc/provider";

interface FileListCardProps {
  id: string;
  fileName: string;
}

export const FileListCard = ({ fileName, id }: FileListCardProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const utils = api.useUtils();
  const [messageAPI, messageHolder] = message.useMessage();
  const fileId = useParams().chatId;
  const { mutate: deleteFile, isLoading } = api.files.deleteFile.useMutation({
    onError(err) {
      console.log(err);
    },
    async onSuccess() {
      await utils.files.invalidate();

      await messageAPI.open({
        type: "success",
        content: "File deleted successfully!",
      });
    },
  });

  const isActive = pathname === `/chats/${id}`;

  console.log("isActive", isActive);

  return (
    <li
      className={cn(
        "flex cursor-pointer items-center justify-between gap-x-3 truncate rounded-md border  px-4 py-3",
        isActive ? "border-primary/50 bg-primary/10" : "border-slate-200",
      )}
      onClick={() => router.push(`/chats/${id}`)}
    >
      {messageHolder}
      <p
        className={cn(
          "text-light font-base truncate",
          isActive ? "text-primary" : "",
        )}
      >
        {fileName}
      </p>
      <Button
        type="text"
        icon={<DeleteOutlined />}
        size="small"
        loading={isLoading}
        disabled={fileId === id}
        onClick={(e) => {
          e.stopPropagation();
          const permit = confirm("Are you sure you want to delete this file?");
          if (permit) {
            deleteFile({ fileId: id });
          }
        }}
      />
    </li>
  );
};
