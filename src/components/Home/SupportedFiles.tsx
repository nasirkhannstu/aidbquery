import React from "react";
import Image from "next/image";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import pdf2 from "@/../public/images/pdf2.png";
import docx from "@/../public/images/docx.png";
import img from "@/../public/images/img.png";
import link from "@/../public/images/link.png";
import txt from "@/../public/images/txt.png";
import { app_name } from "@/lib/utils";

const SupportedFiles = () => {
  return (
    <div className="grayscale-self mx-auto flex max-w-4xl justify-around bg-white pb-5 lg:pb-24">
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Image src={pdf2} alt={app_name} placeholder="blur" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-base font-medium text-primary">PDF Documents</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Image
              src={docx}
              alt={app_name}
              className="max-h-[80px] max-w-[80px]"
              placeholder="blur"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-base font-medium text-primary">
              MS Word Documents
            </p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Image
              src={img}
              alt={app_name}
              className="max-h-[80px] max-w-[80px]"
              placeholder="blur"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-base font-medium text-primary">Images</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Image
              src={link}
              alt={app_name}
              className="max-h-[80px] max-w-[80px]"
              placeholder="blur"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-base font-medium text-primary">Website Links</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Image
              src={txt}
              alt={app_name}
              className="max-h-[80px] max-w-[80px]"
              placeholder="blur"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-base font-medium text-primary">TXT Files</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default SupportedFiles;
