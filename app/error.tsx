"use client";
import React from "react";
import { Button, Result } from "antd";

const ServerError: React.FC = () => (
  <Result
    style={{ marginTop: "10%" }}
    status="500"
    title="500"
    subTitle="Sorry, something went wrong."
    extra={<Button type="primary">Back Home</Button>}
  />
);

export default ServerError;
