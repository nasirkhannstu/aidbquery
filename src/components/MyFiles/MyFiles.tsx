"use client";
import { useEffect, useRef, useState } from "react";
import { useIntersection } from "@mantine/hooks";
import { motion } from "framer-motion";
import Link from "next/link";
import moment from "moment";
import { VscEmptyWindow } from "react-icons/vsc";
import { LuLoader2, LuMessageSquare, LuTrash } from "react-icons/lu";
import { CiCalendarDate } from "react-icons/ci";

import { trpc } from "@/app/_trpc/client";
import { getUserSubscriptionPlan } from "@/config/using_mode";
import { INFINITE_QUERY_LIMIT_FILES } from "@/config/infinite-query";
import LoadMore from "@/components/LoadMore";
import FileIcon from "@/components/FileIcon";
import { Button } from "@/components/ui/button";
import UploadDocumentButton from "@/components/upload/UploadDocumentButton";
import MyFilesSkeleton from "./MyFilesSkeleton";

export interface PageProps {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}

const MyFiles = () => {
  const lastFileRef = useRef<HTMLUListElement>(null);
  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<
    string | null
  >(null);
  const utils = trpc.useUtils();
  const { data, isLoading, fetchNextPage, isFetching } =
    trpc.getUserFilesWithPagination.useInfiniteQuery(
      {
        limit: INFINITE_QUERY_LIMIT_FILES,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        keepPreviousData: true,
      },
    );

  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    onSuccess: async () => {
      await utils.getUserFilesWithPagination.invalidate();
      await utils.getUserFilesDrawer.invalidate();
    },
    onMutate({ id }) {
      setCurrentlyDeletingFile(id);
    },
    onSettled() {
      setCurrentlyDeletingFile(null);
    },
  });

  const { ref, entry } = useIntersection({
    root: lastFileRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const files = data?.pages.flatMap((page) => page.files);

  return (
    <main className="mx-auto min-h-screen max-w-7xl md:p-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 text-5xl font-bold text-gray-900">My Files</h1>

        <div className="flex items-center gap-2">
          <UploadDocumentButton />
        </div>
      </div>

      {/* display all user files */}
      {files && files?.length !== 0 ? (
        <>
          <ul
            className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3"
            ref={ref}
          >
            {files.map((file, index) => {
              let animationDelay = (index + 1) * 0.25;
              if (index >= INFINITE_QUERY_LIMIT_FILES) {
                animationDelay = 1;
              }
              return (
                <motion.li
                  key={file.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: animationDelay,
                    ease: "easeInOut",
                    duration: 0.5,
                  }}
                  className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
                >
                  <Link
                    href={`/files/${file.id}`}
                    className="flex flex-col gap-2"
                  >
                    <div className="flex w-full items-center justify-between space-x-6 px-6 pt-6">
                      <FileIcon type={file.fileType} size={10} />

                      <div className="flex-1 truncate">
                        <div className="flex items-center space-x-3">
                          <h3 className="truncate text-lg font-medium text-zinc-900">
                            {file.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="mt-4 grid grid-cols-3 place-items-center gap-6 px-3 py-2 text-xs text-zinc-500">
                    <div className="flex items-center gap-2">
                      <CiCalendarDate className="h-4 w-4" />
                      {moment(file.createdAt).format("ll")}
                    </div>

                    <div className="flex items-center gap-2">
                      <LuMessageSquare className="h-4 w-4" />
                      <p>
                        {file._count.messages}{" "}
                        {file._count.messages > 1 ? "messages" : "message"}
                      </p>
                    </div>
                    <Button
                      onClick={() => deleteFile({ id: file.id })}
                      size="sm"
                      className="w-full"
                      variant="destructive"
                    >
                      {currentlyDeletingFile === file.id ? (
                        <LuLoader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <LuTrash className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </motion.li>
              );
            })}
          </ul>
          {isFetching ? <LoadMore /> : null}
        </>
      ) : isLoading ? (
        <MyFilesSkeleton />
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <VscEmptyWindow className="h-8 w-8 text-zinc-800" />
          <h3 className="text-xl font-semibold">
            You don&apos;t have any uploaded files.
          </h3>
          <p>Let&apos;s upload your first file.</p>
          <div className="my-1.5 flex items-center gap-1.5">
            <UploadDocumentButton />
          </div>
        </div>
      )}
    </main>
  );
};

export default MyFiles;
