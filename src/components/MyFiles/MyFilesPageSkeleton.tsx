import React from "react";
import FixMaxWidth from "../FixMaxWidth";
import Skeleton from "react-loading-skeleton";
import MyFilesSkeleton from "./MyFilesSkeleton";

const MyFilesPageSkeleton = () => {
  return (
    <FixMaxWidth className="my-16 min-h-screen px-0 md:px-0">
      <div className="my-2 flex w-full flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <Skeleton height={55} className="col-span-1 shadow-sm" width={250} />
        </div>
        <div className="mt-4 flex gap-x-2 md:my-0">
          <Skeleton height={35} className="col-span-1 shadow-sm" width={165} />
          <Skeleton height={35} className="col-span-1 shadow-sm" width={165} />
          <Skeleton height={35} className="col-span-1 shadow-sm" width={165} />
        </div>
      </div>
      <Skeleton height={3} />
      <div className="my-2 w-full">
        <MyFilesSkeleton />
      </div>
    </FixMaxWidth>
  );
};

export default MyFilesPageSkeleton;
