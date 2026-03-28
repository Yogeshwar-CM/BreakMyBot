import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    {
      path: "/",
      priority: 1,
      changeFrequency: "weekly" as const,
    },
    {
      path: "/docs/installation",
      priority: 0.8,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/docs/quickstart",
      priority: 0.8,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/docs/config-format",
      priority: 0.8,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/docs/example-usage",
      priority: 0.8,
      changeFrequency: "monthly" as const,
    },
  ];

  return routes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
