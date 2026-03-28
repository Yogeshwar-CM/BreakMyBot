import type { MetadataRoute } from "next";

import { absoluteUrl, siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/docs/installation",
          "/docs/quickstart",
          "/docs/config-format",
          "/docs/example-usage",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.url,
  };
}
