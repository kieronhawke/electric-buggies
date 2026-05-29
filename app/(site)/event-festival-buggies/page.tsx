import type { Metadata } from "next";
import { LandingTemplate } from "@/components/landing-template";
import { landingPages } from "@/lib/data/landing";
import { buildMetadata } from "@/lib/seo";

const page = landingPages["event-festival-buggies"];

export const metadata: Metadata = buildMetadata({
  title: page.metaTitle,
  description: page.metaDescription,
  path: `/${page.slug}`,
});

export default function Page() {
  return <LandingTemplate page={page} />;
}
