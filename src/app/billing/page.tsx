import { redirect } from "next/navigation";

import BillingForm from "@/components/BillingForm";
import { getUserSubscriptionPlan } from "@/config/using_mode";
import { using_mode } from "@/lib/utils";

const BillingPage = async () => {
  const subscriptionPlan = await getUserSubscriptionPlan();
  if (using_mode === "PERSONAL") return redirect("/files");


  return <BillingForm subscriptionPlan={subscriptionPlan} />;
};

export default BillingPage;
