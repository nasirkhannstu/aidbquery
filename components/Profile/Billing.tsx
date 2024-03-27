"use client";
import { AlertOutlined, CoffeeOutlined } from "@ant-design/icons";
import { Button, Tag, Typography } from "antd";
import moment from "moment";

import { api } from "@/trpc/provider";
import { useRouter } from "next/navigation";

const Billing = () => {
  const { data } = api.subscriptions.userSubscription.useQuery();
  const router = useRouter();

  return (
    <div className="w-full">
      <div className="mx-auto my-10 max-w-2xl border p-5 shadow">
        <p className="font-base font-light text-slate-500">
          Your are currently subscribed to the{" "}
          {data?.subscription?.stripeSubscriptionStatus === "active" ? (
            <Tag color="magenta" icon={<AlertOutlined />} bordered={false}>
              Premium
            </Tag>
          ) : (
            <Tag color="default" icon={<CoffeeOutlined />} bordered={false}>
              Free
            </Tag>
          )}{" "}
          plan.
        </p>

        <div className="my-8 flex items-center justify-end gap-x-2">
          {!data?.subscription && (
            <Button
              size="large"
              danger
              icon={<AlertOutlined />}
              onClick={() => router.push("/pricing")}
            >
              Subscribe New
            </Button>
          )}
          <Button
            size="large"
            onClick={() => (window.location.href = data?.url ?? "")}
          >
            Manage Subscription
          </Button>
        </div>
        <div className="flex items-center justify-between">
          {data?.subscription?.stripeSubscriptionStatus === "active" && (
            <Typography.Text type="success">
              Subscribe day:{" "}
              {moment(data?.subscription?.createdAt).format("LLL")}
            </Typography.Text>
          )}
          {data?.subscription?.stripeSubscriptionStatus === "active" && (
            <Typography.Text type="secondary" italic>
              Next Payment:{" "}
              {moment(data?.subscription?.stripeSubscriptionEnd).format("LLL")}
            </Typography.Text>
          )}
        </div>
        <div className="my-5 flex justify-end">
          <p className="text-sm font-light text-slate-400">
            We don&apos;t store your credit/debit card information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Billing;
