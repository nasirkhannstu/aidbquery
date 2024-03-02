"use client";
import React from "react";
import { MdDashboard } from "react-icons/md";
import { usePathname } from "next/navigation";
import { LuFileCheck } from "react-icons/lu";
import { ImUsers } from "react-icons/im";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const MobileDashboardItemList = () => {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="md:hidden"
          variant="ghost"
          size="icon"
          aria-label="Open dashboard list"
        >
          <MdDashboard className="relative z-50 h-6 w-6 text-primary" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[350px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle>DASHBOARD</SheetTitle>
        </SheetHeader>
        <div className="w-full">
          <div className="w-full px-4 py-2">
            <ul className="grid-child grid w-full gap-y-1">
              <li
                className={cn(
                  pathname === "/admin/users"
                    ? "bg-primary/20 text-primary"
                    : "",
                )}
              >
                <ImUsers
                  className={cn(
                    "h-6 w-6",
                    pathname === "/admin/users" ? "text-primary" : "",
                  )}
                />
                <Link
                  href="/admin/users"
                  className={cn(
                    pathname === "/admin/users" ? "text-primary" : "",
                  )}
                >
                  Users
                </Link>
              </li>
              <li
                className={cn(
                  pathname === "/admin/files"
                    ? "bg-primary/20 text-primary"
                    : "",
                )}
              >
                <LuFileCheck
                  className={cn(
                    "h-6 w-6",
                    pathname === "/admin/files" ? "text-primary" : "",
                  )}
                />
                <Link
                  href="/admin/files"
                  className={cn(
                    pathname === "/admin/files" ? "text-primary" : "",
                  )}
                >
                  Uploaded Files
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileDashboardItemList;
