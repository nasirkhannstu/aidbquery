import Stripe from "stripe";

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
  typescript: true,
});
