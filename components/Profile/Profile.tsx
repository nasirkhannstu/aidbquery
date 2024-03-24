"use client";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Divider,
  Input,
  Switch,
  Tag,
  Typography,
  type InputRef,
} from "antd";
import Image from "next/image";
import moment from "moment";
import {
  AlertOutlined,
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  MdDriveFileRenameOutline,
  MdOutlineAlternateEmail,
} from "react-icons/md";

import { type User } from "@/db/schema";

const { TextArea } = Input;

interface ProfileProps {
  user: User;
}

const Profile = ({ user }: ProfileProps) => {
  const [editable, setEditable] = useState<boolean>(false);
  const firstNameRef = useRef<InputRef>(null);

  useEffect(() => {
    if (editable) {
      firstNameRef.current?.focus();
    }
  }, [editable]);

  return (
    <>
      <div className="flex gap-x-5">
        <div className="w-2/6 rounded border p-5 shadow">
          <div className="relative flex flex-col justify-start gap-y-3">
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
              Allowed *.jpeg, *.jpg, *.png, *.gif max size of 1Mb
            </p>

            <p className="max-w-62 mx-auto text-center font-light text-slate-700">
              Joined at {moment(user.createdAt).format("LLLL")}
            </p>

            <div className="my-2 flex items-center justify-between">
              <div>
                <p className="font-semibold">Email Verification</p>
                {/* <p className="text-sm text-slate-400">
                Email Verification is not completed
              </p> */}
                <p className="text-sm text-slate-400">
                  Email Verification is required to access all features.
                </p>
              </div>
              <Switch
                disabled
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                defaultChecked
              />
            </div>

            <p className="mb-5">
              Your are correctly using{" "}
              <Typography.Text strong>Premium</Typography.Text> plan. Next
              payment will be on{" "}
              <Typography.Text strong>12/12/2022</Typography.Text>
            </p>
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
                      ref={firstNameRef}
                      size="large"
                      defaultValue={user.firstName}
                      prefix={
                        <MdDriveFileRenameOutline className="text-slate-400" />
                      }
                    />
                  ) : (
                    <p className="text-secondary-foreground rounded border px-5 py-2">
                      {user.firstName}
                    </p>
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
                      prefix={
                        <MdDriveFileRenameOutline className="text-slate-400" />
                      }
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
                <div className="flex cursor-not-allowed items-center gap-x-2 rounded border px-3 py-2">
                  {editable && (
                    <MdOutlineAlternateEmail className="text-slate-400" />
                  )}
                  <p className="text-secondary-foreground">{user.email}</p>
                </div>
              </div>
            </div>
            <div className="my-5 w-full">
              <div className="w-full">
                <div>
                  <Typography.Title level={5}>Bio</Typography.Title>
                  {editable ? (
                    <TextArea
                      size="large"
                      value={user.bio ?? ""}
                      rows={5}
                      placeholder="Write something about yourself..."
                      prefix={'<MailOutlined className="text-slate-400" />'}
                    />
                  ) : (
                    <div className="h-36 rounded border px-5 py-2">
                      {user.bio}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Divider />

            <div className="flex flex-row items-center gap-x-5 md:justify-end">
              {editable && (
                <Button
                  onClick={() => setEditable(false)}
                  danger
                  size="large"
                  icon={<CloseOutlined />}
                >
                  Cancel
                </Button>
              )}
              {editable ? (
                <Button
                  icon={<SaveOutlined />}
                  onClick={() => setEditable(true)}
                  type="primary"
                  size="large"
                >
                  Update
                </Button>
              ) : (
                <Button
                  onClick={() => setEditable(true)}
                  type="primary"
                  size="large"
                  icon={<EditOutlined />}
                >
                  Edit
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
