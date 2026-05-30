import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/admin", "/api/", "/account", "/login", "/register", "/forgot-password", "/reset-password", "/privacy", "/terms", "/cookies"],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
