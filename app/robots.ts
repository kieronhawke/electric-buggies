import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      // All crawlers (search + AI) welcome on public content. Only gate the
      // app/auth/utility surfaces. The legal pages (privacy/terms/cookies) are
      // public trust pages and stay crawlable, which supports E-E-A-T.
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/admin", "/api/", "/account", "/engineer", "/login", "/register", "/forgot-password", "/reset-password"],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
