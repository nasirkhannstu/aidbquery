"use client";
import { useState } from "react";
import { RxReload } from "react-icons/rx";
import { MdErrorOutline } from "react-icons/md";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { trpc } from "@/app/_trpc/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const URLUploadButton = () => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const utils = trpc.useUtils();
  const { isLoading, mutate } = trpc.setUrlData.useMutation({
    onSuccess: async ({ success }) => {
      if (success) {
        await utils.getUserFilesWithPagination.invalidate();
        await utils.getUserFilesDrawer.invalidate();
        setIsOpen(false);
      }
    },
    onError: ({ message, data }) => {
      if (data?.zodError && data.zodError.fieldErrors.url?.length) {
        return setError(data.zodError.fieldErrors.url);
      }
      setError([message]);
    },
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button className="bg-slate-200 text-xs text-slate-600 hover:bg-slate-400/50 md:text-sm">
          Website URL
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Website URL</DialogTitle>

          <DialogDescription>
            Enter a webpage URL below, and let AI provide insights about the
            page in chat response. With proper formatting in{" "}
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
              http://
            </code>{" "}
            or{" "}
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
              https://
            </code>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="url">Website URL</Label>
            <Input
              type="text"
              id="url"
              placeholder="Example: https://www.wikipedia.org/"
              onChange={(e) => setUrl(e.target.value)}
              value={url}
            />
          </div>
        </div>

        {error.length > 0 &&
          error.map((x, i) => (
            <div
              key={i}
              className="flex items-center gap-x-2 rounded-md bg-red-50 px-3 py-2 tracking-tight"
            >
              <MdErrorOutline className="h-6 w-6 text-red-600 md:h-7 md:w-7" />{" "}
              <p className="text-sm text-red-800 md:text-base">{x}</p>
            </div>
          ))}

        <DialogFooter>
          {isLoading ? (
            <Button disabled className="h-10">
              <RxReload className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              disabled={!url}
              onClick={() => mutate({ url })}
              type="button"
              className="text-xs md:text-base"
            >
              Let&apos;s Chat
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default URLUploadButton;
