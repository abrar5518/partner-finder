import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/login", "/register"],
      disallow: ["/admin", "/dashboard", "/create-campaign", "/api/"],
    },
    sitemap: `${env.SITE_URL}/sitemap.xml`,
  };
}
