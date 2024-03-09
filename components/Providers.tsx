"use client";
import { type PropsWithChildren } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { SessionProvider } from "next-auth/react";

import Navbar from "./Navbar/Navbar";
import { theme } from "@/lib/theme";
import { TRPCReactProvider } from "@/trpc/provider";

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <SessionProvider>
      <TRPCReactProvider>
        <AntdRegistry>
          <ConfigProvider theme={theme}>
            <Navbar />
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </TRPCReactProvider>
    </SessionProvider>
  );
};

export default Providers;
