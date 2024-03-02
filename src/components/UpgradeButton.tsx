"use client";
import { LuArrowRight } from "react-icons/lu";

import { Button } from "./ui/button";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "./ui/use-toast";

const UpgradeButton = () => {
  const toast = useToast();

  const { mutate: createStripeSession } = trpc.createStripeSession.useMutation({
    onSuccess: ({ url }) => {
      toast.toast({
        title: "Payment succeeded!",
        description: "You have successfully subscribed to the plan.",
        variant: "success",
      });

      window.location.href = url ?? "/billing";
    },
  });

  return (
    <Button onClick={() => createStripeSession()} className="w-full">
      Upgrade now <LuArrowRight className="ml-1.5 h-5 w-5" />
    </Button>
  );
};

export default UpgradeButton;
