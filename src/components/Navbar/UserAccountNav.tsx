/* eslint-disable indent */
"use client";
import Image from "next/image";
import Link from "next/link";
import { LuGem } from "react-icons/lu";
import { signOut } from "next-auth/react";
import { ImWarning } from "react-icons/im";
import moment from "moment";
import { RxCalendar } from "react-icons/rx";

import { Button } from "@/components/ui/button";
import { Icons } from "../Icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/app/_trpc/client";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";

interface UserAccountNavProps {
  userId: string;
  email: string | undefined;
  name: string;
  imageBase64: string | undefined;
  isEmailVerify: boolean;
  isAdmin: boolean;
  createdAt: Date;
}

const UserAccountNav = ({
  email,
  name,
  isEmailVerify,
  userId,
  isAdmin,
  imageBase64,
  createdAt,
}: UserAccountNavProps) => {
  const { data: subscriptionPlan } = trpc.subscriptionPlan.useQuery();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="overflow-visible">
        <Button className="aspect-square h-8 w-8 rounded-full bg-slate-400">
          <Avatar className="relative h-8 w-8">
            {imageBase64 ? (
              <div className="relative aspect-square h-full w-full">
                <Image
                  width={32}
                  height={32}
                  src={`data:image/png;base64,${imageBase64}`}
                  blurDataURL={`data:image/png;base64,${imageBase64}`}
                  alt="profile picture"
                  referrerPolicy="no-referrer"
                  placeholder="blur"
                  className="aspect-square h-full w-full rounded-full object-cover"
                />
              </div>
            ) : (
              <AvatarFallback>
                <span className="sr-only">{name}</span>
                <Icons.user className="h-4 w-4 text-zinc-900" />
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-white" align="end">
        <div className="flex items-center justify-between gap-2 p-2">
          <div className="flex flex-col space-y-0.5 leading-none">
            {name && <p className="text-sm font-semibold text-black">{name}</p>}
            {email && (
              <p className="w-[200px] truncate text-xs text-slate-500">
                {email}
              </p>
            )}
          </div>
          <div>
            {!isEmailVerify ? (
              <HoverCard>
                <HoverCardTrigger>
                  <ImWarning
                    className="cursor-pointer text-amber-600"
                    size={20}
                  />
                </HoverCardTrigger>
                <HoverCardContent className="w-80 bg-amber-50">
                  <div className="flex justify-between space-x-4">
                    <ImWarning className="h-10 w-10 text-amber-600" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">
                        Email not verified
                      </h4>
                      <p className="text-sm">
                        Please verify your email to access all features.
                      </p>
                      <div className="flex items-center pt-2">
                        <RxCalendar className="mr-2 h-4 w-4 opacity-70" />{" "}
                        <span className="text-xs text-muted-foreground">
                          Joined at {moment(createdAt).format("LLL")}
                        </span>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ) : null}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/files" className="cursor-pointer">
            My Files
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/profile/${userId}`} className="cursor-pointer">
            Profile
          </Link>
        </DropdownMenuItem>
        {isAdmin ? (
          <DropdownMenuItem asChild>
            <Link href={"/admin/users"} className="cursor-pointer">
              Dashboard
            </Link>
          </DropdownMenuItem>
        ) : null}

        <DropdownMenuItem asChild>
          <Link href="/change-password" className="cursor-pointer">
            Change Password
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          {subscriptionPlan?.slug === "pro" &&
          subscriptionPlan?.isSubscribed ? (
            <Link href="/billing" className="cursor-pointer">
              Manage Subscription
            </Link>
          ) : subscriptionPlan?.slug === "personal" ? null : (
            <Link href="/pricing" className="cursor-pointer">
              Upgrade <LuGem className="ml-1.5 h-4 w-4 text-pink-600" />
            </Link>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() =>
            signOut({ callbackUrl: "/authentication/login", redirect: true })
          }
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
