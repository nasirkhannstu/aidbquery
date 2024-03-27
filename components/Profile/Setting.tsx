"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
import moment from "moment";
import {
  CheckCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  CloseSquareOutlined,
  DeleteOutlined,
  IssuesCloseOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  type FormProps,
  Input,
  Modal,
  Popconfirm,
  Tag,
  notification,
} from "antd";

import { api } from "@/trpc/provider";
import { openNotification } from "@/lib/utils";

type FieldType = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const Setting = () => {
  const [notify, notificationHolder] = notification.useNotification();
  const utils = api.useUtils();
  const [openEmailVerify, setOpenEmailVerify] = useState(false);
  const { data: profile } = api.users.userProfile.useQuery();
  const { mutate: deactivateAccount } = api.users.deactivateAccount.useMutation(
    {
      onSuccess(data) {
        openNotification("warning", notify, "Account Deactivate", data.message);
        void utils.users.userProfile.invalidate();
      },
      onError(error) {
        openNotification("error", notify, "Account Deactivate", error.message);
      },
    },
  );
  const { mutate: deleteAccount } = api.users.deleteUser.useMutation({
    onSuccess(data) {
      openNotification("error", notify, "Account Deleted", data.message);
      void signOut();
    },
    onError(error) {
      openNotification("error", notify, "Account Deleted", error.message);
    },
  });
  const { mutate: reactivateAccount } = api.users.reactiveAccount.useMutation({
    onSuccess(data) {
      openNotification("success", notify, "Account Reactive", data.message);
      void utils.users.userProfile.invalidate();
    },
    onError(error) {
      openNotification("error", notify, "Account Reactive", error.message);
    },
  });
  const [form] = Form.useForm();
  const { mutate: updatePassword, isLoading: isLoadingMutate } =
    api.users.changePassword.useMutation({
      onSuccess(data) {
        form.resetFields();
        setOpenEmailVerify(false);
        openNotification("success", notify, "Password Changed", data.message);
      },
      onError(error) {
        openNotification("error", notify, "Password Changed", error.message);
      },
    });

  // TODO: handle email verification
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    updatePassword({
      confirmPassword: values.confirmPassword,
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  };

  const handleCancel = () => {
    setOpenEmailVerify(false);
  };

  const confirmReactive = () => {
    reactivateAccount();
  };
  const confirmDeactivate = () => {
    deactivateAccount();
  };
  const confirmDelete = () => {
    deleteAccount();
  };

  return (
    <>
      {notificationHolder}
      <Modal
        title="Change password"
        open={openEmailVerify}
        onCancel={handleCancel}
        footer={false}
        width={700}
      >
        <div>
          <Form layout="vertical" form={form} size="large" onFinish={onFinish}>
            <Form.Item
              label="Current Password"
              name="currentPassword"
              rules={[
                {
                  required: true,
                  message: "Please enter your current password!",
                },
                {
                  min: 6,
                  message: "Password must be at least 6 characters long!",
                },
              ]}
            >
              <Input
                placeholder="Enter your current password"
                type="password"
              />
            </Form.Item>
            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: "Please enter a new password!",
                },
                {
                  min: 6,
                  message: "Password must be at least 6 characters long!",
                },
              ]}
            >
              <Input placeholder="Enter new password" type="password" />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                {
                  min: 6,
                  message: "Password must be at least 6 characters long!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The confirm password that you entered do not match!",
                      ),
                    );
                  },
                }),
              ]}
            >
              <Input placeholder="Confirm your password" type="password" />
            </Form.Item>

            <div className="mt-5 flex flex-col items-center justify-between md:flex-row">
              <div className="flex items-start gap-x-px">
                <Button danger onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
              <Form.Item className="mt-5 md:mt-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoadingMutate}
                >
                  Update
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </Modal>
      <div className="w-full rounded bg-white p-5 shadow">
        <div className="max-w-2xl">
          <h1 className="mb-5 text-3xl font-bold">Setting</h1>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="my-1 text-lg font-semibold">Profile Update</h3>
              <p className="max-w-96 font-light  text-slate-500">
                Your password was last updated.
              </p>
            </div>
            <div className="grid gap-y-1">
              <p>{moment(profile?.updatedAt).format("LLL")}</p>
            </div>
          </div>

          <div className="my-5 flex items-center justify-between">
            <div>
              <h3 className="my-1 text-lg font-semibold">Email Verification</h3>
              <p className="max-w-96 font-light  text-slate-500">
                Email verification is required to access some features. If you
                have not verified your email, please do so.
              </p>
            </div>
            <div className="grid gap-y-1">
              {profile?.isEmailVerified ? (
                <Tag color="green" bordered={false} icon={<CheckOutlined />}>
                  Verified
                </Tag>
              ) : (
                <Tag bordered={false} color="red" icon={<CloseOutlined />}>
                  Not Verified
                </Tag>
              )}
              {profile?.isEmailVerified ? null : (
                <Button href="/verifications/email">Verify</Button>
              )}
            </div>
          </div>

          <div className="my-5 flex items-center justify-between">
            <div>
              <h3 className="my-1 text-lg font-semibold">Change Password</h3>
              <p className="max-w-96 font-light  text-slate-500">
                You can change your password by clicking the button below.
              </p>
            </div>
            <div className="grid gap-y-1">
              <Button
                onClick={() => {
                  setOpenEmailVerify(true);
                }}
              >
                Change Password
              </Button>
            </div>
          </div>

          <div className="my-5 flex items-center justify-between gap-x-3">
            <div>
              <h3 className="my-1 text-lg font-semibold">Account Actions</h3>
              <p className="mb-2 max-w-96  font-light text-slate-500">
                You can deactivate or delete your account by clicking the button
                below.
              </p>
              {profile?.status === "ACTIVE" ? (
                <Tag
                  bordered={false}
                  color="green"
                  icon={<CheckCircleOutlined />}
                >
                  Account activated
                </Tag>
              ) : profile?.status === "DEACTIVATED" ? (
                <Tag
                  bordered={false}
                  color="orange"
                  icon={<IssuesCloseOutlined />}
                >
                  Account deactivated
                </Tag>
              ) : (
                <Tag
                  bordered={false}
                  color="red"
                  icon={<CloseSquareOutlined />}
                >
                  Account banned
                </Tag>
              )}
            </div>
            <div className="flex items-center gap-x-2">
              {profile?.status === "ACTIVE" ? (
                <Popconfirm
                  okType="danger"
                  icon={<WarningOutlined />}
                  title="Deactivate your account."
                  description={
                    <div className="max-w-lg">
                      You won&apos;t have access to all of your account&apos;s
                      features if it is disabled. Do you really want to cancel
                      your account?
                    </div>
                  }
                  onConfirm={confirmDeactivate}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button icon={<WarningOutlined />} danger>
                    Deactivate Account
                  </Button>
                </Popconfirm>
              ) : profile?.status === "DEACTIVATED" ? (
                <Popconfirm
                  okType="primary"
                  icon={<CheckCircleOutlined />}
                  title="Reactive your account."
                  description={
                    <div className="max-w-lg">
                      You will be able to access all the features of your
                      account if you reactivate it. Do you really want to
                      reactivate your account?
                    </div>
                  }
                  onConfirm={confirmReactive}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button icon={<CheckCircleOutlined />} type="default">
                    Reactive Account
                  </Button>
                </Popconfirm>
              ) : null}

              <Popconfirm
                icon={<DeleteOutlined />}
                okType="danger"
                title="Delete your account."
                description={
                  <div className="max-w-lg">
                    If you delete your accounts, you will not be able to recover
                    the data. Are you sure you want to delete your account?
                  </div>
                }
                onConfirm={confirmDelete}
                okText="Yes"
                cancelText="No"
              >
                <Button danger type="primary" icon={<DeleteOutlined />}>
                  Delete Account
                </Button>
              </Popconfirm>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Setting;
