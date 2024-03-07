"use client";
import React from "react";
import { Button, Form, FormProps, Input, message } from "antd";
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
      console.log("res: ", res);
      signIn("credentials", {
        email: values.email,
        password: values.password,
      });
    } else {
      console.log("res: ", res);
      messageHandler.open({
        type: "error",
        content: res?.error as string,
      });
    }
  };

  return (
    <>
      {messageHolder}
      <div className="container flex justify-center">
        <div className="max-w-xl w-full pt-6 px-10 mt-28 bg-white rounded border">
          <div className="my-3">
            <p className="text-slate-600">LOGIN</p>
            <h4 className="md:text-3xl text-lg font-bold">Welcome back</h4>
            <p className="text-slate-400 font-light">
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

            <div className="flex justify-between items-center flex-col md:flex-row">
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
