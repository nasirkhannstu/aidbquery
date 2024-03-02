export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/files/:path*",
    "/profile/:path*",
    "/change-password",
    "/verifications/:path*",
    "/admin/:path*",
  ],
};
