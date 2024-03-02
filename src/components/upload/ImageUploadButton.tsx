/* eslint-disable indent */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Dropzone from "react-dropzone";
import { MdErrorOutline } from "react-icons/md";
import { LuFile, LuImage, LuLoader2 } from "react-icons/lu";
import { TiWarningOutline } from "react-icons/ti";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/app/_trpc/client";
import { cn, convertMBtoKB } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Link from "next/link";

const ImageUploadDropzone = () => {
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
  const { data: subscriptionPlan } = trpc.subscriptionPlan.useQuery();

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
        "image/*": [".jpeg", ".png", ".jpeg"],
      }}
      multiple={false}
      onDrop={async (acceptedFile) => {
        // TODO: only allow images
        if (
          acceptedFile[0].type === "image/png" ||
          acceptedFile[0].type === "image/jpeg" ||
          acceptedFile[0].type === "image/jpg"
        ) {
          // TODO: upload image
          setIsUploading(true);

          const formData = new FormData();
          formData.append("image", acceptedFile[0]);

          const res = await fetch("/api/uploading/images", {
            method: "POST",
            body: formData,
          });
          const result = await res.json();

          const progressInterval = startSimulatedProgress();

          if (!res.ok) {
            setError({
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
              "The file you're attempting to upload is not in a supported format. Only .jpg, .png and .jpeg files are accepted.",
          });
        }
      }}
    >
      {({ getRootProps, acceptedFiles, getInputProps }) => (
        <div
          {...getRootProps()}
          className="m-4 h-72 rounded-lg border border-dashed border-rose-500"
        >
          <input className="hidden" {...getInputProps()} />
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <LuImage className="mb-2 h-8 w-8 text-rose-500" />
                <p className="mb-2 text-base text-zinc-700">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-sm text-zinc-500">
                  Image (Only .jpg, .jpeg, .png){" "}
                  {subscriptionPlan?.image?.isAllowed &&
                  subscriptionPlan.image.fileSize
                    ? `(up to ${convertMBtoKB(
                        subscriptionPlan.image.fileSize,
                      )})`
                    : null}
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
                    <LuFile className="h-4 w-4 text-slate-500" />
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
                      <LuLoader2 className="h-3 w-3 animate-spin" />
                      Redirecting...
                    </div>
                  ) : null}
                </div>
              ) : null}

              {error.isError ? (
                <div className="flex items-center gap-x-2 rounded-md bg-red-50 px-3 py-2 tracking-tight">
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

const ImageUploadButton = ({ isAllowed }: Readonly<{ isAllowed: boolean }>) => {
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
        {isAllowed ? (
          <Button
            className="border-rose-600 text-xs text-rose-600 outline-rose-500 hover:text-rose-700 md:text-sm"
            variant="outline"
          >
            Upload Image
          </Button>
        ) : (
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                className="border-rose-300 text-xs text-rose-300 outline-rose-300 hover:text-rose-300 md:text-sm"
                variant="outline"
              >
                Upload Image
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between space-x-4">
                <TiWarningOutline className="h-9 w-9 text-rose-500" />
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Pro Plan</h4>
                  <p className="text-sm">
                    This feature is only available for the Pro plan.
                  </p>
                  <Link
                    href="/pricing"
                    className={buttonVariants({
                      variant: "secondary",
                      size: "sm",
                      className: "my-1.5",
                    })}
                  >
                    Upgrade Pro
                  </Link>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <ImageUploadDropzone />
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadButton;
