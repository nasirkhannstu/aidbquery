"use client";
import { ReactNode, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const FixMaxWidth = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  const [isRender, setIsRender] = useState(false);

  useEffect(() => {
    setIsRender(true);
  }, []);

  if (!isRender) return null;

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-screen-xl px-2.5 md:px-20",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default FixMaxWidth;
