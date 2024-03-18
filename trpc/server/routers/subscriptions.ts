import { createTRPCRouter, protectedProcedure } from "@/trpc/server/api/trpc";
import { stripe } from "@/lib/stripe";
import { absURL } from "@/lib/utils";

export const subscriptionRoute = createTRPCRouter({
  subscribe: protectedProcedure.mutation(async ({ ctx }) => {
    // FIXME: remove checked after deployment
    console.log("absURL", absURL("/billing"));

    const subscribe = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
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
        name: ctx.session.user.fullName,
        email: ctx.session.user.email,
      },
      cancel_url: absURL("/pricing"),
      success_url: absURL("/billing"),
    });

    return { url: subscribe.url };
  }),
});
