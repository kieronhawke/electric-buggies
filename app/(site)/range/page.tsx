import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { RangeGrid } from "@/components/range-grid";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { getModels } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "The Range",
  description:
    "Explore the Electric Buggies range — electric buggies and utility vehicles, from an intimate two-seater to an eight-seat shuttle. Configure yours and request a tailored quote.",
  path: "/range",
});

export default async function RangePage() {
  const models = await getModels();
  return (
    <>
      <PageHero
        eyebrow="The Range"
        title="The complete range."
        lede="Six starting points, each made to order. Filter by configuration, then configure your own."
        crumbs={[{ name: "Home", path: "/" }, { name: "The Range", path: "/range" }]}
      />
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1320px] px-[clamp(1.25rem,5vw,4.5rem)]">
          <RangeGrid models={models} />
        </div>
      </section>
      <MobileCtaBar />
    </>
  );
}
