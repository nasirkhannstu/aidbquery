import React from "react";
import Link from "next/link";
import { LuHelpCircle, LuCheck, LuMinus, LuArrowRight } from "react-icons/lu";

import { LoginUser } from "@/types/nextauth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { pricingItems } from "@/lib/messages/pricingItems";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import UpgradeButton from "./UpgradeButton";
import { db } from "@/db/prisma";

interface PricingComponentProps {
  user: LoginUser | undefined;
}

const PricingComponent = async ({ user }: PricingComponentProps) => {
  let isSubscribed: boolean;

  if (user) {
    const dbUser = await db.users.findUnique({
      where: {
        id: user.id,
      },
    });
    isSubscribed = dbUser?.subscriptionStatus === "ACTIVE" ?? false;
  }

  return (
    <div className="grid grid-cols-1 gap-10 pt-12 lg:grid-cols-2">
      <TooltipProvider>
        {pricingItems.map(
          ({
            plan,
            tagline,
            quota,
            features,
            featureAll,
            finance: { price },
          }) => {
            return (
              <div
                key={plan}
                className={cn("relative rounded-2xl bg-white shadow-lg", {
                  "border-2 border-blue-600 shadow-blue-200": plan === "Pro",
                  "border border-gray-200": plan !== "Pro",
                })}
              >
                {plan === "Pro" && (
                  <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-2 text-sm font-medium text-white">
                    Upgrade now
                  </div>
                )}

                <div className="p-5">
                  <h3 className="font-display my-3 text-center text-3xl font-bold">
                    {plan}
                  </h3>
                  <p className="text-gray-500">{tagline} </p>
                  <p className="font-display my-5 text-6xl font-semibold drop-shadow-2xl">
                    ${price}
                  </p>
                  <p className="text-gray-500">per month</p>
                </div>

                <div className="flex h-20 items-center justify-center border-b border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-1">
                    <p>{quota.toLocaleString()} Documents included</p>

                    <Tooltip delayDuration={300}>
                      <TooltipTrigger className="ml-1.5 cursor-default">
                        <LuHelpCircle className="h-4 w-4 text-zinc-500" />
                      </TooltipTrigger>
                      <TooltipContent className="w-80 p-2">
                        How many documents you can upload every month (including
                        all file types).
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                <ul className="my-10 space-y-5 px-8">
                  {/* NOTE: for feature all */}
                  {featureAll.map(({ negative, text, footnote }) => (
                    <li key={text} className="flex space-x-5">
                      <div className="flex-shrink-0">
                        {!negative ? (
                          <LuMinus className="h-6 w-6 text-gray-300" />
                        ) : (
                          <LuCheck className="h-6 w-6 text-blue-500" />
                        )}
                      </div>
                      {footnote ? (
                        <div className="flex items-center space-x-1">
                          <p
                            className={cn("text-gray-600", {
                              "text-gray-400": !negative,
                            })}
                          >
                            {text}
                          </p>
                          <Tooltip delayDuration={300}>
                            <TooltipTrigger className="ml-1.5 cursor-default">
                              <LuHelpCircle className="h-4 w-4 text-zinc-500" />
                            </TooltipTrigger>
                            <TooltipContent className="w-80 p-2">
                              {footnote}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      ) : (
                        <p
                          className={cn("text-gray-600", {
                            "text-gray-400": !negative,
                          })}
                        >
                          {text}
                        </p>
                      )}
                    </li>
                  ))}

                  {/* TODO: spacific features ->  CSV */}
                  {features.csv && (
                    <li className="flex space-x-5">
                      <div className="flex-shrink-0">
                        {features.csv.isAllowed ? (
                          <LuCheck className="h-6 w-6 text-blue-500" />
                        ) : (
                          <LuMinus className="h-6 w-6 text-gray-300" />
                        )}
                      </div>

                      <div className="flex items-center space-x-1">
                        <p
                          className={cn("text-gray-600", {
                            "text-gray-400": !features.csv.isAllowed,
                          })}
                        >
                          {features.csv.text}
                        </p>
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger className="ml-1.5 cursor-default">
                            <LuHelpCircle className="h-4 w-4 text-zinc-500" />
                          </TooltipTrigger>
                          <TooltipContent className="w-80 p-2">
                            {features.csv.footnote}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </li>
                  )}

                  {/* TODO: spacific features ->  JSON */}
                  {features.json && (
                    <li className="flex space-x-5">
                      <div className="flex-shrink-0">
                        {features.json.isAllowed ? (
                          <LuCheck className="h-6 w-6 text-blue-500" />
                        ) : (
                          <LuMinus className="h-6 w-6 text-gray-300" />
                        )}
                      </div>

                      <div className="flex items-center space-x-1">
                        <p
                          className={cn("text-gray-600", {
                            "text-gray-400": !features.json.isAllowed,
                          })}
                        >
                          {features.json.text}
                        </p>
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger className="ml-1.5 cursor-default">
                            <LuHelpCircle className="h-4 w-4 text-zinc-500" />
                          </TooltipTrigger>
                          <TooltipContent className="w-80 p-2">
                            {features.json.footnote}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </li>
                  )}
                </ul>
                <div className="border-t border-gray-200" />
                <div className="p-5">
                  {plan === "Free" ? (
                    <Link
                      href={user ? "/files" : "/authentication/register"}
                      className={buttonVariants({
                        className: "w-full",
                        variant: "secondary",
                      })}
                    >
                      {user ? "Upload File" : "Sign up"}
                      <LuArrowRight className="ml-1.5 h-5 w-5" />
                    </Link>
                  ) : plan === "Pro" ? (
                    user ? (
                      isSubscribed ? (
                        <Link
                          href={"/billing"}
                          className={buttonVariants({
                            className: "w-full",
                          })}
                        >
                          Manage Subscription
                          <LuArrowRight className="ml-1.5 h-5 w-5" />
                        </Link>
                      ) : (
                        <UpgradeButton />
                      )
                    ) : (
                      <Link
                        href={"/authentication/register"}
                        className={buttonVariants({
                          className: "w-full",
                        })}
                      >
                        {"Sign up"}
                        <LuArrowRight className="ml-1.5 h-5 w-5" />
                      </Link>
                    )
                  ) : null}
                </div>
              </div>
            );
          },
        )}
      </TooltipProvider>
    </div>
  );
};

export default PricingComponent;
