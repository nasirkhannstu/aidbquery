"use client";
import { notification } from "antd";

const Notify = () => {
  const [api, notificationHeader] = notification.useNotification();

  return <>{notificationHeader}</>;
};

export default Notify;
