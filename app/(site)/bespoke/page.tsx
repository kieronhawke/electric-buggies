import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { Button, Arrow } from "@/components/ui/button";
import { VehicleRender } from "@/components/vehicle-render";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Bespoke",
  description:
    "Commission a bespoke electric vehicle from Electric Buggies, matched liveries, engineered conversions and branded fleets, built entirely to your brief.",
  path: "/bespoke",
    ogImage: "/img/vehicles/four.webp",
});

const steps = [
  { n: "01", t: "The brief", b: "We begin with a conversation about where the vehicle will work and what it must do, not a catalogue." },
  { n: "02", t: "The design", b: "Liveries, materials, bodywork and specification are drawn up and agreed, with indicative costing." },
  { n: "03", t: "The build", b: "Your vehicle is built and finished in Britain to the agreed specification, with progress shared throughout." },
  { n: "04", t: "Delivery", b: "Delivered, commissioned and handed over UK-wide, with ongoing servicing and support." },
];

export default function BespokePage() {
  return (
    <>
      <PageHero
        eyebrow="Bespoke"
        title="Begin with a blank page."
        lede="When the range is a starting point rather than an answer, commission a vehicle engineered entirely to your brief."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Bespoke", path: "/bespoke" },
        ]}
      />

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <div className="relative aspect-[4/3] rounded-lg bg-gradient-to-b from-paper-2 to-paper">
                <div className="absolute inset-0 flex items-center justify-center p-10">
                  <VehicleRender colour="#16150f" roof="hard-roof" wheels="noble" />
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-3xl text-ink md:text-4xl">Anything the brief requires.</h2>
              <p className="mt-5 leading-relaxed text-ink-soft">
                Liveries matched to a house, bodywork reworked for a production, accessibility
                conversions, branded fleets for resorts, security specifications for private
                land. If it can be engineered, it can be built.
              </p>
              <ul className="mt-6 space-y-2">
                {["Matched liveries & paint", "Engineered conversions", "Branded resort & club fleets", "Picture & set vehicles", "Accessibility specifications", "Security & patrol builds"].map((x) => (
                  <li key={x} className="flex items-center gap-3 text-ink-soft">
                    <span className="h-px w-5 bg-champagne" /> {x}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-paper-2 py-16 md:py-24">
        <Container>
          <Reveal>
            <p className="eyebrow">Where bespoke earns its place</p>
            <h2 className="mt-3 max-w-[22ch] text-3xl text-ink md:text-4xl">Built around the way you actually work.</h2>
            <p className="mt-5 max-w-[70ch] leading-relaxed text-ink-soft">
              A standard electric buggy answers most briefs. A bespoke one answers yours exactly. We build to order in Britain, so the vehicle is shaped around the site, the brand and the job rather than the other way round. These are the commissions we are asked for most.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-x-10 gap-y-9 md:grid-cols-2">
            {[
              {
                t: "Branded resort & club fleets",
                b: "A matched fleet of guest buggies and shuttles in a hotel, resort or golf club's own colours and livery, sized to the property and finished to feel part of the welcome. Consistent branding across every vehicle turns transport into part of the guest experience.",
              },
              {
                t: "Estate & grounds vehicles",
                b: "Utility and passenger buggies specified for the realities of a country estate: payload for tools and feed, weatherproofing for year-round use, towing and load space for grounds, gamekeeping and forestry, and a finish that suits the setting.",
              },
              {
                t: "Accessibility conversions",
                b: "Wheelchair-accessible and PRM-friendly specifications for venues, attractions and transport sites, engineered for comfortable, dignified passenger access and easy daily operation by your team.",
              },
              {
                t: "Film, set & event vehicles",
                b: "Picture vehicles, branded event buggies and production transport built to a creative brief, from reworked bodywork to full custom livery, ready for the camera or the crowd.",
              },
              {
                t: "Security & patrol builds",
                b: "Discreet patrol and security specifications for private land and large sites: quiet electric running for low-profile patrols, lighting and equipment mounts, and a layout built around the role.",
              },
              {
                t: "One-off commissions",
                b: "When none of the above quite describes it. We begin with the brief, agree a design and indicative cost, then build and finish the vehicle in Britain with progress shared throughout, backed by a 3-year warranty and 24-hour VIP call-out.",
              },
            ].map((u, i) => (
              <Reveal key={u.t} delay={i * 0.05}>
                <div className="border-t border-line-2 pt-6">
                  <h3 className="text-xl font-semibold text-ink">{u.t}</h3>
                  <p className="mt-3 leading-relaxed text-ink-soft">{u.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-ink py-20 md:py-28 text-white">
        <Container>
          <p className="eyebrow !text-champagne">The process</p>
          <h2 className="mt-3 text-3xl md:text-4xl text-white">From conversation to commission.</h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08} className="bg-ink p-8">
                <div className="numeral text-4xl text-champagne">{s.n}</div>
                <h3 className="mt-4 font-display text-xl text-white">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{s.b}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-12">
            <Button href="/request-a-quote" variant="light" size="lg">
              Start a commission <Arrow />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
