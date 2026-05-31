import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { Media } from "@/components/media";
import { Arrow } from "@/components/ui/button";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { getSectors } from "@/lib/content";
import { imagery } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";

const wrap = "mx-auto max-w-[1320px] px-[clamp(1.25rem,5vw,4.5rem)]";

export const metadata: Metadata = buildMetadata({
  title: "Electric Buggies by Sector | Industries We Serve",
  description:
    "Electric buggies and utility vehicles for estates, resorts, golf clubs, healthcare, universities, warehouses, parks, events and more. See how we solve each sector.",
  path: "/sectors",
  ogImage: "/img/vehicles/eight.webp",
  absoluteTitle: true,
});

export default async function SectorsPage() {
  const sectors = await getSectors();
  return (
    <>
      <PageHero
        eyebrow="Sectors"
        title="Built for where you operate."
        lede="Every setting asks something different of a vehicle. Explore the problem we solve in yours, and the fleet that solves it."
        crumbs={[{ name: "Home", path: "/" }, { name: "Sectors", path: "/sectors" }]}
      />
      <section className="pt-14 md:pt-20">
        <div className={wrap}>
          <Reveal>
            <p className="max-w-[70ch] text-[clamp(1.1rem,1.8vw,1.4rem)] leading-[1.55] text-ink-2">
              We build premium electric buggies, golf buggies and utility vehicles for the places that move people, kit and crews across large private and public ground. From country estates, resorts and golf clubs to healthcare sites, university campuses, warehouses, parks and events, every fleet is built to order in Britain, branded to you, and supported by a 3-year warranty and 24-hour VIP call-out. Quiet, clean and capable, our vehicles do the moving so the setting can speak for itself.
            </p>
          </Reveal>
        </div>
      </section>
      <section className="py-12 md:py-16">
        <div className={wrap}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sectors.map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.05}>
                <Link href={`/sectors/${s.slug}`} className="group block">
                  <Media src={imagery.sectors[s.slug]} className="flex aspect-[4/3] items-end">
                    <div className="relative z-10 p-6">
                      <h2 className="text-2xl font-semibold text-white">{s.name}</h2>
                      <p className="mt-1.5 max-w-[32ch] text-[.9rem] text-white/80">{s.tagline}</p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-[.7rem] font-semibold uppercase tracking-[.16em] text-white">
                        Explore <Arrow className="h-3.5 w-3.5" />
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
