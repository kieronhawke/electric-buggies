import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { models } from "@/lib/data/models";
import { sectors } from "@/lib/data/sectors";
import { locations } from "@/lib/data/locations";
import { posts, categories } from "@/lib/data/blog";
import { landingPages } from "@/lib/data/landing";

/** Dynamic sitemap, models, sectors, locations, blog, landing pages (brief §E). */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();

  const staticPaths = [
    "", "/range", "/compare", "/configure", "/bespoke", "/ownership", "/sectors",
    "/sectors/airports", "/locations", "/guides", "/about", "/request-a-quote",
    "/hire", "/services/shuttle", "/services/vip-chauffeur", "/services/service-plan",
    ...Object.keys(landingPages).map((s) => `/${s}`),
  ];
  const modelPaths = models.flatMap((m) => [`/range/${m.slug}`, ...(m.basePrice > 0 ? [`/configure/${m.slug}`] : [])]);
  const sectorPaths = sectors.map((s) => `/sectors/${s.slug}`);
  const locationPaths = locations.map((l) => `/locations/${l.slug}`);
  const blogPaths = [
    ...posts.map((p) => `/guides/${p.slug}`),
    ...categories.map((c) => `/guides/category/${c.slug}`),
  ];

  const all = [...staticPaths, ...modelPaths, ...sectorPaths, ...locationPaths, ...blogPaths];

  return all.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/range/") || path.startsWith("/locations/") || path.startsWith("/sectors/") ? 0.8 : path.startsWith("/guides/") ? 0.7 : 0.6,
  }));
}
