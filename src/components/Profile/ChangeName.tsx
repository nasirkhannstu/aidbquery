"use client";
import React, { useEffect, useState } from "react";
import { LuFileEdit } from "react-icons/lu";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { RxReload } from "react-icons/rx";
import { MdErrorOutline } from "react-icons/md";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { trpc } from "@/app/_trpc/client";
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

interface EditNameProps {
  name: string;
}

const ChangeName = ({ name }: EditNameProps) => {
  const [error, setError] = useState<string[]>([]);
  const { update } = useSession();
  const [open, setOpen] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>("");
  const router = useRouter();
  const { mutate: changeName, isLoading } = trpc.changeName.useMutation({
    onSuccess: async ({ name }) => {
      await update({ name });
      router.refresh();
      setOpen(false);
    },
    onError({ data, message }) {
      if (data?.zodError && data.zodError.fieldErrors.name?.length) {
        return setError(data.zodError.fieldErrors.name);
      }
      setError([message]);
    },
  });

  useEffect(() => {
    setEditName(name);
  }, [name]);

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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Change Name</DialogTitle>
          <DialogDescription>Make change your name.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="name"
              className="text-xs font-semibold md:text-base"
            >
              Enter your full name
            </Label>

            <Input
              id="name"
              defaultValue={name}
              onChange={(e) => setEditName(e.target.value)}
              className="col-span-3 h-10 text-sm md:h-14 md:text-base"
              placeholder="Full name"
            />
          </div>
        </div>

        {error.length > 0 &&
          error.map((x, i) => (
            <div
              key={i}
              className="flex items-center gap-x-2 rounded-md bg-red-50 px-3 py-2 tracking-tight"
            >
              <MdErrorOutline className="h-6 w-6 text-red-600" />{" "}
              <p className="text-sm text-red-800 md:text-base">{x}</p>
            </div>
          ))}

        <DialogFooter>
          {isLoading ? (
            <Button disabled className="text-sm md:text-base">
              <RxReload className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => changeName({ name: editName })}
              disabled={isLoading || !editName}
              className="h-10 text-base font-semibold md:h-11"
            >
              Update
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeName;
