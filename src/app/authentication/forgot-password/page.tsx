"use client";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { IoMdCheckboxOutline } from "react-icons/io";
import Link from "next/link";
import { RxReload } from "react-icons/rx";
import { useRouter } from "next/navigation";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { trpc } from "@/app/_trpc/client";

const FormSchema = z.object({
  email: z.string().email({ message: "Email must be a valid email" }),
});

export default function ForgetPasswordPage() {
  const [isRender, setIsRender] = useState(false);
  const [emailSend, setEmailSend] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });
  const { mutate: forgotPassword, isLoading } = trpc.forgotPassword.useMutation(
    {
      onSuccess: () => {
        setEmailSend(true);
      },
      onError({ message, data }) {
        if (data?.zodError && data.zodError.fieldErrors.email?.length) {
          return form.setError("email", {
            message: data.zodError.fieldErrors.email[0],
          });
        }

        return form.setError("email", { message });
      },
    },
  );

  useEffect(() => {
    setIsRender(true);
  }, []);

  if (!isRender) return null;

  return (
    <Card className="m-3 w-full md:w-[578px]">
      <CardHeader>
        <p className="text-base font-semibold text-muted-foreground">
          RESET PASSWORD
        </p>
        <CardTitle className="text-4xl">Forgot your password?</CardTitle>
        <CardDescription className="text-base">
          Please provide your email address below, and we&apos;ll help you get
          back on track.{" "}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {emailSend ? (
          <div className="flex w-full flex-col justify-center gap-2">
            <div className="mx-auto flex w-full items-center gap-x-2 rounded-sm border px-4 py-3">
              <IoMdCheckboxOutline className="h-5 w-5 text-green-500/90" />
              <p className="bg-slate-50 text-center text-base text-green-500/70">
                Email send successful, please check your email inbox or spam.
              </p>
            </div>
            <div className="mx-auto my-2">
              <Button
                variant="secondary"
                onClick={() => router.push("/authentication/login")}
                size="lg"
                className="text-sm font-semibold md:text-base"
              >
                Login
              </Button>
            </div>
          </div>
        ) : (
          <>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) => forgotPassword(data))}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        color="black"
                        required
                        className="text-base font-semibold"
                      >
                        Enter your email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Email"
                          type="email"
                          {...field}
                          className="h-14 text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex w-full items-center justify-between">
                  <Link
                    href="/authentication/login"
                    className={buttonVariants({
                      variant: "outline",
                      className: "text-base font-semibold text-primary",
                      size: "lg",
                    })}
                  >
                    Back to login
                  </Link>
                  {isLoading ? (
                    <Button disabled className="text-sm md:text-base">
                      <RxReload className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      size="lg"
                      className="text-base font-semibold"
                    >
                      Send reset link
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </>
        )}
      </CardContent>
    </Card>
  );
}
