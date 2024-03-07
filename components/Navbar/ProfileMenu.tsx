import { UserOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Space } from "antd";
import React from "react";

const ProfileMenu = () => {
  return (
    <Space size={5}>
      <Button type="link" href="/chats">
        Chats
      </Button>
      <Badge dot>
        <Avatar
          shape="square"
          icon={<UserOutlined />}
          style={{ cursor: "pointer" }}
        />
      </Badge>
    </Space>
  );
};

export default ProfileMenu;
