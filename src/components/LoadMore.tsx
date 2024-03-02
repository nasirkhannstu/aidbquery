"use client";
import { LuLoader2 } from "react-icons/lu";


function LoadMore() {
  return (
    <>
      <div className="flex justify-center items-center w-full my-3">
        <div>
          <LuLoader2 className="w-10 h-10 text-zinc-500 animate-spin" />
        </div>
      </div>
    </>
  );
}

export default LoadMore;
