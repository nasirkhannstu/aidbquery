"use client";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  fullName: z.string().min(3, { message: "Name can't be empty." }),
  email: z.string().email({ message: "Your email address must be valid." }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function RegisterPage() {
  const [isRender, setIsRender] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      confirmPassword: "",
    },
  });
  const { mutate: register, isLoading } = trpc.register.useMutation({
    onSuccess() {
      toast.toast({
        title: "Account created",
        description: "Your account has been created successfully.",
        variant: "success",
      });
      router.push("/authentication/login");
    },
    onError({ message, data }) {
      if (
        data?.zodError?.formErrors &&
        data?.zodError?.formErrors?.length > 0
      ) {
        form.setError("confirmPassword", {
          message: data?.zodError.formErrors[0] as string,
        });
        form.setError("password", {
          message: data?.zodError.formErrors[0] as string,
        });

        return;
      }

      if (message === "User already exist") {
        form.setError("email", {
          message,
        });
      }
    },
  });

  useEffect(() => {
    setIsRender(true);
  }, []);

  if (!isRender) return null;

  return (
    <Card className="m-3 w-full md:w-[578px]">
      <CardHeader>
        <p className="text-base font-semibold text-muted-foreground">
          REGISTER
        </p>
        <CardTitle className="text-3xl md:text-4xl">
          Create an account
        </CardTitle>
        <CardDescription className="text-base">
          Fill out the form to get started.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => register(data))}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    color="black"
                    required
                    className="text-xs font-semibold md:text-base"
                  >
                    Enter your full name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Full name"
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
                      placeholder="Your email address"
                      {...field}
                      className="h-10 text-sm md:h-14 md:text-base"
                    />
                  </FormControl>
                  <FormMessage color="red" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    required
                    color="black"
                    className="text-xs font-semibold md:text-base"
                  >
                    Enter your password
                  </FormLabel>
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    required
                    color="black"
                    className="text-xs font-semibold md:text-base"
                  >
                    Password confirmation
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
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
                Already have an account?{" "}
                <Link
                  href="/authentication/login"
                  className="cursor-pointer text-xs font-semibold text-primary transition-all hover:underline md:text-base"
                >
                  Login
                </Link>{" "}
              </span>
              {isLoading ? (
                <Button disabled className="h-10 text-base md:h-11">
                  <RxReload className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="h-10 text-base font-semibold md:h-11"
                >
                  Register
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
