"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { app_name_client } from "@/lib/utils";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const GeneralErrorPage = ({ error, reset }: ErrorPageProps) => {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <section className="relative flex max-h-[calc(100vh-56x)] min-h-[calc(100vh-56px)] w-full min-w-full justify-around bg-white">
      <Image
        src="/images/wave.png"
        className="absolute -bottom-5 min-w-full object-contain"
        alt={`${app_name_client} Error Page`}
        width={900}
        height={180}
        quality={100}
        placeholder="blur"
        blurDataURL="/images/wave.png"
      />

      <div className="min-h-full w-1/2 pt-44">
        <Image
          src="/images/error.svg"
          alt={`${app_name_client} Error Page`}
          width={700}
          height={700}
          quality={100}
          className="mx-auto object-contain"
          placeholder="blur"
          blurDataURL="/images/error.svg"
        />
      </div>
      <div className="flex min-h-full w-1/2 items-center justify-center text-start">
        <div>
          <h2 className="text-7xl font-normal text-zinc-800">OH NO!</h2>
          <h2 className="text-7xl font-normal text-zinc-800">
            ERROR {error?.name || "500"}
          </h2>
          <p className="py-10 text-2xl font-light text-zinc-500">
            {error.message ||
              "You don't know what exactly happened or why it  happened all you know is that something's wrong and you need to fix it."}
          </p>
          <p className="text-xl font-medium text-gray-500">
            Please try again later
          </p>
          <div className="my-2 flex flex-row gap-2">
            <Button onClick={reset} variant="destructive">
              Try again
            </Button>
            <Button onClick={() => router.push("/")} variant="outline">
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeneralErrorPage;
