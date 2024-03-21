"use client";
import { Button } from "antd";
import {
  ApiTwoTone,
  ArrowRightOutlined,
  DollarTwoTone,
  HighlightTwoTone,
  HomeTwoTone,
  LoginOutlined,
} from "@ant-design/icons";
import { useSession } from "next-auth/react";

import Logo from "@/components/Navbar/Logo";
import { APP_MODE_CLIENT } from "@/lib/utils";
import ProfileMenu from "./ProfileMenu";

const Navbar = () => {
  const session = useSession();
  const user = session.data?.user;

  return (
    <nav className="sticky inset-x-0 top-0 z-30 h-[--navbar-h] w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <div className="container px-2 md:px-8">
        <div className="flex h-14 items-center justify-between border-b border-zinc-200 px-1.5 xl:px-0">
          <div className="flex items-center gap-1.5">
            <Logo />
          </div>

          {/* <MobileNavbarResponsive isAuth={!!user} user={user ?? undefined} /> */}

          <div className="hidden items-center space-x-1 md:flex">
            <Button href="/#home" type="link" icon={<HomeTwoTone />}>
              Home
            </Button>

            <Button href="/#features" type="link" icon={<ApiTwoTone />}>
              Features
            </Button>
            <Button href="/#use-case" type="link" icon={<HighlightTwoTone />}>
              Use cases
            </Button>
            {APP_MODE_CLIENT === "SaaS" && (
              <Button href="/#pricing" type="link" icon={<DollarTwoTone />}>
                Pricing
              </Button>
            )}
          </div>

          <div className="hidden items-center space-x-1 sm:flex">
            {!user ? (
              <>
                <Button href="/login" icon={<LoginOutlined />} size="large">
                  Sign in
                </Button>
                <Button
                  type="primary"
                  icon={<ArrowRightOutlined />}
                  href="/register"
                  size="large"
                >
                  Get Started
                </Button>
              </>
            ) : (
              <>
                <ProfileMenu
                  email={session.data?.user.email}
                  name={`${session.data?.user.firstName} ${session.data?.user.lastName}`}
                  avatar={session.data?.user.avatar}
                  id={session.data?.user.id}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
