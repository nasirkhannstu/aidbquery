"use client";
import React from "react";
import { Button, Form, type FormProps, Input } from "antd";
import Link from "next/link";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const RegisterPage: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Received values of form: ", values);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo,
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="container flex justify-center">
      <div className="mt-28 w-full max-w-xl rounded border bg-white px-10 pt-6">
        <div className="my-3">
          <p className="text-slate-600">REGISTER</p>
          <h4 className="text-lg font-bold md:text-3xl">Create new account</h4>
          <p className="font-light text-slate-400">
            To begin, complete the form.
          </p>
        </div>
        <Form
          layout="vertical"
          form={form}
          size="large"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <div className="flex w-full flex-col items-center gap-x-2 md:flex-row">
            <div className="w-full md:w-1/2">
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[
                  {
                    required: true,
                    message: "Please enter your first name!",
                  },
                ]}
              >
                <Input placeholder="Enter your first name" />
              </Form.Item>
            </div>
            <div className="w-full md:w-1/2">
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[
                  {
                    required: true,
                    message: "Please enter your last name!",
                  },
                ]}
              >
                <Input placeholder="Enter your last name" />
              </Form.Item>
            </div>
          </div>
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
          <Form.Item
            label="Password confirmation"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              {
                min: 6,
                message: "Password must be at least 6 characters long!",
              },
              {
                required: true,
                message: "confirm password is required!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The new password that you entered do not match!",
                    ),
                  );
                },
              }),
            ]}
          >
            <Input placeholder="Confirm your password" />
          </Form.Item>
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="flex items-start gap-x-px">
              <p>Already have an account? </p>
              <Link href="/login">Login</Link>
            </div>
            <Form.Item className="mt-5 md:mt-0">
              <Button type="primary" htmlType="submit">
                Register
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
