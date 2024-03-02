"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useIntersection } from "@mantine/hooks";
import { motion } from "framer-motion";

import { trpc } from "@/app/_trpc/client";
import FileIcon from "./FileIcon";
import { INFINITE_QUERY_LIMIT_FILES_DRAWER } from "@/config/infinite-query";
import LoadMore from "./LoadMore";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";

function NavigationDrawerSM() {
  const lastFileRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, fetchNextPage, isFetching } =
    trpc.getUserFilesWithPagination.useInfiniteQuery(
      {
        limit: INFINITE_QUERY_LIMIT_FILES_DRAWER,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
      },
    );
  const fileId = useParams().fileid;
  const { ref, entry } = useIntersection({
    root: lastFileRef.current,
    threshold: 1,
  });

  const files = data?.pages.flatMap((page) => page.files);

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  return (
    <SheetContent side="left" className="sm:max-w-sm">
      <SheetHeader>
        <SheetTitle>Your Documents</SheetTitle>
        <SheetDescription>Make navigate to your Documents.</SheetDescription>
      </SheetHeader>

      {files && files.length !== 0 ? (
        <div
          ref={ref}
          className="my-2 grid max-h-[calc(100vh-3.5rem-7rem)] min-w-full gap-y-2 overflow-y-auto p-2"
        >
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
                className={`truncate rounded-md border px-4 py-2 shadow-sm hover:bg-gray-100 ${
                  fileId === file.id ? "bg-indigo-50" : ""
                }`}
              >
                <Link
                  href={`/files/${file.id}`}
                  className="flex w-full items-center gap-1.5 truncate"
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
      ) : null}
      {isLoading || isFetching ? <LoadMore /> : null}
    </SheetContent>
  );
}

export default NavigationDrawerSM;
