"use client";
import React from "react";
import { Button, Result } from "antd";
import { useRouter } from "next/navigation";

const ServerError: React.FC = () => {
  const router = useRouter();

  return (
    <Result
      style={{ marginTop: "10%" }}
      status="500"
      title="500"
      subTitle="Sorry, something went wrong."
      extra={
        <Button type="primary" onClick={() => router.push("/")}>
          Back Home
        </Button>
      }
    />
  );
};

export default ServerError;
