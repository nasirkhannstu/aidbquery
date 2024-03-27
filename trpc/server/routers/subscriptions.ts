import { createTRPCRouter, protectedProcedure } from "@/trpc/server/api/trpc";
import { stripe } from "@/lib/stripe";
import { absURL } from "@/lib/utils";

export const subscriptionRoute = createTRPCRouter({
  subscribe: protectedProcedure.mutation(async ({ ctx }) => {
    // FIXME: remove checked after deployment
    console.log("absURL", absURL("/billing"));

    const subscription = await ctx.db.query.subscriptions.findFirst({
      where: (subscriptions, { eq }) =>
        eq(subscriptions.userId, ctx.session.user.id),
    });

    if (
      subscription &&
      subscription.stripeSubscriptionStatus === "active" &&
      subscription.stripeCustomerId
    ) {
      const billingPortal = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId ?? "",
        return_url: absURL("/billing"),
      });

      return { url: billingPortal.url };
    }

    const subscribe = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: ctx.session.user.stripeCustomerId!,
      mode: "subscription",
      line_items: [
        {
          quantity: 1,
          price: process.env.STRIPE_PRICE_ID,
        },
      ],
      billing_address_collection: "auto",
      metadata: {
        userId: ctx.session.user.id,
        firstName: ctx.session.user.firstName,
        lastName: ctx.session.user.lastName,
        email: ctx.session.user.email,
        stripeCustomerId: ctx.session.user.stripeCustomerId,
      },
      cancel_url: absURL("/pricing"),
      success_url: absURL("/pricing"),
    });

    return { url: subscribe.url };
  }),

  /**
   * @description Get the user's subscription
   * @returns {Promise<Stripe.Customer>} information about the user's subscription
   */
  userSubscription: protectedProcedure.query(async ({ ctx }) => {
    const billingPortal = await stripe.billingPortal.sessions.create({
      customer: ctx.session.user.stripeCustomerId ?? "",
      return_url: absURL("/pricing"),
    });

    // Retrieve all subscriptions for a customer
    const subscription = await ctx.db.query.subscriptions.findFirst({
      where: (subscriptions, { eq }) =>
        eq(subscriptions.userId, ctx.session.user.id),
    });

    return { subscription, url: billingPortal.url };
  }),
});
