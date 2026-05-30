import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { Button, Arrow } from "@/components/ui/button";
import { FaqAccordion } from "@/components/faq-accordion";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { buildMetadata } from "@/lib/seo";
import { faqPageJsonLd, serviceJsonLd } from "@/lib/structured-data";

const wrap = "mx-auto max-w-[1320px] px-[clamp(1.25rem,5vw,4.5rem)]";
export const metadata: Metadata = buildMetadata({
  title: "Custom Shuttle Service",
  description:
    "A bespoke electric shuttle solution for your venue or private land. Move guests in comfort with a branded VIP service or an accessibility function, drivers provided or your own.",
  path: "/services/shuttle",
    ogImage: "/img/vehicles/eight.webp",
});

const faqs = [
  { q: "Who drives the shuttles?", a: "We can crew the service with trained drivers, or you can run it with your own team. We will recommend what suits your venue." },
  { q: "Can guests pay per ride?", a: "Yes. We can set up a paid per-ride model so the service runs at minimal cost to you, or a complimentary branded service as part of the guest experience." },
  { q: "Is it suitable for accessibility?", a: "Yes. A shuttle can be designed around accessibility, with wheelchair-friendly vehicles and assisted boarding." },
];

export default function ShuttlePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({ name: "Electric shuttle buggies for venues", description: "A bespoke electric shuttle solution for venues, campuses and resorts: branded fleets, drivers provided or your own.", areaServed: "United Kingdom", path: "/services/shuttle" })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(faqs.map((f) => ({ question: f.q, answer: f.a })))) }} />
      <PageHero eyebrow="Service" title="A shuttle service, designed around your venue."
        lede="We design the fleet, the routes and the experience to move guests smoothly across private land and venues, as an all-VIP touch or an accessibility function."
        crumbs={[{ name: "Home", path: "/" }, { name: "Services", path: "/services/shuttle" }, { name: "Custom Shuttle", path: "/services/shuttle" }]} />

      <section className="py-16 md:py-24">
        <div className={`${wrap} grid gap-8 md:grid-cols-2`}>
          <Reveal><div className="h-full rounded-lg border border-line bg-white p-8"><p className="eyebrow">Option one</p><h2 className="mt-2 text-2xl">Complimentary, branded</h2><p className="mt-3 text-ink-2">A polished, branded shuttle as part of your guest experience, included for visitors and finished in your livery.</p></div></Reveal>
          <Reveal delay={0.08}><div className="h-full rounded-lg border border-line bg-white p-8"><p className="eyebrow">Option two</p><h2 className="mt-2 text-2xl">Paid per ride</h2><p className="mt-3 text-ink-2">Guests pay a small fare per ride, so the service can run at minimal cost to your business while still feeling premium.</p></div></Reveal>
        </div>
      </section>

      <section className="bg-paper py-16 md:py-24">
        <div className={wrap}>
          <SectionHeading eyebrow="How it works" title="From brief to moving guests." />
          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {[["01", "We map your site", "Routes, pick-up points and demand."], ["02", "We spec the fleet", "Vehicles, capacity, branding, accessibility."], ["03", "Drivers, your call", "We provide trained drivers or train yours."], ["04", "We run or hand over", "Operate it for you, or deliver and support."]].map(([n, t, b]) => (
              <Reveal key={n} className="bg-white p-7"><div className="text-2xl font-semibold text-ink-2">{n}</div><h3 className="mt-3 text-lg">{t}</h3><p className="mt-2 text-sm text-ink-2">{b}</p></Reveal>
            ))}
          </div>
          <div className="mt-10"><Button href="/request-a-quote" size="lg">Enquire about a shuttle <Arrow /></Button></div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-[clamp(1.25rem,5vw,4.5rem)]">
          <p className="eyebrow">Questions</p><h2 className="mt-3 text-3xl md:text-4xl">Shuttle service, frequently asked</h2>
          <div className="mt-10"><FaqAccordion faqs={faqs.map((f) => ({ question: f.q, answer: f.a, category: "Shuttle" }))} /></div>
        </div>
      </section>
      <MobileCtaBar primary={{ label: "Enquire", href: "/request-a-quote" }} secondary={{ label: "VIP service", href: "/services/vip-chauffeur" }} />
    </>
  );
}
