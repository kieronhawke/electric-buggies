import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

/**
 * Embedded Sanity Studio at /studio (brief §3). Renders the full CMS in-app so
 * the owner can edit all content with no code.
 */
export const dynamic = "force-static";
export const metadata = {
  title: "Electric Buggies — Studio",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  return <NextStudio config={config} />;
}
