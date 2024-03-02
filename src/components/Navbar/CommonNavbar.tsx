"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LuMoveRight } from "react-icons/lu";
import { useRouter } from "next/navigation";

import FixMaxWidth from "@/components/FixMaxWidth";
import { Button, buttonVariants } from "@/components/ui/button";
import UserAccountNav from "@/components/Navbar/UserAccountNav";
import MobileNavbarResponsive from "@/components/Navbar/MobileNavbarResponsive";
import { app_name_client } from "@/lib/utils";
import { LoginUser } from "@/types/nextauth";

interface CommonNavbarProps {
  user: LoginUser | undefined;
  avatarBase64: string | undefined;
}

const CommonNavbar = ({ user, avatarBase64 }: CommonNavbarProps) => {
  const [isRender, setIsRender] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsRender(true);
  }, []);
  if (!isRender) return null;

  return (
    <nav className="sticky inset-x-0 top-0 z-30 h-14 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <FixMaxWidth className="px-0 md:px-0">
        <div className="flex h-14 items-center justify-between border-b border-zinc-200 px-1.5 xl:px-0">
          <div className="flex items-center gap-1.5">
            <Link href="/" className="z-40 flex font-semibold">
              <span>{app_name_client}</span>
            </Link>
          </div>

          <MobileNavbarResponsive isAuth={!!user} user={user ?? undefined} />

          <div className="hidden items-center space-x-1 md:flex">
            <Link
              href="/#home"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              Home
            </Link>

            {process.env.NEXT_PUBLIC_USING_MODE === "SaaS" && (
              <Link
                href="/#pricing"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                Pricing
              </Link>
            )}
            <Link
              href="/#features"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              Features
            </Link>
            <Link
              href="/#use-case"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              Use cases
            </Link>
          </div>

          <div className="hidden items-center space-x-2 sm:flex">
            {!user ? (
              <>
                <Button
                  onClick={() => router.push("/authentication/login")}
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                    className: "text-primary hover:text-primary/95",
                  })}
                >
                  Sign in
                </Button>
                <Link
                  href="/authentication/register"
                  className={buttonVariants({
                    variant: "default",
                    size: "sm",
                    className: "flex items-center gap-2",
                  })}
                >
                  <span>Get Started</span> <LuMoveRight className="h-4 w-4" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/files"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  My Files
                </Link>

                <UserAccountNav
                  name={user.name}
                  email={user.email}
                  imageBase64={avatarBase64}
                  isEmailVerify={user.isEmailVerify}
                  userId={user.id}
                  isAdmin={user.role === "ADMIN"}
                  createdAt={user.createdAt}
                />
              </>
            )}
          </div>
        </div>
      </FixMaxWidth>
    </nav>
  );
};

export default CommonNavbar;
