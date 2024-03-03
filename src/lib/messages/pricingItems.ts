import { PLANS } from "@/config/controller";
import { PricingItemTypes } from "@/types/plan";
import { convertMBtoKB, free_pricing, pro_pricing } from "../utils";

/**
 * Represents the pricing items available for different plans.
 */
export const pricingItems: PricingItemTypes[] = [
  // TODO: for free plan
  {
    plan: PLANS[0].name,
    tagline: "Exclusively for personal use.",
    quota: PLANS[0].quota,
    finance: {
      price: free_pricing,
    },
    features: {
      csv: {
        text: `${PLANS[0].csv.quota} CSVs`,
        footnote: `${PLANS[0].csv.rows} records & ${convertMBtoKB(
          PLANS[0].csv.fileSize,
        )} per CSV file.`,
        isAllowed: true,
      },
      json: {
        text: `${PLANS[0].json.quota} JSONs`,
        footnote: `${convertMBtoKB(PLANS[0].json.fileSize)} per JSON file.`,
        isAllowed: PLANS[0].json.isAllowed,
      },
    },
    featureAll: [
      {
        text: "Priority support",
        negative: true,
      },
      {
        text: "Higher-quality responses",
        footnote: "Improved algorithmic responses for higher content quality.",
        negative: true,
      },
      {
        text: "Mobile-friendly interface",
        negative: true,
      },
    ],
  },
  // TODO: for pro plan
  {
    plan: PLANS[1].name,
    tagline: "For larger projects with higher requirements.",
    quota: PLANS[1].quota,
    finance: {
      price: pro_pricing,
    },
    features: {
      csv: {
        text: `${PLANS[1].csv.quota} CSVs`,
        footnote: `${PLANS[1].csv.rows} records & ${convertMBtoKB(
          PLANS[1].csv.fileSize,
        )} per CSV file.`,
        isAllowed: true,
      },
      json: {
        text: `${PLANS[1].json.quota} JSONs`,
        footnote: `${convertMBtoKB(PLANS[1].json.fileSize)} per JSON file.`,
        isAllowed: PLANS[1].json.isAllowed,
      },
    },
    featureAll: [
      {
        text: "Priority support",
        negative: true,
      },
      {
        text: "Higher-quality responses",
        footnote: "Improved algorithmic responses for higher content quality.",
        negative: true,
      },
      {
        text: "Mobile-friendly interface",
        negative: true,
      },
    ],
  },
];
