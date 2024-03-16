export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/chats/:path*", "/pricing", "/api/webhooks/payment"],
};
