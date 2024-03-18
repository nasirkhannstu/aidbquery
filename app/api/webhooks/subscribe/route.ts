import type Stripe from "stripe";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { type SubscriptionStatus, subscriptions } from "@/db/schema";

export const POST = async (request: Request) => {
  const body = await request.text();
  const signature = headers().get("Stripe-Signature") ?? "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOKS_SECRET || "",
    );
  } catch (err) {
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : "Unknown Error"}`,
      { status: 400 },
    );
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (!session?.metadata?.userId) {
    return new Response(null, {
      status: 200,
    });
  }

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    );

    await db.insert(subscriptions).values({
      amount: 0.99,
      userId: session.metadata.userId,
      stripeSubscriptionStatus: subscription.status as SubscriptionStatus,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripePaymentMethod: session.payment_method_types[0],
      stripePriceId: subscription.items.data[0].price.id,
      stripeSubscriptionEnd: new Date(subscription.current_period_end * 1000),
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    );

    await db
      .update(subscriptions)
      .set({
        stripePriceId: subscription.items.data[0]?.price.id,
        stripeSubscriptionEnd: new Date(subscription.current_period_end * 1000),
      })
      .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
  }

  if (event.type === "subscription_schedule.canceled") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    );

    const _subscription = await db.query.subscriptions.findFirst({
      where: (subscriptions, { eq, and }) =>
        and(
          eq(subscriptions.stripeSubscriptionId, subscription.id),
          eq(subscriptions.stripeSubscriptionStatus, "active"),
        ),
    });

    if (!_subscription) throw new TRPCError({ code: "NOT_FOUND" });

    await db
      .update(subscriptions)
      .set({
        stripeSubscriptionStatus: "canceled",
        stripeSubscriptionEnd: new Date(),
      })
      .where(eq(subscriptions.id, _subscription.id));
  }

  return new Response(null, { status: 200 });
};
