"use client";
import SimpleBar from "simplebar-react";
import { LuChevronDown, LuChevronUp, LuRotateCw } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import { trpc } from "@/app/_trpc/client";

interface DOCRenderProps {
  fileId: string;
}

const DOCRender = ({ fileId }: DOCRenderProps) => {
  const { data: file } = trpc.getDOCTexts.useQuery(
    { fileId: fileId },
    { retry: true, retryDelay: 500 },
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
            {file?.title}
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
              <pre className="text-md break-words antialiased">
                {file?.texts}
              </pre>
            </div>
          </SimpleBar>
        </div>
      </div>
    </>
  );
};

export default DOCRender;
