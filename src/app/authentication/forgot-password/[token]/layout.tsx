import React from "react";
import Link from "next/link";

import { verifyForgotPasswordToken } from "@/lib/auth/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Set new password",
  description: "User can reset his/her password",
};

const ForgotPasswordTokenPage = async ({
  children,
  params: { token },
}: {
  children: React.ReactNode;
  params: { token: string };
}) => {
  const isValid = await verifyForgotPasswordToken(token);

  if (isValid === "done") {
    return <>{children}</>;
  } else {
    return (
      <div className="my-5 flex justify-center">
        <Card className="m-3 w-[400px]">
          <CardHeader>
            <CardTitle>Time Expired</CardTitle>
            <CardDescription>
              Your are too late, the line is expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex w-full flex-col justify-center gap-2">
              <p className="text-center text-sm text-pink-500">
                The link is expired, please try again.
              </p>
              <Link
                className="border-1 rounded border border-gray-500 py-2 text-center text-sm font-semibold hover:underline"
                href="/authentication/forgot-password"
              >
                Try again
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
};

export default ForgotPasswordTokenPage;
