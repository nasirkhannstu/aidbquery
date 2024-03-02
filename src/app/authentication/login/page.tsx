"use client";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RxReload } from "react-icons/rx";

import { Button } from "@/components/ui/button";
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
import { LOGIN_ERRORS } from "@/lib/auth/utils";

const FormSchema = z.object({
  email: z.string().email({ message: "Your email must be an email" }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function LoginPage() {
  const [isRender, setIsRender] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    const response = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    setIsLoading(false);

    if (response?.error && !response.ok) {
      if (
        response.error === LOGIN_ERRORS.wrongCredentials ||
        response.error === LOGIN_ERRORS.inactive
      ) {
        form.setError("email", { message: response.error });
        form.setError("password", { message: response.error });
      } else {
        form.setError("email", { message: "Something went wrong!" });
        form.setError("password", { message: "Something went wrong!" });
      }
    } else {
      router.refresh();
    }
  }

  useEffect(() => {
    setIsRender(true);
  }, []);

  if (!isRender) return null;

  return (
    <Card className="m-3 w-full md:w-[578px]">
      <CardHeader>
        <p className="text-base font-semibold text-muted-foreground">LOG IN</p>
        <CardTitle className="text-3xl md:text-4xl">Welcome back</CardTitle>
        <CardDescription className="text-base">
          Login to manage your account.{" "}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    color="black"
                    required
                    className="text-xs font-semibold md:text-base"
                  >
                    Enter your email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email"
                      {...field}
                      className="h-10 text-sm md:h-14 md:text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex w-full items-center justify-between">
                    <FormLabel
                      color="black"
                      required
                      className="text-sm font-semibold md:text-base "
                    >
                      Enter your password
                    </FormLabel>
                    <Link
                      href="/authentication/forgot-password"
                      className="text-xs text-primary transition-all hover:underline md:text-base"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                      className="h-10 text-sm md:h-14 md:text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full items-center justify-between">
              <span className="inline-flex gap-1 text-xs font-semibold md:text-base">
                Don&apos;t have an account yet?
                <Link
                  href="/authentication/register"
                  className="cursor-pointer text-xs text-primary transition-all hover:underline md:text-base"
                >
                  Create one
                </Link>{" "}
              </span>
              {isLoading ? (
                <Button disabled className="h-10 md:h-11">
                  <RxReload className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="lg"
                  className="h-10 text-base font-semibold md:h-11"
                >
                  Login
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
