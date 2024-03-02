import { getServerSession } from "next-auth";

import { getUserSubscriptionPlan } from "../../config/using_mode";
import { authOptions } from "../auth/authOption";

export const middleware = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user || !user.id) throw new Error("Unauthorized");

  const subscriptionPlan = await getUserSubscriptionPlan();

  return { subscriptionPlan, userId: user.id };
};
