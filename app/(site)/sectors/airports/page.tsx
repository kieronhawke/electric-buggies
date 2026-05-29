import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { FaqAccordion } from "@/components/faq-accordion";
import { ModelCard } from "@/components/model-card";
import { LeadWizard } from "@/components/wizard/lead-wizard";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { getModels } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { serviceJsonLd, faqPageJsonLd } from "@/lib/structured-data";

const wrap = "mx-auto max-w-[1320px] px-[clamp(1.25rem,5vw,4.5rem)]";

export const metadata: Metadata = buildMetadata({
  title: "Airport & Airside Electric Vehicles",
  description:
    "Electric vehicles for airports: passenger transfer, crew transport and accessible PRM assistance with wheelchair-friendly, ramp-equipped vehicles. Compliant, dignified, reliable fleets.",
  path: "/sectors/airports",
});

const sections = [
  { h: "Passenger transfer", b: "Move passengers between terminals, gates, lounges and aircraft stands quietly and on time, with comfortable multi-seat carriages that keep a busy operation flowing." },
  { h: "Crew transport", b: "Reliable airside transport for flight and ground crews, built for repeated daily use and quick turnarounds." },
  { h: "Accessible PRM assistance", b: "Passengers of Reduced Mobility deserve a dignified, dependable service. We supply wheelchair-accessible, ramp-equipped and assisted-boarding vehicles so PRM assistance is met to a high standard, every time." },
];
const faqs = [
  { q: "Do you supply accessible vehicles for PRM passengers?", a: "Yes. We supply wheelchair-accessible and ramp-equipped vehicles with assisted boarding, specified for dignified, compliant Passengers of Reduced Mobility assistance." },
  { q: "Can the vehicles run airside all day?", a: "Yes, they are specified for repeated daily airside use, with charging planned around your shift patterns so a vehicle is always ready." },
  { q: "Will you beat our current supplier on price?", a: "We will aim to beat any genuine like-for-like quote. Send us your requirement and current pricing and we will do our best to better it." },
];

export default async function AirportsPage() {
  const models = await getModels();
  const lite = models.filter((m) => m.basePrice > 0).map((m) => ({ slug: m.slug, name: m.name, categoryLabel: m.categoryLabel, image: m.image }));
  const fleet = ["the-eight", "the-six", "the-four"].map((s) => models.find((m) => m.slug === s)).filter((m) => m !== undefined);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({ name: "Airport & airside electric vehicles", description: "Passenger transfer, crew transport and accessible PRM assistance fleets for airports.", areaServed: "United Kingdom", path: "/sectors/airports" })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(faqs.map((f) => ({ question: f.q, answer: f.a })))) }} />
      <PageHero
        eyebrow="Sector, Airports"
        title="Airside transport, including accessible PRM fleets."
        lede="Passenger transfer, crew transport and dignified Passengers of Reduced Mobility assistance, with adapted, wheelchair-accessible vehicles. We will aim to beat any genuine like-for-like quote."
        crumbs={[{ name: "Home", path: "/" }, { name: "Sectors", path: "/sectors" }, { name: "Airports", path: "/sectors/airports" }]}
      />

      <section className="py-16 md:py-24">
        <div className={`${wrap} grid gap-10 md:grid-cols-3`}>
          {sections.map((s, i) => (
            <Reveal key={s.h} delay={i * 0.08}><div className="border-t border-line pt-6"><h2 className="text-xl">{s.h}</h2><p className="mt-3 leading-relaxed text-ink-2">{s.b}</p></div></Reveal>
          ))}
        </div>
      </section>

      <section className="bg-paper py-16 md:py-24">
        <div className={wrap}>
          <h2 className="text-3xl md:text-4xl">Recommended for airports</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{fleet.map((m) => <ModelCard key={m!.slug} model={m!} />)}</div>
        </div>
      </section>

      <section id="airport-quote" className="scroll-mt-24 py-16 md:py-24">
        <div className={wrap}>
          <SectionHeading eyebrow="Get an airport quote" title="A few quick questions." lede="Tell us the vehicles, numbers and location and we will respond fast." />
          <div className="mt-10 max-w-3xl"><LeadWizard flow="airport" models={lite} /></div>
        </div>
      </section>

      <section className="bg-paper py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-[clamp(1.25rem,5vw,4.5rem)]">
          <p className="eyebrow">Questions</p>
          <h2 className="mt-3 text-3xl md:text-4xl">Airports, frequently asked</h2>
          <div className="mt-10"><FaqAccordion faqs={faqs.map((f) => ({ question: f.q, answer: f.a, category: "Airports" }))} /></div>
        </div>
      </section>
      <MobileCtaBar primary={{ label: "Get airport quote", href: "/sectors/airports#airport-quote" }} secondary={{ label: "All sectors", href: "/sectors" }} />
    </>
  );
}
