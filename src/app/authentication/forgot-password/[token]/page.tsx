"use client";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { useToast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function NewPasswordSetPage({
  params: { token },
}: {
  params: { token: string };
}) {
  const [isRender, setIsRender] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    const response = await fetch("/api/auth/forgot-password/" + token, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    setIsLoading(false);

    if (!response.ok) {
      form.setError("password", { message: result.message });
      form.setError("confirmPassword", { message: result.message });
    } else if (result.success) {
      toast.toast({
        title: "Password Reset",
        variant: "success",
        description: "Your password has been reset successfully.",
      });
      router.push("/authentication/login");
    }
  }

  useEffect(() => {
    setIsRender(true);
  }, []);

  if (!isRender) return null;

  return (
    <Card className="m-3 w-full md:w-[578px]">
      <CardHeader>
        <p className="text-base font-semibold text-muted-foreground">
          SET NEW PASSWORD
        </p>
        <CardTitle className="text-4xl">Reset Password</CardTitle>
        <CardDescription className="text-base">
          Set a new password different from the previous one.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    color="black"
                    required
                    className="text-base font-semibold"
                  >
                    Enter a new password
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Password"
                      type="password"
                      {...field}
                      className="h-14 text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    color="black"
                    required
                    className="text-base font-semibold"
                  >
                    Confirm your password
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Password confirmation"
                      type="password"
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
                  variant="default"
                  size="lg"
                  className="text-sm md:text-base"
                >
                  Save
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
