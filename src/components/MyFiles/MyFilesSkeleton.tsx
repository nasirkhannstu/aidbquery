import React from "react";
import Skeleton from "react-loading-skeleton";

const MyFilesSkeleton = () => {
  return (
    <div>
      <div className="my-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 4 }).map(() => (
          <div key={Math.random() + 100} className="flex flex-col gap-y-1">
            <Skeleton height={70} className="col-span-1 shadow-sm" />
            <div className="grid grid-cols-3 gap-x-1">
              {Array.from({ length: 3 }).map((_2, j) => (
                <Skeleton
                  height={40}
                  className="col-span-1 rounded-none shadow-sm"
                  style={{ borderRadius: 0 }}
                  key={j}
                />
              ))}
            </div>
          </div>
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="hidden flex-col gap-y-1 md:flex">
            <Skeleton height={70} className="col-span-1 shadow-sm" />
            <div className="grid grid-cols-3 gap-x-1">
              {Array.from({ length: 3 }).map((_2, j) => (
                <Skeleton
                  height={40}
                  className="col-span-1 rounded-none shadow-sm"
                  style={{ borderRadius: 0 }}
                  key={j}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyFilesSkeleton;
