import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absURL(path: string) {
  if (typeof window !== "undefined") return path;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`;
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}

export function convertMBtoKB(kilobytes: number): string {
  if (kilobytes > 1024) {
    const mb = kilobytes / 1024;
    return `${Math.ceil(mb)}MB`;
  } else {
    return `${kilobytes}KB`;
  }
}

export const pro_name = process.env.PRO_ACCOUNT_NAME;
export const pro_slug = process.env.PRO_ACCOUNT_SLUG;
export const free_name = process.env.FREE_ACCOUNT_NAME;
export const free_slug = process.env.FREE_ACCOUNT_SLUG;
export const personal_name = process.env.PERSONAL_ACCOUNT_NAME;
export const personal_slug = process.env.PERSONAL_ACCOUNT_SLUG;
export const pinecone_index = process.env.PINECONE_INDEX_NAME as string;
export const using_mode = process.env.USING_MODE as "SaaS" | "PERSONAL";
export const email_verify_end = Number(process.env.EMAIL_VERIFY_TIME_EXP);
export const app_name = process.env.MY_APP_NAME || "OfficeAI";
export const app_name_client =
  process.env.NEXT_PUBLIC_MY_APP_NAME || "OfficeAI";
export const pro_pricing = Number(process.env.PRO_PRICING) as number;
export const free_pricing = Number(process.env.FREE_PRICING) as number;

export const MIN_DIMENSION = 150;
export const TAG_LINE = `Unleash Intelligent Insights: Empower Your Data Journey with ${app_name}!`;
export const DESCRIPTION = `🚀Unlock the full potential of your data with ${app_name_client}! Seamlessly interact with your CSV and JSON files like never before. Simply upload your files, ask questions, and receive AI-generated answers tailored to your content. Say goodbye to manual data parsing and hello to intelligent insights at your fingertips. Elevate your document experience and unlock the power of intelligent information retrieval with ${app_name_client}. Try it now and revolutionize the way you interact with your data!📃🤖`;
