import React from "react";
import Link from "next/link";
import { FaFacebookF } from "react-icons/fa6";
import { MdOutlineMail } from "react-icons/md";
import { FaTwitter } from "react-icons/fa6";

import Logo from "./Home/Logo";
import MaxWidthWrapper from "./FixMaxWidth";
import { buttonVariants } from "./ui/button";
import { app_name } from "@/lib/utils";

const Footer = () => {
  return (
    <footer className="mt-5 md:mt-0">
      <hr className="my-1" />
      <MaxWidthWrapper>
        <div className="my-4 flex items-center justify-between md:my-10">
          <Logo />
          <ul className="flex items-center gap-x-1">
            <li>
              <Link
                aria-label="Facebook Link"
                href={process.env.FB_URL as string}
                target="_blank"
                className={buttonVariants({
                  variant: "link",
                  size: "icon",
                  className:
                    "transition-150 text-zinc-500 transition-all ease-in-out hover:bg-blue-600 hover:text-white",
                })}
              >
                <FaFacebookF className="h-5 w-5" />
              </Link>
            </li>
            <li>
              <Link
                aria-label="Twitter Link"
                target="_blank"
                href={process.env.TWITTER_URL as string}
                className={buttonVariants({
                  variant: "link",
                  size: "icon",
                  className:
                    "transition-150 text-zinc-500 transition-all ease-in-out hover:bg-black hover:text-white",
                })}
              >
                <FaTwitter className="h-5 w-5" />
              </Link>
            </li>

            <li>
              <Link
                aria-label="Email Link"
                href={`mailto:${process.env.SUPPORT_EMAIL}`}
                className={buttonVariants({
                  variant: "link",
                  size: "icon",
                  className:
                    "transition-150 text-zinc-500 transition-all ease-in-out hover:bg-zinc-600 hover:text-white",
                })}
              >
                <MdOutlineMail className="h-5 w-5" />
              </Link>
            </li>
          </ul>
        </div>
        <div className="my-4 grid justify-center gap-y-1">
          <p className="text-center font-medium text-muted-foreground">
            &copy;{app_name} {new Date().getFullYear()} . All rights reserved.
          </p>
          <p className="text-center text-sm text-muted-foreground">
            We, or our approved service providers, may use cookies while you
            browse or use our websites, services, or tools. By storing
            information, these cookies make sure that your experience is better,
            faster, safer, and tailored to your preferences. They also
            contribute to our marketing initiatives.
          </p>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
};

export default Footer;
