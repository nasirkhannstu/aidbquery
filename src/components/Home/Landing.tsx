/* eslint-disable indent */
"use client";
import Link from "next/link";
import Image from "next/image";

import { buttonVariants } from "@/components/ui/button";
import { MainDialog } from "@/components/animations/MainDialog";
import { trpc } from "@/app/_trpc/client";
import Description from "./Description";
import banner from "@/public/images/banner2.svg";

const Landing = () => {
  const { data: subscriptionPlan } = trpc.subscriptionPlan.useQuery();

  return (
    <section
      className="relative bg-white lg:max-h-[calc(100vh-56px)] lg:min-h-[calc(100vh-56px)]"
      id="home"
    >
      {/* NOTE: left side */}
      <div className="z-50 mx-auto flex w-full max-w-6xl items-center  py-28">
        <div className="p-3 md:px-5">
          <h1 className="text-center text-3xl font-light text-primary drop-shadow-md lg:text-5xl">
            LET&apos;s
          </h1>
          <h2 className="py-3 text-center text-lg font-bold tracking-[12px] lg:text-[30px] lg:text-xl">
            CHAT WITH YOUR
          </h2>
          {/* NOTE: animation with framer-motion */}

          {/* <MainDialog /> */}
          <h1 className="text-center text-5xl font-extrabold leading-none tracking-wide text-primary drop-shadow-md md:text-[63px] ">
            Database
          </h1>
          <div className="mt-5 grid justify-center gap-y-4 md:mt-0">
            <Description />

            <div className="flex justify-center">
              {subscriptionPlan?.slug === "free" ? (
                <Link
                  href="/pricing"
                  className={buttonVariants({
                    variant: "default",
                    size: "lg",
                    className:
                      "bg-primary font-semibold leading-none ring-1 lg:ml-0",
                  })}
                >
                  ORDER NOW
                </Link>
              ) : subscriptionPlan?.slug === "premium" ||
                subscriptionPlan?.slug === "personal" ? (
                <Link
                  href="/files"
                  className={buttonVariants({
                    variant: "default",
                    size: "lg",
                    className: "bg-primary font-semibold ring-1 lg:ml-0",
                  })}
                >
                  LET&apos;s CHAT
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* NOTE: right side */}
      {/* <Image
        src={banner}
        alt="Banner"
        className="absolute left-0 top-0 z-0 opacity-10"
      /> */}
    </section>
  );
};

export default Landing;
