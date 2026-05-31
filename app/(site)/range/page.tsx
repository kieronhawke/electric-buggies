import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { RangeGrid } from "@/components/range-grid";
import { Reveal } from "@/components/reveal";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { getModels } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

const wrap = "mx-auto max-w-[1320px] px-[clamp(1.25rem,5vw,4.5rem)]";

const useCases = [
  {
    heading: "Two and four-seat buggies",
    body: "The natural choice for private estates, smaller resorts, golf clubs and country homes. A two-seat electric buggy moves one or two people and a modest load across grounds, gardens and driveways without noise or fumes. The four-seat steps up to family use, guest transfers and patrols, and stays compact enough for narrow paths and tight courtyards.",
  },
  {
    heading: "Six and eight-seat buggies",
    body: "Built for moving people in numbers: hotel and resort shuttles, wedding and event transfers, holiday parks, large estates and campus links. A six or eight-seat electric buggy carries guests, staff and crews between car parks, entrances and venues on a single charge, quietly and comfortably, with branding that does the talking on arrival.",
  },
  {
    heading: "Utility vehicles",
    body: "The workhorse of the range. Electric utility vehicles carry tools, kit, feed, greenkeeping equipment and deliveries across estates, farms, golf courses, warehouses and work sites. A flat load bed, real payload and all-terrain capability make light work of grounds maintenance, gamekeeping, forestry and site logistics in any weather.",
  },
  {
    heading: "Bespoke and fleet builds",
    body: "When the standard configurations are a starting point rather than the answer. We build to order in Britain, so seat count, load space, colour, upholstery, roof, wheels and full livery are yours to specify. Fleets are matched to the site, branded as one, and supported by a 3-year warranty and 24-hour VIP call-out.",
  },
];

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
        <div className={wrap}>
          <RangeGrid models={models} />
        </div>
      </section>
      <section className="border-t border-line bg-paper-2 py-16 md:py-24">
        <div className={wrap}>
          <Reveal>
            <p className="eyebrow">Which buggy for which job</p>
            <h2 className="mt-3 max-w-[20ch] text-[clamp(1.8rem,3.4vw,2.8rem)] leading-[1.05]">
              Choose by what you need it to do.
            </h2>
            <p className="mt-5 max-w-[68ch] text-[clamp(1.05rem,1.7vw,1.25rem)] leading-[1.55] text-ink-2">
              Every model in the range is a premium electric buggy made to order in Britain, but each configuration earns its place in a different setting. Whether you are moving guests, carrying kit, patrolling grounds or running a branded fleet, the starting point below points you to the right vehicle. From there, configure it to your site or ask us to build something bespoke.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-2">
            {useCases.map((u, i) => (
              <Reveal key={u.heading} delay={i * 0.05}>
                <div className="border-t border-line-2 pt-6">
                  <h3 className="text-xl font-semibold">{u.heading}</h3>
                  <p className="mt-3 text-[1.02rem] leading-[1.6] text-ink-2">{u.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-12 flex flex-wrap gap-3">
              <Link href="/configure" className="inline-flex min-h-[48px] items-center rounded-full bg-ink px-7 py-3 text-[.8rem] font-semibold uppercase tracking-[.1em] text-white transition-colors hover:bg-ink/90">
                Configure your buggy
              </Link>
              <Link href="/request-a-quote" className="inline-flex min-h-[48px] items-center rounded-full border border-ink px-7 py-3 text-[.8rem] font-semibold uppercase tracking-[.1em] text-ink transition-colors hover:bg-ink hover:text-white">
                Request a quote
              </Link>
              <Link href="/bespoke" className="inline-flex min-h-[48px] items-center rounded-full border border-line-2 px-7 py-3 text-[.8rem] font-semibold uppercase tracking-[.1em] text-ink-2 transition-colors hover:border-ink hover:text-ink">
                Explore bespoke
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
      <MobileCtaBar />
    </>
  );
}
