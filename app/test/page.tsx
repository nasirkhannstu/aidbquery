"use client";
import React, { useState } from "react";
import {
  DesktopOutlined,
  FileDoneOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { type MenuProps } from "antd";
import { Button, Menu } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    label: "Dashboard",
    key: "1",
    icon: <PieChartOutlined />,
  },
  {
    label: "Users",
    key: "2",
    icon: <DesktopOutlined />,
  },
  {
    label: "Files",
    key: "3",
    icon: <FileDoneOutlined />,
  },
  {
    label: "Settings",
    key: "4",
    icon: <SettingOutlined />,
  },
];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{ marginBottom: 16 }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <div className="max-w-fit shadow">
        <Menu
          contextMenu="Menu"
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          inlineCollapsed={collapsed}
          items={items}
        />
      </div>
    </>
  );
};

export default App;
