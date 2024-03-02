"use client";
import React from "react";
import SimpleBar from "simplebar-react";
import {
  LuChevronDown,
  LuChevronUp,
  LuLoader2,
  LuRotateCw,
} from "react-icons/lu";

import { FileType } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { trpc } from "@/app/_trpc/client";

interface PropTypes {
  path: string;
  type: FileType;
}

const TextRender = ({ path, type }: PropTypes) => {
  const {
    data: URLData,
    isLoading: URLIsLoading,
    isFetching: URLIsFetching,
  } = trpc.getUrlData.useQuery(
    { path },
    {
      enabled: type === "URL",
      retry: true,
      retryDelay: 500,
    },
  );
  const {
    data: textData,
    isLoading: textIsLoading,
    isFetched: textIsFetching,
  } = trpc.textOfTEXTS.useQuery(
    { path },
    {
      enabled: type === "TEXT",
      retry: true,
      retryDelay: 500,
    },
  );

  if ((URLIsLoading && URLIsFetching) || (textIsLoading && textIsFetching))
    return (
      <div className="flex justify-center">
        <LuLoader2 className="my-24 h-10 w-10 animate-spin text-primary" />
      </div>
    );

  return (
    <>
      <div className="flex w-full flex-col items-center rounded-md bg-white shadow">
        <div className="flex h-14 w-full items-center justify-between border-b border-zinc-200 px-2">
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" aria-label="previous page">
              <LuChevronDown className="h-4 w-4" />
            </Button>

            <Button variant="ghost" aria-label="previous page">
              <LuChevronUp className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 scroll-smooth truncate text-center text-xl font-semibold">
            {URLData?.title}
          </div>

          <div className="space-x-2">
            <Button variant="ghost" aria-label="rotate 90 degrees">
              <LuRotateCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="max-h-screen w-full flex-1">
          <SimpleBar autoHide={false} className="max-h-[calc(100vh-12.5rem)]">
            <div className="p-6">
              {type === "URL" ? (
                <pre className="text-md break-words antialiased">
                  {URLData?.texts}
                </pre>
              ) : type === "TEXT" ? (
                <pre className="text-md break-words antialiased">
                  {textData?.texts}
                </pre>
              ) : null}
            </div>
          </SimpleBar>
        </div>
      </div>
    </>
  );
};

export default TextRender;
