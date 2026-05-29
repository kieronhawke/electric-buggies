import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { Media } from "@/components/media";
import { Arrow } from "@/components/ui/button";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { getLocations } from "@/lib/content";
import { imagery } from "@/lib/images";
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
        lede="We finish and brand every vehicle in the UK and ship worldwide. Explore how we serve each market, honestly, with delivery and import handled for you."
        crumbs={[{ name: "Home", path: "/" }, { name: "Locations", path: "/locations" }]}
      />
      <section className="py-16 md:py-24">
        <div className={wrap}>
          <div className="grid gap-6 sm:grid-cols-2">
            {locations.map((l, i) => (
              <Reveal key={l.slug} delay={i * 0.06}>
                <Link href={`/locations/${l.slug}`} className="group block">
                  <Media src={l.hero ?? imagery.locations[l.slug] ?? imagery.heroEstate} className="flex aspect-[16/10] items-end">
                    <div className="relative z-10 p-7">
                      <span className="text-[.66rem] font-semibold uppercase tracking-[.2em] text-white/70">{l.region}</span>
                      <h2 className="mt-1.5 text-3xl font-semibold text-white">{l.name}</h2>
                      <p className="mt-1 max-w-[34ch] text-[.92rem] text-white/80">{l.tagline}</p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-[.7rem] font-semibold uppercase tracking-[.16em] text-white">
                        Explore {l.name} <Arrow className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Media>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <MobileCtaBar />
    </>
  );
}
