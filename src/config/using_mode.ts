/* eslint-disable indent */
import Stripe from "stripe";
import { getServerSession } from "next-auth";

import { PLANS } from "@/config/controller";
import { db } from "@/db/prisma";
import { authOptions } from "../lib/auth/authOption";
import { using_mode } from "../lib/utils";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2023-08-16",
  typescript: true,
});

export async function getUserSubscriptionPlan() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user?.id) {
    return {
      ...PLANS[0],
      isSubscribed: false,
      isCanceled: false,
      stripeCurrentPeriodEnd: null,
    };
  }

  const dbUser = await db.users.findFirst({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) {
    return {
      ...PLANS[0],
      isSubscribed: false,
      isCanceled: false,
      stripeCurrentPeriodEnd: null,
    };
  }

  if (using_mode && using_mode === "SaaS") {
    if (
      dbUser.subscriptionStatus === "CANCELED" ||
      dbUser.subscriptionStatus === "NULL"
    ) {
      return {
        ...PLANS[0],
        isSubscribed: false,
        isCanceled: false,
        stripeCurrentPeriodEnd: null,
      };
    }
  }

  // TODO: This stuff is for personal purposes only
  if (using_mode && using_mode === "PERSONAL") {
    return {
      ...PLANS[2],
      isSubscribed: true,
      isCanceled: false,
      stripeCurrentPeriodEnd: Date.now() + 30 * 86_400_000, // almost 30 days
    };
  }

  const isSubscribed = Boolean(
    using_mode &&
      using_mode === "SaaS" &&
      dbUser.stripePriceId &&
      dbUser.stripeCurrentPeriodEnd && // 86400000 = 1 day
      dbUser.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now() &&
      dbUser.subscriptionStatus === "ACTIVE",
  );

  const plan = isSubscribed
    ? PLANS.find(
        (plan) => plan.price.priceIds.production === dbUser.stripePriceId,
      )
    : null;

  let isCanceled = false;
  if (isSubscribed && dbUser.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(
      dbUser.stripeSubscriptionId,
    );
    isCanceled = stripePlan.cancel_at_period_end;
  }

  return {
    ...plan,
    stripeSubscriptionId: dbUser.stripeSubscriptionId,
    stripeCurrentPeriodEnd: dbUser.stripeCurrentPeriodEnd,
    stripeCustomerId: dbUser.stripeCustomerId,
    isSubscribed,
    isCanceled,
  };
}
