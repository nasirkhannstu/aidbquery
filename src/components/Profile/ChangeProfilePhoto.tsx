"use client";
import React, { useCallback, useState } from "react";
import { LuFile, LuFileEdit } from "react-icons/lu";
import { useRouter } from "next/navigation";
import Dropzone from "react-dropzone";
import { TfiCheckBox } from "react-icons/tfi";
import { useSession } from "next-auth/react";
import FileResizer from "react-image-file-resizer";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

const ChangeProfilePhoto = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { update } = useSession();
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const router = useRouter();
  const toast = useToast();

  const resizeImage = useCallback((file: File) => {
    return new Promise<File>((resolve, reject) => {
      try {
        FileResizer.imageFileResizer(
          file,
          500,
          500,
          "PNG",
          100,
          0,
          (uri) => {
            resolve(uri as File);
          },
          "file",
        );
      } catch (error) {
        reject(error);
      }
    });
  }, []);

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          aria-label="edit name"
          variant="ghost"
          size="icon"
          className="h-7 p-0"
        >
          <LuFileEdit className="h-6 w-6 text-primary" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-xl">
        <DialogHeader>
          <DialogTitle>Change profile picture</DialogTitle>
          <DialogDescription>
            Upload a new image to change your profile picture.
          </DialogDescription>
        </DialogHeader>

        <Dropzone
          accept={{ "image/*": [".jpg", ".jpeg", ".png"] }}
          multiple={false}
          onDrop={async (acceptedFile) => {
            setIsUploading(true);

            const resizedImage = await resizeImage(acceptedFile[0]);

            const formData = new FormData();
            formData.append("avatar", resizedImage);

            const res = await fetch("/api/uploading/avatars", {
              method: "POST",
              body: formData,
            });
            const result = await res.json();

            const progressInterval = startSimulatedProgress();

            if (!res.ok) {
              toast.toast({
                title: "Upload failed",
                description: result.message,
                variant: "destructive",
              });
            }

            clearInterval(progressInterval);
            setUploadProgress(100);

            await update({ avatar: result.avatar });

            router.refresh();
            setIsUploading(false);
            setOpen(false);
          }}
        >
          {({ getRootProps, acceptedFiles, getInputProps }) => (
            <div
              {...getRootProps()}
              className="grid h-52 cursor-pointer items-center gap-4 rounded-md border-2 border-dashed py-4"
            >
              <div className="mx-auto text-center">
                <input {...getInputProps()} />
                <p>
                  <span className="font-semibold">
                    {" "}
                    Drag &apos;n&apos; drop
                  </span>{" "}
                  your image here, or click to select file.
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Only <code className="font-semibold">JPG</code>,{" "}
                  <code className="font-semibold">JPEG</code>, or{" "}
                  <code className="font-semibold">PNG</code> images are
                  supported, <br /> each must be less than{" "}
                  <code className="font-semibold">4MB</code> in size.
                </p>

                <div className="my-5 flex flex-col justify-center gap-y-2">
                  {acceptedFiles && acceptedFiles[0] ? (
                    <div className="mx-auto flex max-w-xs items-center divide-x divide-zinc-200 overflow-hidden truncate rounded-md bg-white outline outline-[1px] outline-zinc-200">
                      <div className="grid h-full place-items-center px-3 py-2">
                        <LuFile className="h-4 w-4 text-slate-500" />
                      </div>
                      <div className="h-full truncate px-3 py-2 text-sm">
                        {acceptedFiles[0].name}
                      </div>
                    </div>
                  ) : null}

                  {isUploading ? (
                    <div className="mx-auto w-full max-w-xs">
                      <Progress
                        indicatorColor={
                          uploadProgress === 100 ? "bg-green-500" : ""
                        }
                        value={uploadProgress}
                        className="h-1 w-full bg-zinc-200"
                      />
                      {uploadProgress === 100 ? (
                        <div className="flex items-center justify-center gap-1 pt-2 text-center text-sm text-zinc-700">
                          <TfiCheckBox className="h-6 w-6 text-green-500" />
                          <p className="font-semibold">Succeed</p>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </Dropzone>

        <DialogFooter>
          <Button
            type="button"
            size="lg"
            disabled={isUploading}
            onClick={() => setOpen(false)}
            variant="destructive"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeProfilePhoto;
