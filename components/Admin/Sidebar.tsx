"use client";
import React from "react";
import {
  DashboardOutlined,
  FileDoneOutlined,
  SettingOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Menu } from "antd";
import { useRouter } from "next/navigation";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuProps["items"] = [
  {
    key: "1",
    icon: <DashboardOutlined />,
    label: "Dashboard",
  },
  {
    key: "2",
    icon: <UsergroupAddOutlined />,
    label: "Users",
  },
  {
    key: "3",
    icon: <FileDoneOutlined />,
    label: "Files",
  },
  {
    key: "4",
    icon: <SettingOutlined />,
    label: "Settings",
  },
];

export const DashboardSideBar: React.FC = () => {
  const router = useRouter();

  const onClick: MenuProps["onClick"] = (event) => {
    const path =
      event.key === "1"
        ? "/dashboard/analytics"
        : event.key === "2"
          ? "/dashboard/users"
          : event.key === "3"
            ? "/dashboard/files"
            : "/dashboard/settings";

    router.push(path);
  };

  return (
    <div className="hidden h-[calc(100vh-var(--navbar-h))] border-r lg:block">
      <div className="flex justify-between p-5">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button type="default" danger>
          Close
        </Button>
      </div>
      <Menu
        onSelect={(e) => console.log(e)}
        onClick={onClick}
        style={{ width: 300, height: "100%" }}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        items={items}
      />
    </div>
  );
};
