"use client";
import React from "react";
import { Button, Result } from "antd";
import { useRouter } from "next/navigation";

import { errorAlerts } from "@/lib/alerts/alerts";

const NotFound: React.FC = () => {
  const router = useRouter();

  return (
    <Result
      status="404"
      title="404"
      style={{ marginTop: "10%" }}
      subTitle={errorAlerts.pageNotFound.message}
      extra={
        <Button type="primary" onClick={() => router.push("/")}>
          Back Home
        </Button>
      }
    />
  );
};
export default NotFound;
