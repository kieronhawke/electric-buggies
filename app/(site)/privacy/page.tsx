import type { Metadata } from "next";
import { LegalTemplate } from "@/components/legal-template";
import { legalDocs } from "@/lib/data/legal";
import { buildMetadata } from "@/lib/seo";

const doc = legalDocs.privacy;
export const metadata: Metadata = buildMetadata({
  title: doc.title,
  description: doc.intro,
  path: `/${doc.slug}`,
  noindex: true,
});

export default function Page() {
  return <LegalTemplate doc={doc} />;
}
