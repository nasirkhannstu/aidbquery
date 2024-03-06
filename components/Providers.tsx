import { PropsWithChildren } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";

const Providers = ({ children }: PropsWithChildren) => {
  return <AntdRegistry>{children}</AntdRegistry>;
};

export default Providers;
