import { cn } from "@/lib/utils";
import React from "react";
import { IconType } from "react-icons";
import { GoArrowUpRight } from "react-icons/go";

interface UseCaseCardProps {
  title: string;
  description: string;
  Icon: IconType;
  iconColor: string;
  iconBgColor?: string;
  rightBorder: boolean;
}

const UseCaseCard = ({
  description,
  Icon,
  title,
  iconColor,
  iconBgColor,
  rightBorder,
}: UseCaseCardProps) => {
  return (
    <div
      className={cn(
        "use-case__content border-r-0",
        rightBorder ? "md:border-r" : "",
      )}
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "mb-5 flex h-12 w-12 items-center justify-center rounded-md",
            iconBgColor,
          )}
        >
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>
        <GoArrowUpRight className="use-case__hover-icon h-8 w-8 text-slate-300" />
      </div>

      <h4 className="text-xl font-semibold text-black">{title}</h4>
      <p className="mt-3 text-base text-muted-foreground">{description}</p>
    </div>
  );
};

export default UseCaseCard;
