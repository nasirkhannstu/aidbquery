"use client";
import React from "react";
import { LuTerminal } from "react-icons/lu";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaAngleRight } from "react-icons/fa6";

import FixMaxWidth from "@/components/FixMaxWidth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/app/_trpc/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { app_name_client } from "@/lib/utils";
import { RxReload } from "react-icons/rx";

const EmailVerification = () => {
  const session = useSession();
  const {
    mutate: verify,
    isLoading,
    data: emailVerify,
  } = trpc.emailVerify.useMutation();

  return (
    <FixMaxWidth className="my-5 md:min-h-[calc(100vh-56px)]">
      <div className="my-5 flex items-center gap-3">
        <Link href="/files" className="text-zinc-700">
          My Files
        </Link>
        <FaAngleRight className="h-4 w-4 text-zinc-400" />
        <Link
          href={"/files/" + session?.data?.user?.id}
          className="text-zinc-700"
        >
          Profile
        </Link>
        <FaAngleRight className="h-4 w-4 text-zinc-400" />
        <p className="text-zinc-700 ">Email Address Verification</p>
      </div>

      <Card className="mx-auto my-5 flex max-w-2xl flex-col items-center justify-center gap-5 bg-white px-5 py-7">
        <h2 className="text-center text-4xl font-bold tracking-tight">
          Please verify your email address.
        </h2>
        <p className="text-center text-muted-foreground">
          Please tap the button below to get a verification email. You can leave
          the page if you don&apos;t want to verify your email.
        </p>

        {isLoading ? (
          <Button disabled className="text-base font-semibold">
            <RxReload className="mr-2 h-4 w-4 animate-spin " />
            Please wait
          </Button>
        ) : emailVerify?.success ? (
          <Alert className="border-1 border border-green-700 bg-green-50">
            <LuTerminal className="h-4 w-4 text-green-700" />
            <AlertTitle className="text-green-700">Heads up!</AlertTitle>
            <AlertDescription className="text-green-400">
              Email has been successfully sent to your email address. Please
              check your email inbox or spam folder.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="my-7">
            <Button
              size="lg"
              onClick={() => verify()}
              className="text-base font-semibold"
            >
              Send Email
            </Button>
          </div>
        )}
        <p className="text-center text-sm text-muted-foreground">
          By clicking the button above, you agree to our Terms of Service and to
          receive emails from {app_name_client}.
        </p>
      </Card>
    </FixMaxWidth>
  );
};

export default EmailVerification;
