/* eslint-disable indent */
"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LuBadgeDollarSign, LuBot, LuSuperscript } from "react-icons/lu";

import { buttonVariants } from "@/components/ui/button";
import { BannerSVG } from "@/components/Home/BannerSvg";
import { MainDialog } from "@/components/animations/MainDialog";
import { app_name_client } from "@/lib/utils";
import { trpc } from "@/app/_trpc/client";

const Landing = () => {
  const { data: subscriptionPlan } = trpc.subscriptionPlan.useQuery();

  return (
    <section
      className="bg-white lg:max-h-[calc(100vh-56px)] lg:min-h-[calc(100vh-56px)]"
      id="home"
    >
      <div className="relative flex flex-col justify-center gap-1 overflow-hidden p-5 lg:flex-row lg:justify-between lg:p-0">
        {/* NOTE: this section from colorful background */}
        {/* TODO: main circle (right side) */}
        <div
          className="absolute inset-x-[1000px] bottom-[25px] z-0 h-80 w-80 select-none rounded-full bg-gradient-to-r from-cyan-500 
          to-blue-500 to-90% opacity-[0.15] shadow md:h-[130vh] md:w-[130vh]"
        />
        {/* TODO:  left side small circle*/}
        <Image
          priority
          placeholder="blur"
          blurDataURL="/images/ellipse2.png"
          src="/images/ellipse2.png"
          alt={app_name_client}
          width={500}
          height={503}
          className="absolute -inset-x-52 inset-y-16 z-0 select-none object-cover opacity-70"
        />
        {/* TODO: bottom middle circle */}
        <div className="absolute inset-x-[40%] top-[45rem] h-[370px] w-[370px] select-none rounded-full bg-[aqua] bg-opacity-[0.15] shadow-xl blur-3xl" />
        <Image
          priority
          placeholder="blur"
          blurDataURL="/images/ellipse2.png"
          src="/images/ellipse2.png"
          width={800}
          height={800}
          alt={app_name_client}
          quality={100}
          className="absolute left-40 top-40 z-0 select-none opacity-50 blur-xl"
        />
        <Image
          priority
          placeholder="blur"
          blurDataURL="/images/ellipse2.png"
          src="/images/ellipse2.png"
          width={400}
          height={403}
          alt={app_name_client}
          quality={100}
          className="absolute -top-[140px] left-[20rem] z-0 select-none"
        />
        <Image
          priority
          placeholder="blur"
          blurDataURL="/images/ellipse3.png"
          src="/images/ellipse3.png"
          alt={app_name_client}
          width={400}
          height={400}
          quality={100}
          className="absolute -bottom-64 z-0 select-none opacity-40 shadow-lg"
        />
        {/* NOTE: left side */}
        <div className="z-10 flex w-full justify-center lg:h-[calc(100vh-56px)] lg:w-[40%] lg:items-center">
          <div className="p-3 md:px-5">
            <h1 className="text-3xl font-light text-primary drop-shadow-md lg:text-5xl">
              LET&apos;s
            </h1>
            <h2 className="py-3 text-lg font-bold tracking-[12px] lg:text-[30px] lg:text-xl">
              CHAT WITH YOUR
            </h2>
            {/* NOTE: animation with framer-motion */}
            <MainDialog />
            <div className="mt-5 grid justify-center gap-y-4 md:mt-0">
              <p className="mt-4 max-w-prose text-center text-base leading-7 text-slate-600 lg:mt-8">
                🚀Enhance your document experience with{" "}
                <span className="relative inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-cyan-500">
                  <span className="relative font-semibold text-white">
                    {app_name_client}!
                  </span>
                </span>{" "}
                Upload files, ask questions, and receive AI-generated answers
                tailored to your content. Streamline information retrieval and
                unlock the power of intelligent insights. Elevate your
                interaction with documents like never before. Try it now!📄💡
              </p>

              <div className="flex justify-center">
                {subscriptionPlan?.slug === "free" ? (
                  <Link
                    href="/pricing"
                    className={buttonVariants({
                      variant: "default",
                      size: "lg",
                      className: "bg-primary ring-1 ring-[#5EC6B8] lg:ml-0",
                    })}
                  >
                    ORDER NOW
                  </Link>
                ) : subscriptionPlan?.slug === "pro" ||
                  subscriptionPlan?.slug === "personal" ? (
                  <Link
                    href="/files"
                    className={buttonVariants({
                      variant: "default",
                      size: "lg",
                      className: "bg-primary ring-1 ring-[#5EC6B8] lg:ml-0",
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
        <div className="mt-10 flex w-full flex-col justify-center gap-y-16 lg:mt-0 lg:h-[calc(100vh-56px)] lg:w-[50%]">
          <div className="mx-auto w-full xl:w-4/5">
            <BannerSVG />
          </div>
          <div className="border-1 child-flex mx-auto grid h-20 w-[400px] grid-cols-3 divide-x divide-primary/40 rounded-xl border border-primary/40 bg-primary/20 md:w-[500px]">
            <div>
              <LuBot className="h-6 w-6 text-primary text-slate-600" />
              <p className="font-bold text-slate-700">Neural Eng.</p>
            </div>
            <div>
              <LuSuperscript className="h-6 w-6 text-slate-600" />
              <p className="font-bold text-slate-700">Super Fast</p>
            </div>
            <div>
              <LuBadgeDollarSign className="h-6 w-6 text-slate-600" />
              <p className="font-bold text-slate-700">Low Cost</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;
