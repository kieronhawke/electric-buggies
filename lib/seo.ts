import type { Metadata } from "next";
import { site } from "./site";

interface SeoArgs {
  title: string;
  description: string;
  path: string;
  /** Override OG image (per-page); defaults to the dynamic OG route. */
  ogImage?: string;
  noindex?: boolean;
}

/**
 * Build per-page metadata with canonical + Open Graph + Twitter (brief §9).
 * Every page that the owner could control gets an `seo` object in Phase 2;
 * this helper is the single place those values are applied.
 */
export function buildMetadata({
  title,
  description,
  path,
  ogImage,
  noindex,
}: SeoArgs): Metadata {
  const url = new URL(path, site.url).toString();
  const image = ogImage ?? `/opengraph-image`;
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "en_GB",
      siteName: site.name,
      url,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
