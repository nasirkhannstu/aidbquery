import Skeleton from "react-loading-skeleton";
import { BsSendCheck } from "react-icons/bs";

import { cn } from "@/lib/utils";

export const ListLoader = () => {
  return (
    <div className="hidden min-h-full w-80 xl:block">
      <div className="flex justify-between gap-x-2 px-2 py-3">
        <div className="grid gap-y-2">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-7 w-7" />
      </div>
      <div className="mt-3 px-2">
        {Array.from({ length: 13 }).map((_, i) => (
          <Skeleton key={i} className="my-1 h-12 w-full" />
        ))}
      </div>
    </div>
  );
};

export const FileLoader = () => {
  return (
    <div className="h-1/2 w-full max-w-full px-2 lg:h-full lg:w-[60%]">
      <div className="my-3 flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton className="h-10 w-10" key={i} />
          ))}
        </div>
        <div className="flex items-center gap-x-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton className="h-10 w-20" key={i} />
          ))}
        </div>
      </div>

      <div className="my-3 flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton className={cn("h-9", i === 1 ? "w-16" : "w-9")} key={i} />
          ))}
        </div>
        <Skeleton className="my-auto hidden h-4 w-96 md:block" />
        <div className="flex items-center gap-x-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton className={cn("h-9", i === 0 ? "w-20" : "w-9")} key={i} />
          ))}
        </div>
      </div>
      <hr />

      <div className="w-full px-16 py-16">
        <Skeleton className="mx-auto my-3 h-6 w-2/3" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-52" />

        <div className="my-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              className={cn("h-3", i === 4 ? "w-2/3" : "w-full")}
            />
          ))}
        </div>
        <div className="my-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className={cn("h-3", i === 5 ? "w-5/6" : "w-full")}
            />
          ))}
        </div>
        <div className="my-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className={cn("h-3", i === 3 ? "w-1/3" : "w-full")}
            />
          ))}
        </div>
        <div className="my-5">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton
              key={i}
              className={cn("h-3", i === 1 ? "w-1/2" : "w-full")}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const ChatLoader = () => {
  return (
    <div className="hidden h-1/2 w-full max-w-full flex-col justify-between p-6 md:flex lg:h-full lg:w-[40%]">
      <div className="flow-root  w-full">
        <Skeleton className={cn("my-3 h-16 w-2/3", "float-right")} />
        <Skeleton className={cn("my-3 h-32 w-3/4", "float-left")} />
        <Skeleton className={cn("my-3 h-16 w-1/2", "float-right")} />
        <Skeleton className={cn("my-3 h-36 w-3/4", "float-left")} />
        <Skeleton className={cn("my-3 h-10 w-2/3", "float-right")} />
        <Skeleton className={cn("my-3 h-20 w-3/4", "float-left")} />
      </div>

      <div className="mb-10 flex items-center justify-between gap-x-2">
        <div className="max-w-full flex-1">
          <Skeleton className="h-14 w-full" />
        </div>
        <div className="flex h-14 w-14 items-center justify-center bg-slate-200">
          <BsSendCheck className="h-7 w-7 text-slate-400" />
        </div>
      </div>
    </div>
  );
};
