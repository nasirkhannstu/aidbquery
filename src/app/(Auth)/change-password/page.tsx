"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { toast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  currentPassword: z
    .string()
    .min(6, { message: "Current password can't be empty." }),
  newPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmNewPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

function PasswordChangePage() {
  const [isRender, setIsRender] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const watch = form.watch("newPassword", "");
  const validatePasswordConfirmation = (value: string) => {
    if (value === watch) {
      return true;
    } else {
      form.setError("confirmNewPassword", {
        type: "manual",
        message: "The password did not match.",
      });
      return false;
    }
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    validatePasswordConfirmation(data.confirmNewPassword);

    const response = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const resError = await response.json();
      if (resError.path) {
        form.setError(resError.path, { message: resError.message });
      } else {
        form.setError("currentPassword", { message: "Something went wrong!" });
        form.setError("newPassword", { message: "Something went wrong!" });
        form.setError("confirmNewPassword", {
          message: "Something went wrong!",
        });
      }
    } else {
      toast({
        title: "Password changed",
        description: "Password changed successfully.",
        variant: "success",
      });

      router.refresh();
      router.push("/files");
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
          CHANGE PASSWORD
        </p>
        <CardTitle className="text-4xl">Problem with password?</CardTitle>
        <CardDescription className="text-base">
          Fill the form to change password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    color="black"
                    required
                    className="text-base font-semibold"
                  >
                    Enter your current password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Current password"
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
              name="newPassword"
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
                      type="password"
                      placeholder="Password"
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
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    color="black"
                    required
                    className="text-base font-semibold"
                  >
                    Confirm password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
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
                href="/files"
                className={buttonVariants({
                  className:
                    "text-sm text-primary/80 transition-all hover:text-primary md:text-base",
                  variant: "outline",
                  size: "lg",
                })}
              >
                Back to files
              </Link>
              <Button type="submit" size="lg" className="text-sm md:text-base">
                Change Now
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default PasswordChangePage;
