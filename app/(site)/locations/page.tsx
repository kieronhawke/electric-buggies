import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { RegionSelector } from "@/components/region-selector";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { getLocations } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

const wrap = "mx-auto max-w-[1320px] px-[clamp(1.25rem,5vw,4.5rem)]";

export const metadata: Metadata = buildMetadata({
  title: "Locations, Worldwide Delivery",
  description:
    "Electric Buggies are built in Britain and delivered worldwide, Dubai, Scotland, Bermuda, New York and beyond. Explore how we serve your market.",
  path: "/locations",
});

export default async function LocationsPage() {
  const locations = await getLocations();
  return (
    <>
      <PageHero
        eyebrow="Locations"
        title="Built in Britain, delivered around the world."
        lede="We finish and brand every vehicle in the UK and ship worldwide. Choose your region to see how we serve each market, honestly, with delivery and import handled for you."
        crumbs={[{ name: "Home", path: "/" }, { name: "Locations", path: "/locations" }]}
      />
      <section className="py-16 md:py-24">
        <div className={wrap}>
          <RegionSelector locations={locations} />
        </div>
      </section>
      <MobileCtaBar />
    </>
  );
}
