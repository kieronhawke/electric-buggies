import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { models } from "@/lib/data/models";
import { sectors } from "@/lib/data/sectors";
import { landingPages } from "@/lib/data/landing";

/** Dynamic sitemap including all CMS-style pages (brief §9). */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();

  const staticPaths = [
    "",
    "/range",
    "/configure",
    "/bespoke",
    "/ownership",
    "/sectors",
    "/about",
    "/contact",
    "/request-a-quote",
    ...Object.keys(landingPages).map((s) => `/${s}`),
  ];

  const modelPaths = models.flatMap((m) => [
    `/range/${m.slug}`,
    ...(m.basePrice > 0 ? [`/configure/${m.slug}`] : []),
  ]);

  const sectorPaths = sectors.map((s) => `/sectors/${s.slug}`);

  const all = [...staticPaths, ...modelPaths, ...sectorPaths];

  return all.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/range/") ? 0.8 : 0.6,
  }));
}
