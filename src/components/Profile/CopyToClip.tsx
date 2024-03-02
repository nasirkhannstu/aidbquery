"use client";
import React, { useEffect, useState } from "react";
import { MdContentCopy } from "react-icons/md";

import { Button } from "@/components/ui/button";

interface CopyToClipProps {
  toCopy: string;
}

const CopyToClip = ({ toCopy }: CopyToClipProps) => {
  const [text] = useState(toCopy);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCopied(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [toCopy, copied, setCopied]);

  return (
    <>
      {copied ? (
        <span className="text-semibold h-7 text-primary">Copied!</span>
      ) : (
        <Button
          aria-label="copy to clip"
          variant="ghost"
          size="icon"
          className="h-7 hover:bg-zinc-200"
          onClick={async () => {
            await navigator.clipboard.writeText(text);
            setCopied(true);
          }}
        >
          <MdContentCopy className="h-4 w-4 text-primary" />
        </Button>
      )}
    </>
  );
};

export default CopyToClip;
