"use client";
import { useState } from "react";
import { Button, Input, Tag, Typography } from "antd";
import Image from "next/image";
import moment from "moment";
import { MdDriveFileRenameOutline } from "react-icons/md";

import { type User } from "@/db/schema";
import { AlertOutlined } from "@ant-design/icons";

const { TextArea } = Input;

interface ProfileProps {
  user: User;
}

const Profile = ({ user }: ProfileProps) => {
  const [editable, setEditable] = useState<boolean>(false);

  return (
    <>
      <div className="flex gap-x-5">
        <div className="w-2/6 rounded border p-5 shadow">
          <div className="relative flex flex-col justify-center gap-y-3">
            <Image
              src={`/uploads/avatars/${user.avatar}`}
              alt={user.firstName}
              width={200}
              height={200}
              className="mx-auto rounded-full"
            />
            <div className="absolute right-0 top-0">
              <Tag color="magenta" icon={<AlertOutlined />}>
                Premium
              </Tag>
            </div>

            <p className="mx-auto max-w-56 text-center text-sm text-slate-400">
              Allowed *.jpeg, *.jpg, *.png, *.gif max size of 3 Mb
            </p>

            <p className="max-w-62 mx-auto text-center font-light text-slate-700">
              Joined at {moment(user.createdAt).format("LLLL")}
            </p>

            <p className="text-center">
              Your email is <Tag color="green">Verified</Tag>
            </p>

            <p className="text-center">
              Your are correctly using{" "}
              <Typography.Text strong>Premium</Typography.Text> plan.
            </p>

            <div className="mx-auto mt-5">
              <Button danger size="large">
                Delete Account
              </Button>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div>
            <div className="flex flex-col items-center gap-x-3  md:flex-row">
              <div className="w-full md:w-1/2">
                <div>
                  <Typography.Title level={5}>First Name</Typography.Title>
                  {editable ? (
                    <Input
                      size="large"
                      defaultValue={user.firstName}
                      prefix={<MdDriveFileRenameOutline />}
                    />
                  ) : (
                    <p className="rounded border px-5 py-2">{user.firstName}</p>
                  )}
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <div>
                  <Typography.Title level={5}>Last Name</Typography.Title>
                  {editable ? (
                    <Input
                      size="large"
                      defaultValue={user.lastName}
                      prefix={<MdDriveFileRenameOutline />}
                    />
                  ) : (
                    <p className="rounded border px-5 py-2">{user.lastName}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="my-5 w-full">
              <div>
                <Typography.Title level={5}>Email Address</Typography.Title>
                <p className="cursor-not-allowed rounded border px-5 py-2 text-slate-500">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="my-5 w-full">
              <div className="w-full">
                <div>
                  <Typography.Title level={5}>Bio</Typography.Title>
                  {editable ? (
                    <TextArea size="large" value={user.bio ?? ""} rows={6} />
                  ) : (
                    <p className="rounded border px-5 py-2">{user.firstName}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <Button onClick={() => setEditable(false)} danger>
                Cancel
              </Button>
              <Button onClick={() => setEditable(true)} type="primary">
                Edit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
