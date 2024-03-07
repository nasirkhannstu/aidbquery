"use client";
import { PropsWithChildren } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { SessionProvider } from "next-auth/react";

import Navbar from "./Navbar/Navbar";
import { primary_color } from "@/lib/theme";

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: primary_color,
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
