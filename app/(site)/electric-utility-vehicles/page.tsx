import type { Metadata } from "next";
import { LandingTemplate } from "@/components/landing-template";
import { landingPages } from "@/lib/data/landing";
import { buildMetadata } from "@/lib/seo";

const page = landingPages["electric-utility-vehicles"];

export const metadata: Metadata = buildMetadata({
  title: page.metaTitle,
  absoluteTitle: true,
  description: page.metaDescription,
  path: `/${page.slug}`,
  ogImage: "/img/vehicles/utility.webp",
});

export default function Page() {
  return <LandingTemplate page={page} />;
}
