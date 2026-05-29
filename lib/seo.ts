import type { Metadata } from "next";
import { site } from "./site";

interface SeoArgs {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noindex?: boolean;
}

/**
 * Per-page metadata: title + clean description + canonical + OG/Twitter.
 * OG images are supplied by the file-based `opengraph-image.tsx` convention
 * (root default + per-route dynamic ones), so we DON'T hardcode an image here —
 * doing so would override the per-route generators. Only set one explicitly via
 * `ogImage` when needed.
 */
export function buildMetadata({ title, description, path, ogImage, noindex }: SeoArgs): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "en_GB",
      siteName: site.name,
      url: new URL(path, site.url).toString(),
      title,
      description,
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

/**
 * Clamp body copy to a clean, self-contained meta description: trims to the
 * last whole word under `max` chars and never cuts mid-word. Prefer a dedicated
 * `metaDescription` field where one exists; this is the safety net.
 */
export function clampWords(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const slice = clean.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  return (lastSpace > 40 ? slice.slice(0, lastSpace) : slice).replace(/[,;:.\s]+$/, "") + "…";
}
