"use client";
import { GrAttachment } from "react-icons/gr";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

interface FileListCardProps {
  id: string;
  fileName: string;
}

export const FileListCard = ({ fileName, id }: FileListCardProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = pathname === `/chats/${id}`;

  return (
    <li
      className={cn(
        "flex cursor-pointer items-center gap-x-3 truncate rounded-md border  px-4 py-3",
        isActive ? "bg-primary/10 border-primary" : "border-slate-300",
      )}
      onClick={() => router.push(`/chats/${id}`)}
    >
      <div>
        <GrAttachment
          className={cn(
            "h-4 w-4",
            isActive ? "text-primary" : "text-slate-700",
          )}
        />
      </div>
      <p
        className={cn(
          "text-light font-base truncate",
          isActive ? "text-primary" : "",
        )}
      >
        {fileName}
      </p>
    </li>
  );
};
