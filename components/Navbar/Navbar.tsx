"use client";
import { Button } from "antd";
import {
  ApiTwoTone,
  ArrowRightOutlined,
  DollarTwoTone,
  HighlightTwoTone,
  HomeTwoTone,
} from "@ant-design/icons";

import Logo from "@/components/Navbar/Logo";
import { APP_MODE_CLIENT } from "@/lib/utils";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const session = useSession();
  const user = session.data?.user;

  return (
    <nav className="sticky inset-x-0 top-0 z-30 h-14 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <div className="container">
        <div className="flex h-14 items-center justify-between border-b border-zinc-200 px-1.5 xl:px-0">
          <div className="flex items-center gap-1.5">
            <Logo />
          </div>

          {/* <MobileNavbarResponsive isAuth={!!user} user={user ?? undefined} /> */}

          <div className="hidden items-center space-x-1 md:flex">
            <Button href="/#home" type="text" icon={<HomeTwoTone />}>
              Home
            </Button>

            <Button href="/#features" type="text" icon={<ApiTwoTone />}>
              Features
            </Button>
            <Button href="/#use-case" type="text" icon={<HighlightTwoTone />}>
              Use cases
            </Button>
            {APP_MODE_CLIENT === "SaaS" && (
              <Button href="/#pricing" type="text" icon={<DollarTwoTone />}>
                Pricing
              </Button>
            )}
          </div>

          <div className="hidden items-center space-x-2 sm:flex">
            {!user ? (
              <>
                <Button href="/login">Sign in</Button>
                <Button
                  type="primary"
                  icon={<ArrowRightOutlined />}
                  href="/register"
                >
                  <span>Get Started</span>
                </Button>
              </>
            ) : (
              <>
                <Button href="/files" type="text">
                  Chats
                </Button>

                {/* <UserAccountNav
                  name={user.name}
                  email={user.email}
                  imageBase64={avatarBase64}
                  isEmailVerify={user.isEmailVerify}
                  userId={user.id}
                  isAdmin={user.role === "ADMIN"}
                  createdAt={user.createdAt}
                /> */}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
