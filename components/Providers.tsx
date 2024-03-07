"use client";
import { PropsWithChildren } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { SessionProvider } from "next-auth/react";
import Navbar from "./Navbar/Navbar";

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#13c2c2",
          },
        }}
      >
        <SessionProvider>
          <Navbar />
          {children}
        </SessionProvider>
      </ConfigProvider>
    </AntdRegistry>
  );
};

export default Providers;
