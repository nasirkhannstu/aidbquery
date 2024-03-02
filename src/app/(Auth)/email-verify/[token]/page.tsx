"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { LuTerminal } from "react-icons/lu";
import { FaAngleRight } from "react-icons/fa6";
import { RxReload } from "react-icons/rx";

import { trpc } from "@/app/_trpc/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import FixMaxWidth from "@/components/FixMaxWidth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { app_name_client } from "@/lib/utils";

const EmailVerifyPage = ({
  params: { token },
}: {
  params: { token: string };
}) => {
  const session = useSession();
  const [getToken, setGetToken] = useState(token);
  const {
    mutate: emailVerifyAccept,
    isLoading,
    data,
  } = trpc.emailVerifyAccept.useMutation({
    onSuccess: async ({ email, id }) => {
      if (session) {
        if (id === session?.data?.user?.id) {
          await session.update({ isEmailVerify: true, email });
        }
      }
    },
  });

  useEffect(() => {
    setGetToken(token);
  }, [token]);

  return (
    <FixMaxWidth className="my-5 md:min-h-[calc(100vh-56px)]">
      <div className="my-5 flex items-center gap-3">
        <Link href="/files" className="text-zinc-700">
          My Files
        </Link>
        <FaAngleRight className="h-4 w-4 text-zinc-400" />
        <Link
          href={"/profile/" + session?.data?.user?.id}
          className="text-zinc-700"
        >
          Profile
        </Link>
        <FaAngleRight className="h-4 w-4 text-zinc-400" />
        <p className="text-zinc-700 ">Email Address Verification</p>
      </div>

      <Card className="mx-auto my-5 flex max-w-2xl flex-col items-center justify-center gap-5 bg-white px-5 py-7">
        <h2 className="text-center text-4xl font-bold tracking-tight">
          Verify your email Address
        </h2>
        <p className="text-center text-sm text-muted-foreground">
          Please tap the button below to confirm your email address. If you do
          not wish to verify your account with {app_name_client}, you can leave
          the page.
        </p>

        {isLoading ? (
          <Button disabled className="text-sm md:text-base">
            <RxReload className="mr-2 h-4 w-4 animate-spin text-sm font-semibold md:text-base" />
            Please wait
          </Button>
        ) : data?.success ? (
          <Alert className="border-1 border border-green-700 bg-green-50">
            <LuTerminal className="h-4 w-4 text-green-700" />
            <AlertTitle className="text-green-700">Heads up!</AlertTitle>
            <AlertDescription className="text-green-400">
              Your email address has been successfully verified. Please log in
              to continue.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="my-7">
            <Button
              size="lg"
              onClick={() => emailVerifyAccept({ token: getToken })}
              className="text-sm font-semibold md:text-base"
            >
              Verify Now
            </Button>
          </div>
        )}
      </Card>
    </FixMaxWidth>
  );
};

export default EmailVerifyPage;
