import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { RangeGrid } from "@/components/range-grid";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { getModels } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Electric Buggies for Sale UK | The Full Range",
  description:
    "Browse the full range of premium electric buggies for sale, from 2 to 8 seats plus utility and bespoke models. Compare specs and prices, then request a tailored quote.",
  path: "/range",
    ogImage: "/img/vehicles/eight.webp",
  absoluteTitle: true,
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
