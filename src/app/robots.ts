import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/privacy", "/terms"],
        disallow: [
          "/sign-in",
          "/sign-up",
          "/verify",
          "/forgot-password",
          "/reset-password",
          "/auth/success",
          "/logged-in",
          "/account",
          "/account/security",
          "/auth",
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
