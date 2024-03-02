"use client";
import React from "react";
import Link from "next/link";
import { ImUsers } from "react-icons/im";
import { LuFileCheck } from "react-icons/lu";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const DashboardItemList = () => {
  const pathname = usePathname();

  return (
    <div className="hidden w-96 border-r md:block lg:min-h-[calc(100vh-56px)]">
      <div className="w-full px-4 py-2">
        <ul className="grid-child grid w-full gap-y-1">
          <li className="text-lg text-black">DASHBOARD</li>
          <li
            className={cn(
              pathname === "/admin/users" ? "bg-primary/20 text-primary" : "",
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
              className={cn(pathname === "/admin/users" ? "text-primary" : "")}
            >
              Users
            </Link>
          </li>
          <li
            className={cn(
              pathname === "/admin/files" ? "bg-primary/20 text-primary" : "",
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
              className={cn(pathname === "/admin/files" ? "text-primary" : "")}
            >
              Uploaded Files
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardItemList;
