import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CompareTool } from "@/components/compare-tool";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { getModels, pricesVisible } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Compare Models",
  description:
    "Compare Electric Buggies models side by side, seats, range, battery, top speed, dimensions and price, then configure the one that fits.",
  path: "/compare",
    ogImage: "/img/vehicles/eight.webp",
});

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ models?: string }>;
}) {
  const models = await getModels();
  const showPrice = await pricesVisible();
  const { models: param } = await searchParams;
  const initial = (param?.split(",") ?? []).filter((s) => models.some((m) => m.slug === s));

  return (
    <>
      <PageHero
        eyebrow="Compare"
        title="Compare the range, side by side."
        lede="Put up to three models head to head on specification, then request a tailored quote."
        crumbs={[{ name: "Home", path: "/" }, { name: "Vehicles", path: "/range" }, { name: "Compare", path: "/compare" }]}
      />
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1320px] px-[clamp(1.25rem,5vw,4.5rem)]">
          <CompareTool models={models} initial={initial} showPrice={showPrice} />
        </div>
      </section>
      <MobileCtaBar />
    </>
  );
}
