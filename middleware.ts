export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/chats/:path*", "/users/:path*", "/dashboard/:path*"],
};
