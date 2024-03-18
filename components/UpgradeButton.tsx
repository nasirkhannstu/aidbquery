"use client";
import { Button } from "antd";

import { api } from "@/trpc/provider";

const UpgradeButton = () => {
  const { mutate: subscribe, isLoading } =
    api.subscriptions.subscribe.useMutation({
      onSuccess: (data) => {
        window.location.href = data.url ?? "/pricing";
      },
      onError: (error) => {
        alert(error.message);
      },
    });

  return (
    <>
      <Button
        type="primary"
        size="large"
        block
        onClick={() => subscribe()}
        loading={isLoading}
      >
        Upgrade Now
      </Button>
    </>
  );
};

export default UpgradeButton;
