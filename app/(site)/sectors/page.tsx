import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { Arrow } from "@/components/ui/button";
import { sectors } from "@/lib/data/sectors";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Sectors",
  description:
    "Electric Buggies electric vehicles for estates, resorts & hotels, festivals & events, golf clubs, holiday parks and film & TV. Discover the right vehicle for where you operate.",
  path: "/sectors",
});

export default function SectorsPage() {
  return (
    <>
      <PageHero
        eyebrow="Sectors"
        title="Built for where you operate."
        lede="Every setting asks something different of a vehicle. Explore how Electric Buggies serves yours."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Sectors", path: "/sectors" },
        ]}
      />
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sectors.map((sector, i) => (
              <Reveal key={sector.slug} delay={i * 0.05}>
                <Link
                  href={`/sectors/${sector.slug}`}
                  className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-lg p-7"
                >
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(160deg, ${sector.plate} 0%, rgba(22,21,15,0.9) 100%)`,
                    }}
                  />
                  <div className="relative z-10">
                    <h2 className="font-display text-3xl text-white">{sector.name}</h2>
                    <p className="mt-2 text-sm text-white/70">{sector.tagline}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-champagne">
                      Explore <Arrow className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
