"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Dropzone from "react-dropzone";
import { LuFileText } from "react-icons/lu";
import { RxReload } from "react-icons/rx";
import { MdErrorOutline } from "react-icons/md";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/app/_trpc/client";
import { cn, convertMBtoKB } from "@/lib/utils";
import FileIconMimeType, { type MimeType } from "../FileIconMimeType";

const DocumentUploadDropzone = () => {
  const [error, setError] = useState({ isError: false, message: "" });
  const router = useRouter();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: async (file) => {
      await utils.getUserFilesWithPagination.invalidate();
      await utils.getUserFilesDrawer.invalidate();
      router.push(`/files/${file.id}`);
    },
    retry: true,
    retryDelay: 500,
  });
  const { data: plan } = trpc.subscriptionPlan.useQuery();

  const startSimulatedProgress = () => {
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 5;
      });
    }, 500);

    return interval;
  };

  return (
    <Dropzone
      accept={{
        "text/*": [".csv"],
        "application/*": [".json"],
      }}
      multiple={false}
      onDrop={async (acceptedFile) => {
        // TODO: upload csv
        if (acceptedFile[0].type === "text/csv") {
          setIsUploading(true);

          const formData = new FormData();
          formData.append("csv", acceptedFile[0]);

          const res = await fetch("/api/uploading/csvs", {
            method: "POST",
            body: formData,
          });
          const result = await res.json();

          const progressInterval = startSimulatedProgress();

          if (!res.ok) {
            return setError({
              isError: true,
              message: result.message || "Please try again later",
            });
          }

          const key = result.key;

          if (!key) {
            return toast({
              title: "Something went wrong",
              description: "Please try again later",
              variant: "destructive",
            });
          }

          clearInterval(progressInterval);
          setUploadProgress(100);

          startPolling({ key });
        } else if (acceptedFile[0].type === "application/json") {
          // TODO: upload json
          setIsUploading(true);

          const formData = new FormData();
          formData.append("json", acceptedFile[0]);

          const res = await fetch("/api/uploading/jsons", {
            method: "POST",
            body: formData,
          });
          const result = await res.json();

          const progressInterval = startSimulatedProgress();

          if (!res.ok) {
            return setError({
              isError: true,
              message: result.message || "Please try again later",
            });
          }

          const key = result.key;

          if (!key) {
            return toast({
              title: "Something went wrong",
              description: "Please try again later",
              variant: "destructive",
            });
          }

          clearInterval(progressInterval);
          setUploadProgress(100);

          startPolling({ key });
        } else {
          return setError({
            isError: true,
            message:
              "The file you are trying to upload is not in a supported format. Only CSV and Json files are accepted.",
          });
        }
      }}
    >
      {({ getRootProps, acceptedFiles, getInputProps }) => (
        <div
          {...getRootProps()}
          className="m-4 h-72 rounded-lg border border-dashed border-primary"
        >
          <input className="hidden" {...getInputProps()} />
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <LuFileText className="mb-2 h-8 w-8 text-primary" />
                <p className="mb-2 text-base text-zinc-700">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-sm text-zinc-500">
                  CSV{" "}
                  {plan?.csv?.fileSize && (
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                      {convertMBtoKB(plan?.csv?.fileSize)}
                    </code>
                  )}{" "}
                  JSON{" "}
                  {plan?.json?.fileSize && (
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                      {convertMBtoKB(plan?.json?.fileSize)}
                    </code>
                  )}{" "}
                  file only.
                </p>
              </div>

              {acceptedFiles && acceptedFiles[0] ? (
                <div
                  className={cn(
                    "flex max-w-xs items-center divide-x overflow-hidden rounded-md bg-white outline outline-[1px]",
                    error.isError
                      ? "divide-red-400 outline-red-400"
                      : "divide-zinc-200 outline-zinc-200",
                  )}
                >
                  <div className="grid h-full place-items-center px-3 py-2">
                    <FileIconMimeType
                      mimeType={acceptedFiles[0].type as MimeType}
                    />
                  </div>
                  <div className="h-full truncate px-3 py-2 text-sm">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}

              {isUploading ? (
                <div className="mx-auto mt-4 w-full max-w-xs">
                  <Progress
                    indicatorColor={
                      uploadProgress === 100 ? "bg-green-500" : ""
                    }
                    value={uploadProgress}
                    className="h-1 w-full bg-zinc-200"
                  />
                  {uploadProgress === 100 ? (
                    <div className="flex items-center justify-center gap-1 pt-2 text-center text-sm text-zinc-700">
                      <RxReload className="h-3 w-3 animate-spin" />
                      Redirecting...
                    </div>
                  ) : null}
                </div>
              ) : null}

              {error.isError ? (
                <div className="my-1.5 flex items-center gap-x-2 rounded-md bg-red-50 px-3 py-2 tracking-tight">
                  <MdErrorOutline className="h-6 w-6 text-red-600 md:h-7 md:w-7" />{" "}
                  <p className="text-sm text-red-800 md:text-base">
                    {error.message}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

const UploadDocumentButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
        <Button className="text-xs md:text-sm">Upload Document</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DocumentUploadDropzone />
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentButton;
