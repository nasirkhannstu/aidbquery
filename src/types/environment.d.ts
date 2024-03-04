// process.env support
declare namespace NodeJS {
  export interface ProcessEnv {
    MY_APP_NAME: string;
    NEXT_PUBLIC_MY_APP_NAME: string;
    SUPPORT_EMAIL: string;
    FB_URL: string;
    TWITTER_URL: string;
    DATABASE_URL: string;
    OPENAI_API_KEY: string;
    STRIPE_SECRET_KEY?: string;
    STRIPE_WEBHOOK_SECRET?: string;
    STRIPE_SUB_PRICE_ID?: string;
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    ORIGIN: string;
    JWT_SECRET: string;
    PINECONE_API_KEY: string;
    PINECONE_INDEX_NAME: string;
    PINECONE_ENVIRONMENT: string;
    IS_SENDGRID: "ON" | "OFF";
    SENDGRID_API_KEY?: string;
    SENDGRID_EMAIL?: string;
    SMTP_HOST?: string;
    SMTP_PORT?: number;
    SMTP_EMAIL?: string;
    SMTP_EMAIL_PASSWORD?: string;
    EMAIL_VERIFY_OPTION: "ON" | "OFF";
    EMAIL_VERIFY_TIME_EXP?: string;
    FREE_PRICING?: number;
    PRO_PRICING?: number;
    USING_MODE: "PERSONAL" | "SaaS";
    NEXT_PUBLIC_USING_MODE: "PERSONAL" | "SaaS";
    FREE_ACCOUNT_NAME?: string;
    FREE_ACCOUNT_SLUG?: string;
    PRO_ACCOUNT_NAME?: string;
    PRO_ACCOUNT_SLUG?: string;
    PERSONAL_ACCOUNT_NAME?: string;
    PERSONAL_ACCOUNT_SLUG?: string;
  }
}
