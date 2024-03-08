"use client";
import { type PropsWithChildren } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { SessionProvider } from "next-auth/react";

import Navbar from "./Navbar/Navbar";
import { primary_color } from "@/lib/theme";
import { TRPCReactProvider } from "@/trpc/provider";

const Providers = ({ children }: PropsWithChildren) => {
  return (
    // <TRPCReactProvider>
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
    // </TRPCReactProvider>
  );
};

export default Providers;
