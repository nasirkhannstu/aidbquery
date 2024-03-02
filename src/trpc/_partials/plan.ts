import { getUserSubscriptionPlan } from "@/config/using_mode";
import { publicProcedure } from "../trpc";

export const clientSubscription = () => {
  return publicProcedure.query(async function () {
    return await getUserSubscriptionPlan();
  });
};
