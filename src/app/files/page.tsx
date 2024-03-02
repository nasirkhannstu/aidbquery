import MyFiles from "@/components/MyFiles/MyFiles";
import { getUserSubscriptionPlan } from "@/config/using_mode";

const MyFilesPage = async () => {
  const subscriptionPlan = await getUserSubscriptionPlan();

  return <MyFiles subscriptionPlan={subscriptionPlan} />;
};

export default MyFilesPage;
