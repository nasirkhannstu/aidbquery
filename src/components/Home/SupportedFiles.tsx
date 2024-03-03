import { FaFileCsv } from "react-icons/fa6";
import { LuFileJson } from "react-icons/lu";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SupportedFiles = () => {
  return (
    <div className="grayscale-self mx-auto my-10 flex justify-center gap-x-5 bg-white pb-5 md:my-0 lg:pb-24">
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <FaFileCsv className="h-24 w-24 cursor-pointer text-green-500" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-base font-medium text-primary">CSV file</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <LuFileJson className="h-24 w-24 cursor-pointer text-slate-500" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-base font-medium text-primary">JSON file</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default SupportedFiles;
