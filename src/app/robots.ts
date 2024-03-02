import { MetadataRoute } from "next";

import { absURL } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/users",
        "/admin/settings",
        "/admin/files",
        "/files",
        "/files*",
        "/api/",
        "/profile",
      ],
    },
    sitemap: absURL("/sitemap.xml"),
  };
}
