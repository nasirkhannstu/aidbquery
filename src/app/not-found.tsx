import React from "react";
import { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import { app_name, cn } from "@/lib/utils";
import { concert } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "404 Not Found - Your requested resources not found",
  description: "404 Not Found - Your requested resources not found",
};

const NotFoundPage = () => {
  return (
    <main className="flex max-h-[calc(100vh-56px)] min-h-[calc(100vh-56px)] min-w-full max-w-full justify-around bg-white">
      <div className="flex w-1/2 items-end justify-center bg-primary/50 pt-40">
        <Image
          src="/images/404.png"
          alt={`${app_name}`}
          width={800}
          height={800}
          style={{ objectFit: "contain" }}
          quality={100}
          placeholder="blur"
          blurDataURL="/images/404.png"
        />
      </div>
      <div className="min-h- grid w-1/2 items-center text-center">
        <div>
          <h2
            className={cn(
              "text-[205px] font-extrabold text-primary/80",
              concert.className,
            )}
          >
            404
          </h2>
          <h5 className="-mt-5 text-5xl font-thin">OOOps!</h5>
          <h1
            className={cn(
              "mt-4 text-4xl font-thin tracking-tight text-gray-900 sm:text-5xl",
              concert.className,
            )}
          >
            Page not found
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6 font-sans">
            <Link href="/" className={buttonVariants({ size: "lg" })}>
              Go back home
            </Link>
            <Link
              href="/contact"
              className={buttonVariants({
                className: "text-sm font-semibold text-gray-900",
                variant: "ghost",
                size: "lg",
              })}
            >
              Contact support <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;
