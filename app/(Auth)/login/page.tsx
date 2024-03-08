"use client";
import React from "react";
import { Button, Form, type FormProps, Input, message } from "antd";
import Link from "next/link";
import { signIn } from "next-auth/react";

type FieldType = {
  email?: string;
  password?: string;
};

const App: React.FC = () => {
  const [form] = Form.useForm();
  const [messageHandler, messageHolder] = message.useMessage();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (res?.ok) {
      void signIn("credentials", {
        email: values.email,
        password: values.password,
      });
    } else {
      await messageHandler.open({
        type: "error",
        content: res?.error,
      });
    }
  };

  return (
    <>
      {messageHolder}
      <div className="container flex justify-center">
        <div className="mt-28 w-full max-w-xl rounded border bg-white px-10 pt-6">
          <div className="my-3">
            <p className="text-slate-600">LOGIN</p>
            <h4 className="text-lg font-bold md:text-3xl">Welcome back</h4>
            <p className="font-light text-slate-400">
              Access your account by logging in.
            </p>
          </div>
          <Form layout="vertical" form={form} size="large" onFinish={onFinish}>
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please enter your email address!",
                },
                {
                  type: "email",
                  message: "Please enter a valid email address!",
                },
              ]}
            >
              <Input placeholder="Enter your email address" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please enter your password!",
                },
                {
                  min: 6,
                  message: "Password must be at least 6 characters long!",
                },
              ]}
            >
              <Input placeholder="Enter your password" type="password" />
            </Form.Item>

            <div className="flex flex-col items-center justify-between md:flex-row">
              <div className="flex items-start gap-x-px">
                <p>Don&apos;t you have an account yet? </p>
                <Link href="/login">Crate one</Link>
              </div>
              <Form.Item className="mt-5 md:mt-0">
                <Button type="primary" htmlType="submit">
                  Login
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default App;
