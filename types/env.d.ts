declare namespace NodeJS {
  export interface ProcessEnv {
    APP_NAME: string;
    NEXT_PUBLIC_APP_NAME: number;
    DATABASE_URL: string;
    APP_MODE: "SaaS" | "PERSONAL";
    NEXT_PUBLIC_APP_MODE: "SaaS" | "PERSONAL";
    NEXTAUTH_SECRET?: string;
    PINECONE_API_KEY: string;
    PINECONE_INDEX: string;
    OPENAI_API_KEY: string;
    STRIPE_SECRET_KEY: string;
    STRIPE_PRICE_API_KEY: string;
    STRIPE_WEBHOOKS_SECRET: string;
  }
}
