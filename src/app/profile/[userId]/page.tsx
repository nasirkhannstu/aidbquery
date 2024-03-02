/* eslint-disable indent */
import React from "react";
import Link from "next/link";
import lodash from "lodash";
import Image from "next/image";
import moment from "moment";
import { FaAngleRight, FaFreeCodeCamp, FaIdCard } from "react-icons/fa6";
import { BsCalendar2Date } from "react-icons/bs";
import { RiMicrosoftLine, RiLockPasswordFill } from "react-icons/ri";
import { GiTimeBomb } from "react-icons/gi";
import { IoDiamond } from "react-icons/io5";
import { AiOutlineUser } from "react-icons/ai";
import {
  MdAddPhotoAlternate,
  MdOutlineAlternateEmail,
  MdOutlineMarkEmailRead,
  MdOutlineUpdate,
} from "react-icons/md";
import fs from "fs";

import FixMaxWidth from "@/components/FixMaxWidth";
import { Card } from "@/components/ui/card";
import { user } from "@/lib/user";
import { buttonVariants } from "@/components/ui/button";
import ChangeName from "@/components/Profile/ChangeName";
import { cn, using_mode } from "@/lib/utils";
import ChangeProfilePhoto from "@/components/Profile/ChangeProfilePhoto";

const ProfilePage = async ({
  params: { userId },
}: {
  params: { userId: string };
}) => {
  const result = await user(userId);

  const imageBase64 = fs.readFileSync(
    "public/uploads/avatars/" + result?.avatar,
    {
      encoding: "base64",
    },
  );

  return (
    result && (
      <FixMaxWidth>
        <div className="my-5 flex items-center gap-3">
          <Link href="/files" className="text-zinc-700">
            My Files
          </Link>
          <FaAngleRight className="h-4 w-4 text-zinc-400" />
          <p className="text-zinc-700">Profile</p>
        </div>

        <div className="my-7">
          <h2 className="my-1 text-2xl font-semibold">User Profile</h2>
          <p className="font-sm text-muted-foreground">View user details</p>
        </div>

        {/* TODO: Basic Profile Info */}
        <Card className="grid grid-cols-1 px-5 py-8 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <h2 className="text-xl font-semibold">Profile</h2>
            <p className="text-sm tracking-tight text-muted-foreground">
              Manage your profile
            </p>
          </div>
          <div className="col-span-1 lg:col-span-2">
            <div className="mt-5 md:pr-10">
              <div className="mb-1 flex items-center gap-2">
                <MdAddPhotoAlternate className="h-4 w-4 text-zinc-400" />
                <h2 className="text-md font-semibold text-zinc-800">Avatar</h2>
              </div>
              <div className="flex items-center justify-between">
                <Image
                  src={`data:image/png;base64,${imageBase64}`}
                  alt={result.name}
                  width={300}
                  height={300}
                  referrerPolicy="no-referrer"
                  className="border-1 aspect-square h-60 w-60 rounded-md border object-cover p-1 hover:cursor-pointer"
                  placeholder="blur"
                  blurDataURL={"/uploads/avatars/" + result.avatar}
                />
                <div className="px-2 py-1">
                  <ChangeProfilePhoto />
                </div>
              </div>
            </div>
            <div className="mt-5 pr-10">
              <div className="mb-1 flex items-center gap-2">
                <FaIdCard className="h-4 w-4 text-zinc-400" />
                <h2 className="text-md font-semibold text-zinc-800">Name</h2>
              </div>
              <div className="flex items-center justify-between rounded px-2 py-1">
                <p className="text-base text-muted-foreground">
                  {result?.name}
                </p>
                <ChangeName name={result?.name} />
              </div>
            </div>
            <div className="mt-5 pr-10">
              <div className="mb-1 flex items-center gap-2">
                <MdOutlineAlternateEmail className="h-4 w-4 text-zinc-400" />
                <h2 className="text-md font-semibold text-zinc-800">
                  Email Address
                </h2>
              </div>
              <div className="flex items-center justify-between rounded px-2 py-1">
                <div className="flex items-center gap-1">
                  <p className="text-base text-muted-foreground">
                    {result?.email}
                  </p>
                  {result?.isEmailVerify ? (
                    <p className="rounded-full border border-green-600 bg-green-100 px-3 py-1 text-sm text-green-600">
                      Verified
                    </p>
                  ) : (
                    <p className="rounded-full border border-red-600 bg-red-100 px-3 py-1 text-sm text-red-600">
                      Unverified
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-5 pr-10">
              <div className="mb-1 flex items-center gap-2">
                <BsCalendar2Date className="h-4 w-4 text-zinc-400" />
                <h2 className="text-md font-semibold text-zinc-800">Joined</h2>
              </div>
              <div className="flex items-center justify-between rounded px-2 py-1">
                <p className="text-base text-muted-foreground">
                  {moment(result.createdAt).format("llll")}
                </p>
              </div>
            </div>
            <div className="mt-5 pr-10">
              <div className="mb-1 flex items-center gap-2">
                <MdOutlineUpdate className="h-4 w-4 text-zinc-400" />
                <h2 className="text-md font-semibold text-zinc-800">
                  Last Account Update
                </h2>
              </div>
              <div className="flex items-center justify-between rounded px-2 py-1">
                <p className="text-base text-muted-foreground">
                  {moment(result.updatedAt).format("llll")}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* TODO: User Permission */}
        <Card className="my-5 grid grid-cols-1 px-5 py-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="pr-4">
            <h2 className="text-xl font-semibold">User Permission</h2>
            <p className="text-sm tracking-tight text-muted-foreground">
              Define the permissions for this user. This overrides the default
              permissions as defined in User Settings.
            </p>
          </div>
          <div className="col-span-1 lg:col-span-2">
            {/* TODO: application mode display */}
            {result.role === "ADMIN" ? (
              <div className="pr-10">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <RiMicrosoftLine className="h-5 w-5 text-zinc-400" />
                    <h2 className="text-md font-semibold text-zinc-800">
                      Application Mode
                    </h2>
                  </div>
                  <div className="flex items-center justify-between px-2 py-1">
                    <p
                      className={cn(
                        "rounded-2xl border px-3 py-1 font-bold",
                        using_mode === "SaaS"
                          ? "border-cyan-600 bg-cyan-100 text-cyan-600"
                          : "border-emerald-600 bg-emerald-100 text-emerald-600",
                      )}
                    >
                      {using_mode}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {/* TODO: user type display */}
            {result.role === "ADMIN" && (
              <div className="pr-10">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <AiOutlineUser className="h-6 w-6 text-zinc-400" />
                    <h2 className="text-md font-semibold text-zinc-800">
                      User Type
                    </h2>
                  </div>
                  <div className="flex items-center px-2 py-1">
                    <p
                      className={cn(
                        "rounded-2xl border px-3 py-1 font-bold",
                        result.role === "ADMIN"
                          ? "border-sky-600 bg-sky-100 text-sky-600"
                          : "border-lime-600 bg-lime-100 text-lime-600",
                      )}
                    >
                      {result.role}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {using_mode === "SaaS" ? (
              <div className="pr-10">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <IoDiamond className="h-5 w-5 text-zinc-400" />
                    <h2 className="text-md font-semibold text-zinc-800">
                      Subscription Plan
                    </h2>
                  </div>
                  <div className="flex items-center px-2 py-1">
                    <p
                      className={cn(
                        "text-xl font-bold",
                        result.subscriptionStatus === "ACTIVE" ||
                          result.subscriptionStatus === "CANCELED"
                          ? "text-pink-600"
                          : "text-sky-600",
                      )}
                    >
                      {result.subscriptionStatus === "ACTIVE"
                        ? "Pro Plan"
                        : "Free Plan"}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {using_mode === "SaaS" ? (
              <div className="pr-10">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <FaFreeCodeCamp className="h-6 w-6 text-zinc-400" />

                    <h2 className="text-md font-semibold text-zinc-800">
                      Subscription Status
                    </h2>
                  </div>
                  <div className="flex items-center px-2 py-1">
                    <p
                      className={cn(
                        "rounded-full border px-3 py-1 font-bold",
                        result.subscriptionStatus === "ACTIVE"
                          ? "border-green-600 bg-green-100 text-green-600"
                          : result.subscriptionStatus === "NULL"
                            ? "bg-state-100 text-state-600 border-0 border-slate-600"
                            : "border-yellow-600 bg-yellow-100 text-yellow-400",
                      )}
                    >
                      {result.subscriptionStatus === "NULL"
                        ? "N/A"
                        : result.subscriptionStatus}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {using_mode === "SaaS" ? (
              <div className="mt-5 pr-10">
                <div className="mb-1 flex items-center gap-2">
                  <GiTimeBomb className="h-4 w-4 text-indigo-600" />
                  <h2 className="text-md font-semibold text-zinc-800">
                    Current plan end
                  </h2>
                </div>
                <div className="flex items-center justify-between rounded border border-zinc-300 bg-zinc-50 px-2 py-1">
                  <p>
                    {result.stripeCurrentPeriodEnd
                      ? moment(result.stripeCurrentPeriodEnd).format("LLLL")
                      : "n/a"}
                  </p>
                </div>
              </div>
            ) : null}

            {using_mode === "SaaS" ? (
              <div className="mr-10 mt-5 flex items-center justify-end">
                <Link
                  href="/billing"
                  className={buttonVariants({
                    variant: "default",
                    size: "lg",
                    className: "text-base",
                  })}
                >
                  {result.subscriptionStatus === "ACTIVE"
                    ? "Manage My Subscription"
                    : "Upgrade Pro"}
                </Link>
              </div>
            ) : null}
          </div>
        </Card>

        {/* TODO: User Securities */}
        <Card className="my-5 grid grid-cols-1 px-5 py-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="pr-4">
            <h2 className="text-xl font-semibold">Security</h2>
            <p className="text-sm tracking-tight text-muted-foreground">
              Manage security settings
            </p>
          </div>
          <div className="col-span-1 lg:col-span-2">
            <div className="pr-10">
              <div className="mb-1 flex items-center gap-2">
                <RiLockPasswordFill className="h-4 w-4 text-zinc-400" />
                <h2 className="text-md font-semibold text-zinc-800">
                  Password
                </h2>
              </div>
              <div className="flex items-center justify-between px-2 py-1">
                {result?._count?.ForgotPassword > 0 &&
                result?.ForgotPassword &&
                result?.ForgotPassword?.length > 0 ? (
                  <p className="text-sm">
                    Last update on{" "}
                    {moment(
                      lodash.last(result.ForgotPassword)?.createdAt,
                    ).format("llll")}
                  </p>
                ) : (
                  <p className="text-sm">
                    Last update on{" "}
                    {moment(
                      lodash.last(result.ForgotPassword)?.updatedAt,
                    ).format("llll")}
                  </p>
                )}

                <Link
                  href="/change-password"
                  className={buttonVariants({
                    variant: "default",
                    size: "lg",
                    className: "text-base",
                  })}
                >
                  Change Password
                </Link>
              </div>
            </div>
            <div className="mt-5 pr-10">
              <div className="mb-1 flex items-center gap-2">
                <MdOutlineMarkEmailRead className="h-4 w-4 text-zinc-400" />
                <h2 className="text-md font-semibold text-zinc-800">
                  Email Verification
                </h2>
              </div>
              <div className="flex items-center justify-between rounded px-2 py-1">
                {result?.isEmailVerify ? (
                  <p className="rounded-full border border-green-600 bg-green-100 px-3 py-1 text-sm text-green-600">
                    Verified
                  </p>
                ) : (
                  <>
                    <p className="rounded-full border border-red-600 bg-red-100 px-3 py-1 text-sm text-red-600">
                      Unverified
                    </p>
                    <p className="text-sm text-gray-400">
                      Please verify your email address to access all services.
                    </p>
                  </>
                )}

                {result?.isEmailVerify ? null : (
                  <Link
                    href="/verifications/email"
                    className={buttonVariants({
                      variant: "link",
                    })}
                  >
                    Verify
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Card>
      </FixMaxWidth>
    )
  );
};

export default ProfilePage;
