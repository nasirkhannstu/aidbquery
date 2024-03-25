"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import moment from "moment";
import { SlEye } from "react-icons/sl";
import { FaRegEdit } from "react-icons/fa";
import { useHover } from "@mantine/hooks";
import ImgCrop from "antd-img-crop";
import {
  Button,
  Divider,
  Input,
  Modal,
  notification,
  Switch,
  Tag,
  Typography,
  Upload,
  type UploadProps,
  type InputRef,
} from "antd";
import {
  AlertOutlined,
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  SaveOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  MdDriveFileRenameOutline,
  MdOutlineAlternateEmail,
} from "react-icons/md";

import { api } from "@/trpc/provider";
import { cn, openNotification } from "@/lib/utils";
import { Button as MyButton } from "@/components/ui/button";
import { useSession } from "next-auth/react";

const { TextArea } = Input;
const { Dragger } = Upload;

const Profile = () => {
  const { hovered, ref } = useHover<HTMLDivElement>();
  const session = useSession();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [notify, notificationHolder] = notification.useNotification();
  const [profileData, setProfileData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    avatar: "",
    createdAt: null as unknown as Date,
    isEmailVerified: false,
  });
  const [editable, setEditable] = useState<boolean>(false);
  const firstNameRef = useRef<InputRef>(null);
  const utils = api.useUtils();
  const {
    data: profile,
    error,
    isError,
    isLoading,
  } = api.users.userProfile.useQuery();
  const { mutate: updateProfile, isLoading: mutateLoading } =
    api.users.updateProfile.useMutation({
      async onSuccess(data) {
        openNotification(
          "success",
          notify,
          "Profile Updated",
          data.message ?? "Profile updated successfully.",
        );
        setEditable(false);
        await utils.users.userProfile.invalidate();
      },
      onError(error) {
        openNotification(
          "error",
          notify,
          "Something went wrong",
          error?.message ?? "An error occurred while updating the profile.",
        );
      },
    });

  const handleCancel = () => setPreviewOpen(false);
  const handleCancelEditModal = () => setEditModalOpen(false);

  const props: UploadProps = {
    name: "file",
    multiple: false,
    action: "/api/avatars",
    async onChange(info) {
      const { status } = info.file;

      if (status === "done") {
        await utils.users.userProfile.invalidate();
        await session.update({ avatar: info.file.response.avatar });
        openNotification(
          "success",
          notify,
          "File Uploaded",
          "File uploaded successfully.",
        );
      } else if (status === "error") {
        openNotification(
          "error",
          notify,
          "File Uploaded",
          "File uploaded failed.",
        );
      }
    },
  };

  useEffect(() => {
    if (editable) {
      firstNameRef.current?.focus();
    }
  }, [editable]);

  useEffect(() => {
    if (isError) {
      openNotification(
        "error",
        notify,
        "Something went wrong",
        error?.message ?? "An error occurred while fetching the profile data.",
      );
    }
  }, [error?.message, isError, notify]);

  useEffect(() => {
    if (profile) {
      setProfileData({
        id: profile.id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        bio: profile.bio ?? "",
        avatar: profile.avatar,
        createdAt: profile.createdAt,
        email: profile.email,
        isEmailVerified: profile.isEmailVerified,
      });
    }
  }, [profile]);

  return (
    <>
      <Modal
        open={previewOpen}
        title={`${profileData.firstName} ${profileData.lastName} avatar`}
        footer={
          <div>
            <Button danger onClick={handleCancel}>
              Close
            </Button>
          </div>
        }
        onCancel={handleCancel}
      >
        <Image
          alt="example"
          className="w-full"
          src={`/uploads/avatars/${profileData.avatar}`}
          width={300}
          height={300}
          quality={100}
        />
      </Modal>
      <Modal
        open={editModalOpen}
        title="Update Profile Picture"
        footer={
          <div>
            <Button danger onClick={handleCancelEditModal}>
              Close
            </Button>
          </div>
        }
        onCancel={handleCancelEditModal}
      >
        <ImgCrop rotationSlider>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibited from
              uploading company data or other banned files.
            </p>
          </Dragger>
        </ImgCrop>
      </Modal>
      {notificationHolder}
      <div className="flex gap-x-5">
        <div className="w-2/6 rounded border p-5 shadow">
          <div className="relative flex flex-col justify-start gap-y-3">
            <div className="flex justify-center">
              <div className="relative" ref={ref}>
                <div className="rounded-full">
                  <Image
                    src={`/uploads/avatars/${profileData.avatar}`}
                    alt={profileData.firstName}
                    width={200}
                    height={200}
                    className="cursor-pointer rounded-full"
                  />
                </div>
                <div
                  className={cn(
                    "absolute left-0 top-0 h-full w-full items-center justify-center rounded-full bg-black/30",
                    {
                      hidden: !hovered,
                      flex: hovered,
                    },
                  )}
                >
                  <div className="flex items-center">
                    <MyButton
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewOpen(true)}
                    >
                      <SlEye className="h-5 w-5 text-white" />
                    </MyButton>
                    <MyButton
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditModalOpen(true)}
                    >
                      <FaRegEdit className="h-5 w-5 text-white" />
                    </MyButton>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute right-0 top-0">
              <Tag color="magenta" icon={<AlertOutlined />}>
                Premium
              </Tag>
            </div>

            <p className="mx-auto max-w-56 text-center text-sm text-slate-400">
              Allowed *.jpeg, *.jpg, *.png, *.gif max size of 1Mb
            </p>

            <p className="max-w-62 mx-auto text-center font-light text-slate-700">
              Joined at {moment(profileData.createdAt).format("LLLL")}
            </p>

            <div className="my-2 flex items-center justify-between">
              <div>
                <p className="font-semibold">Email Verification</p>

                <p className="text-sm text-rose-300">
                  Email Verification is required to access all features.
                </p>
              </div>
              <Switch
                title={
                  profileData.isEmailVerified ? "Verified" : "Not Verified"
                }
                disabled
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                defaultChecked={profileData.isEmailVerified}
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
                      value={profileData.firstName}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      prefix={
                        <MdDriveFileRenameOutline className="text-slate-400" />
                      }
                    />
                  ) : (
                    <p className="rounded border px-5 py-2 text-secondary-foreground">
                      {profileData.firstName}
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
                      value={profileData.lastName}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      prefix={
                        <MdDriveFileRenameOutline className="text-slate-400" />
                      }
                    />
                  ) : (
                    <p className="rounded border px-5 py-2">
                      {profileData.lastName}
                    </p>
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
                  <p className="text-secondary-foreground">
                    {profileData.email}
                  </p>
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
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      rows={5}
                      placeholder="Write something about yourself..."
                      prefix={'<MailOutlined className="text-slate-400" />'}
                    />
                  ) : (
                    <div className="h-36 rounded border px-5 py-2">
                      {profileData.bio}
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
                  onClick={() =>
                    updateProfile({
                      bio: profileData.bio,
                      firstName: profileData.firstName,
                      lastName: profileData.lastName,
                    })
                  }
                  type="primary"
                  size="large"
                  loading={mutateLoading || isLoading}
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
