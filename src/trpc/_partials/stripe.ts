import { TRPCError } from "@trpc/server";

import { absURL } from "@/lib/utils";
import { privateProcedure } from "../trpc";
import { db } from "@/db/prisma";
import { getUserSubscriptionPlan, stripe } from "@/config/using_mode";
import { PLANS } from "@/config/controller";

export const createStripeSession = () =>
  privateProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx;
    const billingUrl = absURL("/billing");

    if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

    const dbUser = await db.users.findFirst({
      where: {
        id: userId,
      },
    });

    if (!dbUser) throw new TRPCError({ code: "UNAUTHORIZED" });

    const subscriptionPlan = await getUserSubscriptionPlan();

    if (subscriptionPlan.isSubscribed && dbUser.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: dbUser.stripeCustomerId,
        return_url: billingUrl,
      });

      return { url: stripeSession.url };
    }

    if (dbUser?.status === "SUSPEND") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Your account is suspended, you cannot request billing.",
      });
    }
    if (dbUser?.status === "RESTRICTED") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Your account is restricted, you cannot request billing.",
      });
    }
    if (dbUser?.status === "INACTIVE") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Your account is inactivated, you cannot request billing.",
      });
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      line_items: [
        {
          price: PLANS.find((plan) => plan.name === "Premium")?.price.priceIds
            .production,
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId,
      },
    });

    return { url: stripeSession.url };
  });
