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
                land. If it can be engineered, it can be a Electric Buggies.
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
