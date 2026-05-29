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
  title: "Sectors — Solutions by Setting",
  description:
    "Electric buggies for country estates, resorts & hotels, golf clubs, festivals & events, holiday parks and film & TV. See how we solve each sector's needs.",
  path: "/sectors",
});

export default async function SectorsPage() {
  const sectors = await getSectors();
  return (
    <>
      <PageHero
        eyebrow="Sectors"
        title="Built for where you operate."
        lede="Every setting asks something different of a vehicle. Explore the problem we solve in yours — and the fleet that solves it."
        crumbs={[{ name: "Home", path: "/" }, { name: "Sectors", path: "/sectors" }]}
      />
      <section className="py-16 md:py-24">
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
