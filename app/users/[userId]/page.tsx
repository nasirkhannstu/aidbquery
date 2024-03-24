import { Breadcrumb, Tabs } from "antd";
import { notFound } from "next/navigation";
import {
  HomeOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { db } from "@/db";
import Setting from "@/components/Profile/Setting";
import Billing from "@/components/Profile/Billing";
import Profile from "@/components/Profile/Profile";

interface ProfilePageProps {
  params: { userId: string };
}

const ProfilePage = async ({ params: { userId } }: ProfilePageProps) => {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  });

  if (!user) return notFound();

  return (
    <div className="container">
      <div className="my-10">
        <div className="mb-5">
          <Breadcrumb
            items={[
              {
                href: "/",
                title: <HomeOutlined />,
              },
              {
                title: (
                  <>
                    <UserOutlined />
                    <span>Profile</span>
                  </>
                ),
              },
              {
                title: `${user.firstName} ${user.lastName}`,
              },
            ]}
          />
        </div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-gray-600">This is your profile</p>
        <div className="my-5 w-full">
          <Tabs
            tabPosition="top"
            defaultActiveKey="1"
            type="card"
            size="large"
            animated
            items={[
              {
                key: "1",
                label: "Profile",
                icon: <UserOutlined />,
                children: <Profile />,
              },
              {
                key: "2",
                label: "Billing",
                icon: <ShoppingCartOutlined />,
                children: <Billing />,
              },
              {
                key: "3",
                label: "Settings",
                icon: <SettingOutlined />,
                children: <Setting />,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
