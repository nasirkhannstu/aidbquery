declare namespace NodeJS {
  export interface ProcessEnv {
    APP_NAME: string;
    NEXT_PUBLIC_APP_NAME: number;
    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    APP_MODE: "SaaS" | "PERSONAL";
    NEXT_PUBLIC_APP_MODE: "SaaS" | "PERSONAL";
  }
}
