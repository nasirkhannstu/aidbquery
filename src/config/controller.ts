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
  // Free mode plan
  {
    name: free_name as string,
    slug: free_slug as string,
    quota: 10,
    docx: {
      isAllowed: true,
      pagesPerDocx: 5,
      quota: 5,
      fileSize: 100, // almost 5 pages
    },
    pdf: {
      isAllowed: true,
      pagesPerPdf: 5,
      quota: 5,
      fileSize: 2024, // 2MB
    },
    link: {
      isAllowed: true,
      quota: 20,
    },
    txt: {
      isAllowed: true,
      quota: 20,
      fileSize: 200, // 200KB
    },
    image: {
      isAllowed: false,
      quota: 0,
      fileSize: 0,
    },
    price: {
      amount: free_pricing,
      priceIds: {
        test: "",
        production: "",
      },
    },
  },
  // Pro mode plan
  {
    name: pro_name as string,
    slug: pro_slug as string,
    quota: 60,
    pdf: {
      isAllowed: true,
      pagesPerPdf: 200,
      quota: 60,
      fileSize: 100 * 1024, // 100MB
    },
    docx: {
      isAllowed: true,
      pagesPerDocx: 100,
      quota: 60,
      fileSize: 100 * 1024, // 100MB
    },
    image: {
      isAllowed: true,
      quota: 20,
      fileSize: 2 * 1024, // 2MB
    },
    link: {
      isAllowed: true,
      quota: 100,
    },
    txt: {
      isAllowed: true,
      quota: 50,
      fileSize: 2 * 1024, // 2MB
    },
    price: {
      amount: pro_pricing,
      priceIds: {
        test: process.env.STRIPE_SUB_PRICE_ID,
        production: process.env.STRIPE_SUB_PRICE_ID as string,
      },
    },
  },
  // Personal mode plan
  {
    name: personal_name as string,
    slug: personal_slug as string,
    quota: Infinity,
    pdf: {
      isAllowed: true,
      pagesPerPdf: Infinity,
      quota: Infinity,
      fileSize: Infinity,
    },
    docx: {
      isAllowed: true,
      pagesPerDocx: Infinity,
      quota: Infinity,
      fileSize: Infinity,
    },
    image: {
      isAllowed: true,
      quota: Infinity,
      fileSize: Infinity,
    },
    link: {
      isAllowed: true,
      quota: Infinity,
    },
    txt: {
      isAllowed: true,
      quota: Infinity,
      fileSize: Infinity,
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
