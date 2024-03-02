import { PLANS } from "@/config/controller";
import { PricingItemTypes } from "@/types/plan";
import { convertMBtoKB, free_pricing, pro_pricing } from "./utils";

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
      pdf: {
        text: `${PLANS[0].pdf.quota} PDFs`,
        footnote: `${PLANS[0].pdf.pagesPerPdf} pages & ${convertMBtoKB(
          PLANS[0].pdf.fileSize,
        )} per PDF file.`,
        isAllowed: true,
      },
      docx: {
        text: `${PLANS[0].docx.quota} DOCXs`,
        footnote: `${PLANS[0].docx.pagesPerDocx} pages & ${convertMBtoKB(
          PLANS[0].docx.fileSize,
        )} per Docx file.`,
        isAllowed: PLANS[0].docx.isAllowed,
      },
      txt: {
        text: `${PLANS[0].txt.quota} Text files`,
        footnote: `Maximum ${convertMBtoKB(PLANS[0].txt.fileSize)} per file.`,
        isAllowed: PLANS[0].txt.isAllowed,
      },
      image: {
        text: `${PLANS[0].image.quota} images`,
        footnote: `${convertMBtoKB(PLANS[0].image.fileSize)} per image.`,
        isAllowed: PLANS[0].image.isAllowed,
      },
      link: {
        text: `${PLANS[0].link.quota} website URLs`,
        footnote: "The maximum number of website URLs allowed.",
        isAllowed: PLANS[0].link.isAllowed,
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
      pdf: {
        text: `${PLANS[1].pdf.quota} PDFs`,
        footnote: `${PLANS[1].pdf.pagesPerPdf} pages & ${convertMBtoKB(
          PLANS[1].pdf.fileSize,
        )} per PDF file.`,
        isAllowed: true,
      },
      docx: {
        text: `${PLANS[1].docx.quota} DOCXs`,
        footnote: `${PLANS[1].docx.pagesPerDocx} pages & ${convertMBtoKB(
          PLANS[1].docx.fileSize,
        )} per Docx file.`,
        isAllowed: PLANS[1].docx.isAllowed,
      },
      txt: {
        text: `${PLANS[1].txt.quota} Text files`,
        footnote: `Maximum ${convertMBtoKB(PLANS[1].txt.fileSize)} per file.`,
        isAllowed: PLANS[1].txt.isAllowed,
      },
      image: {
        text: `${PLANS[1].image.quota} images`,
        footnote: `${convertMBtoKB(PLANS[1].image.fileSize)} per image.`,
        isAllowed: PLANS[1].image.isAllowed,
      },
      link: {
        text: `${PLANS[1].link.quota} website URLs`,
        footnote: "The maximum number of website URLs allowed.",
        isAllowed: PLANS[1].link.isAllowed,
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
