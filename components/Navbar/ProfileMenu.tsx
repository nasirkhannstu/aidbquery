import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  type MenuProps,
  Space,
  Typography,
} from "antd";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { MdOutlinePayment } from "react-icons/md";
import {
  LogoutOutlined,
  MessageOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Image from "next/image";

interface ProfileMenuProps {
  name?: string;
  email?: string;
  avatar?: string;
  id?: string;
}

const ProfileMenu = ({ avatar, email, name, id }: ProfileMenuProps) => {
  const items: MenuProps["items"] = [
    {
      key: "user-profile",
      label: (
        <div className="flex items-center gap-x-3">
          <Avatar
            size="large"
            icon={<UserOutlined />}
            src={
              <Image
                src={`/uploads/avatars/${avatar}`}
                alt={name!}
                width={56}
                height={56}
                className="h-full w-full"
              />
            }
          />
          <div className="grid">
            <Typography.Text strong>{name}</Typography.Text>
            <Typography.Text type="secondary" className="text-sm">
              {email}
            </Typography.Text>
          </div>
        </div>
      ),
      style: { padding: "10px 20px" },
    },
    {
      type: "group",
      key: "Accounts",
      label: "Accounts",
      children: [
        {
          key: "profile",
          label: <Link href={`/users/${id}`}>Profile</Link>,
          icon: <UserOutlined />,
        },
        {
          key: "chats",
          label: <Link href="/chats">Chats</Link>,
          icon: <MessageOutlined />,
        },
        {
          key: "billing",
          label: <Link href="/billing">Billing</Link>,
          icon: <MdOutlinePayment />,
        },
      ],
    },

    {
      type: "divider",
      key: "divider",
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: () => signOut(),
      danger: true,
    },
  ];

  return (
    <Space>
      <Button type="link" href="/chats" onClick={(e) => e.preventDefault()}>
        Chats
      </Button>
      <Dropdown
        menu={{ items }}
        trigger={["click"]}
        overlayStyle={{ maxWidth: 300, padding: 5 }}
      >
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <Badge dot>
              <Avatar
                shape="square"
                icon={<UserOutlined />}
                style={{ cursor: "pointer" }}
                src={
                  <Image
                    src={`/uploads/avatars/${avatar}`}
                    alt={name!}
                    width={56}
                    height={56}
                    className="h-full w-full"
                  />
                }
              />
            </Badge>
          </Space>
        </a>
      </Dropdown>
    </Space>
  );
};

export default ProfileMenu;
