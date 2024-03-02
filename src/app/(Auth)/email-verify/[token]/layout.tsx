import React from "react";
import jwt from "jsonwebtoken";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { db } from "@/db/prisma";
import { toast } from "@/components/ui/use-toast";
import { email_verify_end } from "@/lib/utils";
import { authOptions } from "@/lib/auth/authOption";

export interface JwtPayload extends jwt.JwtPayload {
  id: string;
}

const EmailVerifyLayout = async ({
  children,
  params: { token },
}: {
  children: React.ReactNode;
  params: { token: string };
}) => {
  const session = await getServerSession(authOptions);
  const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload; // 10min
  const user = await db.users.findFirst({
    where: {
      id: decoded.id,
    },
  });

  if (user?.isEmailVerify) {
    toast({
      title: "Email Verify",
      description: "Your email has already been verified.",
      variant: "success",
    });

    return redirect("/authentication/login");
  }

  const ttl = Date.now() - Number(user?.emailVerifyAt ?? user?.createdAt);

  if (ttl > email_verify_end) {
    return (
      <div className="my-5 flex justify-center">
        <Card className="m-3 w-[400px]">
          <CardHeader>
            <CardTitle>Link Expired</CardTitle>
            <CardDescription>
              This link will not work anymore, expired!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex w-full flex-col justify-center gap-2">
              <p className="text-center text-sm text-red-500">
                Your link is expired, please{" "}
                {session ? "go to profile" : "login"} to new link.
              </p>
              {session ? (
                <Link
                  className={buttonVariants({
                    variant: "link",
                    size: "sm",
                  })}
                  href={`/profile/${session?.user?.id}`}
                >
                  Profile
                </Link>
              ) : (
                <Link
                  className={buttonVariants({
                    variant: "link",
                    size: "sm",
                  })}
                  href="/authentication/login"
                >
                  Login
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } else {
    return <>{children}</>;
  }
};

export default EmailVerifyLayout;
