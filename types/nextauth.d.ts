export type User = {
  id: string;
  email: string;
  fullName: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

declare module "next-auth" {
  interface Session {
    user?: User;
  }
}
