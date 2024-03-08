declare namespace NodeJS {
  export interface ProcessEnv {
    APP_NAME: string;
    NEXT_PUBLIC_APP_NAME: number;
    DATABASE_URL: string;
    APP_MODE: "SaaS" | "PERSONAL";
    NEXT_PUBLIC_APP_MODE: "SaaS" | "PERSONAL";
    NEXTAUTH_SECRET?: string;
  }
}
