"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LuArrowRight } from "react-icons/lu";
import { GiHamburgerMenu } from "react-icons/gi";
import { LiaAngleRightSolid } from "react-icons/lia";
import { motion } from "framer-motion";

import { Button, buttonVariants } from "@/components/ui/button";
import { LoginUser } from "@/types/nextauth";

interface UserAccountNavProps {
  isAuth: boolean;
  user?: LoginUser;
}

const MobileNavbarResponsive = ({ isAuth, user }: UserAccountNavProps) => {
  const [isOpen, setOpen] = useState<boolean>(true);
  const toggleOpen = () => setOpen((prev) => !prev);
  const pathname = usePathname();

  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      toggleOpen();
    }
  };

  const variants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "-100%" },
  };

  useEffect(() => {
    if (isOpen) toggleOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div className="sm:hidden">
      <Button
        onClick={toggleOpen}
        variant="ghost"
        size="icon"
        aria-label="Mobile Menu"
      >
        <GiHamburgerMenu className="relative z-50 h-5 w-5 text-zinc-700" />
      </Button>

      <motion.div
        animate={isOpen ? "open" : "closed"}
        variants={variants}
        className="fixed inset-0 z-0 w-full"
      >
        <ul className="absolute grid w-full gap-3 border-b border-zinc-200 bg-white px-10 pb-8 pt-20 shadow-xl">
          {!isAuth ? (
            <>
              <li>
                <Link
                  onClick={() => closeOnCurrent("/authentication/register")}
                  className="flex w-full items-center font-semibold text-primary"
                  href="/authentication/register"
                >
                  Get started
                  <LuArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </li>
              <li className="my-1 h-px w-full bg-gray-300" />
              <li>
                <Link
                  onClick={() => closeOnCurrent("/authentication/login")}
                  className="flex w-full items-center font-semibold"
                  href="/authentication/login"
                >
                  Sign in
                </Link>
              </li>

              {process.env.NEXT_PUBLIC_USING_MODE === "SaaS" ? (
                <>
                  <li className="my-1 h-px w-full bg-gray-300" />
                  <li>
                    <Link
                      onClick={() => closeOnCurrent("/pricing")}
                      className="flex w-full items-center font-semibold"
                      href="/pricing"
                    >
                      Pricing
                    </Link>
                  </li>
                </>
              ) : null}
            </>
          ) : (
            <>
              <li>
                <div className="flex w-3/4 items-center gap-x-4 rounded-sm px-2 py-1 hover:bg-zinc-100">
                  <Image
                    src={`/uploads/avatars/${user?.avatar}`}
                    alt="AIPDFQuery"
                    width={50}
                    height={50}
                    className="rounded-full border border-zinc-200 bg-white p-0.5"
                    placeholder="blur"
                    blurDataURL={`/uploads/avatars/${user?.avatar}`}
                  />
                  <div className="flex w-full items-center justify-between">
                    <div className="grid items-start justify-start gap-y-1">
                      <h3 className="font-semibold leading-tight">
                        {user?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                    <LiaAngleRightSolid className="h-5 w-5 text-zinc-500" />
                  </div>
                </div>
              </li>
              <li>
                <Link
                  onClick={() => closeOnCurrent("/files")}
                  className="flex w-full items-center text-sm font-semibold text-muted-foreground hover:text-black"
                  href="/files"
                >
                  My Files
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => closeOnCurrent(`/profile/${user?.id}`)}
                  className="flex w-full items-center text-sm font-semibold text-muted-foreground hover:text-black"
                  href={`/profile/${user?.id}`}
                >
                  Profile
                </Link>
              </li>
              {user?.role === "ADMIN" ? (
                <li>
                  <Link
                    onClick={() =>
                      closeOnCurrent(
                        "/admin/users" || "/admin/files" || "/admin/settings",
                      )
                    }
                    className="flex w-full items-center text-sm font-semibold text-muted-foreground hover:text-black"
                    href={"/admin/users"}
                  >
                    Dashboard
                  </Link>
                </li>
              ) : null}
              <li>
                <Link
                  onClick={() => closeOnCurrent("/change-password")}
                  className="flex w-full items-center text-sm font-semibold text-muted-foreground hover:text-black"
                  href="/change-password"
                >
                  Change Password
                </Link>
              </li>
              <li className="my-1 h-px w-full bg-gray-300" />
              <li>
                <Button
                  onClick={() =>
                    signOut({ callbackUrl: "/authentication/login", redirect: true })
                  }
                  className={buttonVariants({
                    variant: "destructive",
                    size: "sm",
                  })}
                >
                  Logout
                </Button>
              </li>
            </>
          )}
        </ul>
      </motion.div>
    </div>
  );
};

export default MobileNavbarResponsive;
