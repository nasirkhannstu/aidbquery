import { MetadataRoute } from "next";

import { absURL } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absURL("/"),
      lastModified: new Date("February 29, 2024 12:45:00"),
      priority: 1,
    },
    {
      url: absURL("/pricing"),
      lastModified: new Date("February 29, 2024 12:46:00"),
      priority: 0.9,
    },
    {
      url: absURL("/authentication/login"),
      lastModified: new Date("February 29, 2024 12:50:00"),
      priority: 0.8,
    },
    {
      url: absURL("/authentication/register"),
      lastModified: new Date("February 29, 2024 12:53:00"),
      priority: 0.7,
    },
    {
      url: absURL("/authentication/forgot-password"),
      lastModified: new Date("February 29, 2024 12:55:00"),
      priority: 0.6,
    },
  ];
}
