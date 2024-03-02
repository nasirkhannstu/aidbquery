"use client";
import { useEffect } from "react";
import { LuX } from "react-icons/lu";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

import { trpc } from "@/app/_trpc/client";
import { useDrawerHandle } from "@/hooks/useDrawerHandler";
import { Button } from "./ui/button";
import FileIcon from "./FileIcon";
import { INFINITE_QUERY_LIMIT_FILES_DRAWER } from "@/config/infinite-query";
import LoadMore from "./LoadMore";
import { cn } from "@/lib/utils";

function NavigationDrawer() {
  const {
    data: files,
    isLoading,
    isFetching,
  } = trpc.getUserFilesDrawer.useQuery();
  const fileId = useParams<{ fileid: string }>().fileid;
  const { isOpen, setIsOpen } = useDrawerHandle();

  useEffect(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  if (isOpen) {
    return (
      <div className="hidden max-h-full min-h-full max-w-xs flex-col bg-white shadow xl:flex">
        {/* Main area */}
        <div className="flex justify-between p-2">
          <div className="flex flex-col space-y-2 text-center sm:text-left">
            <h2 className="text-lg font-semibold text-foreground">
              Your documents
            </h2>
            <p className="text-sm text-muted-foreground">
              Make navigate to your document.
            </p>
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <LuX />
          </Button>
        </div>

        {files && files.length !== 0 ? (
          <div className="my-2 flex h-auto w-full flex-col gap-y-2 overflow-y-auto p-2">
            {files.map((file, index) => {
              let animationDelay = (index + 1) * 0.1;
              if (index >= INFINITE_QUERY_LIMIT_FILES_DRAWER) {
                animationDelay = 1;
              }

              return (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: animationDelay,
                    ease: "easeInOut",
                  }}
                  key={file.id}
                  className={cn(
                    "w-full rounded-md border p-2 shadow-sm hover:bg-gray-100",
                    fileId === file.id ? "bg-primary/20" : "",
                  )}
                >
                  <Link
                    href={`/files/${file.id}`}
                    className="flex items-center gap-1.5"
                  >
                    <FileIcon type={file.fileType} />
                    <span className="truncate font-mono text-sm">
                      {file.name}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          "No recent documents."
        )}
        {isLoading || isFetching ? <LoadMore /> : null}
      </div>
    );
  } else {
    return null;
  }
}

export default NavigationDrawer;
