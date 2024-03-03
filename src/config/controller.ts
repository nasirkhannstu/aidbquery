import {
  free_name,
  free_pricing,
  free_slug,
  personal_name,
  personal_slug,
  pro_name,
  pro_pricing,
  pro_slug,
} from "@/lib/utils";
import { PlanTypes } from "@/types/plan";

export const PLANS: PlanTypes[] = [
  /**
   * Free plan for SaaS
   */
  {
    name: free_name as string,
    slug: free_slug as string,
    quota: 10,
    csv: {
      isAllowed: true,
      quota: 10,
      fileSize: 200,
      rows: 6_000,
    },
    json: {
      isAllowed: true,
      quota: 10,
      fileSize: 100,
    },
    price: {
      amount: free_pricing,
      priceIds: {
        test: "",
        production: "",
      },
    },
  },
  /**
   * Premium plan for SaaS
   */
  {
    name: pro_name as string,
    slug: pro_slug as string,
    quota: 60,
    csv: {
      isAllowed: true,
      quota: 60,
      fileSize: 500,
      rows: 10_000,
    },
    json: {
      isAllowed: true,
      quota: 60,
      fileSize: 200,
    },
    price: {
      amount: pro_pricing,
      priceIds: {
        test: process.env.STRIPE_SUB_PRICE_ID,
        production: process.env.STRIPE_SUB_PRICE_ID as string,
      },
    },
  },
  /**
   * Plan for PERSONAL mode
   */
  {
    name: personal_name as string,
    slug: personal_slug as string,
    quota: Infinity,
    csv: {
      isAllowed: true,
      quota: Infinity,
      fileSize: 5 * 1024,
      rows: 1_00_000,
    },
    json: {
      isAllowed: true,
      quota: Infinity,
      fileSize: 5 * 1024,
    },
    price: {
      amount: 0,
      priceIds: {
        test: "N/A",
        production: "N/A",
      },
    },
  },
];
