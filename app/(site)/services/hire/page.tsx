import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { FaqAccordion } from "@/components/faq-accordion";
import { LeadWizard } from "@/components/wizard/lead-wizard";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { getModels } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { faqPageJsonLd, serviceJsonLd } from "@/lib/structured-data";

const wrap = "mx-auto max-w-[1320px] px-[clamp(1.25rem,5vw,4.5rem)]";

// On-page SEO (ONPAGE-SPEC §7.1). Keyword-led title; conversion-focused page.
export const metadata: Metadata = buildMetadata({
  title: "Golf Buggy Hire UK | Electric Buggy Hire | Electric Buggies",
  description:
    "Electric and golf buggy hire across the UK and worldwide, for events, venues and seasonal needs. Fully serviced fleets with custom branding. Request a hire quote.",
  path: "/services/hire",
    ogImage: "/img/vehicles/eight.webp",
  absoluteTitle: true,
});

const useCases = [
  { t: "Weddings", b: "Move guests in comfort across the grounds and keep the day flowing, in silence." },
  { t: "Festivals & events", b: "Artist, crew and guest transport plus site operations, scaled to your dates." },
  { t: "Corporate & hospitality", b: "Branded shuttles for conferences, open days and client experiences." },
  { t: "Film & TV", b: "Unit transport and picture vehicles, quiet enough to run on or near set." },
  { t: "Sporting events", b: "Spectator, official and equipment transport across large venues." },
];
const faqs = [
  { q: "Can I hire just one buggy, or a whole fleet?", a: "Both. We supply anything from a single vehicle to a large fleet, with passenger and operations models to suit." },
  { q: "Do you provide drivers?", a: "We can provide trained drivers, or you can use your own. Tell us which when you enquire and we will tailor the quote." },
  { q: "How far in advance should I book?", a: "Earlier is better for peak dates, but tell us your dates and we will do our best to help even at short notice." },
  { q: "Where do you deliver hire fleets?", a: "UK-wide, and internationally for larger events. We handle delivery, set-up and collection." },
];

export default async function HirePage() {
  const models = await getModels();
  const lite = models.filter((m) => m.basePrice > 0).map((m) => ({ slug: m.slug, name: m.name, categoryLabel: m.categoryLabel, image: m.image }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({ name: "Electric and golf buggy hire", description: "Electric and golf buggy hire across the UK and worldwide for events, venues and seasonal needs, with fully serviced, custom-branded fleets.", areaServed: "United Kingdom", path: "/services/hire" })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(faqs.map((f) => ({ question: f.q, answer: f.a })))) }} />
      <PageHero
        eyebrow="Hire"
        title="Electric and golf buggy hire, one vehicle or a full fleet."
        lede="A cost-effective way to move people and run operations at events and venues, quietly and cleanly. Tell us what you need and we will build a hire quote around it."
        crumbs={[{ name: "Home", path: "/" }, { name: "Hire", path: "/services/hire" }]}
      />

      <section className="py-16 md:py-24">
        <div className={`${wrap} grid gap-12 lg:grid-cols-2`}>
          <Reveal>
            <p className="eyebrow">Why hire</p>
            <h2 className="mt-3 text-3xl md:text-4xl">Flexible fleets, without the capital outlay.</h2>
            <p className="mt-4 leading-relaxed text-ink-2">Hire gives you the right vehicles for the dates you need them, passenger carriages to move guests and utility models to run the site, all electric and near-silent. We deliver, set up and collect, and we can crew them or hand you the keys.</p>
          </Reveal>
          <Reveal delay={0.08}>
            <ul className="space-y-3">
              {["Single unit to full fleet", "Passenger and operations vehicles", "We provide drivers, or you do", "Branded to your event", "UK-wide and international delivery"].map((x) => (
                <li key={x} className="flex items-center gap-3 border-t border-line pt-3 text-ink"><span className="h-px w-5 bg-ink" />{x}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper py-16 md:py-24">
        <div className={wrap}>
          <SectionHeading eyebrow="Where it works" title="Built for the occasion." />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((u, i) => (
              <Reveal key={u.t} delay={i * 0.05}><div className="h-full rounded-lg border border-line bg-white p-7"><h3 className="text-xl">{u.t}</h3><p className="mt-2 text-ink-2">{u.b}</p></div></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="enquire" className="scroll-mt-24 py-16 md:py-24">
        <div className={wrap}>
          <SectionHeading eyebrow="Request a hire quote" title="Tell us about your event." lede="A few quick questions and we will come back with availability and a price." />
          <div className="mt-10 max-w-3xl"><LeadWizard flow="hire" models={lite} /></div>
        </div>
      </section>

      <section className="bg-paper py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-[clamp(1.25rem,5vw,4.5rem)]">
          <p className="eyebrow">Questions</p>
          <h2 className="mt-3 text-3xl md:text-4xl">Hire, frequently asked</h2>
          <div className="mt-10"><FaqAccordion faqs={faqs.map((f) => ({ question: f.q, answer: f.a, category: "Hire" }))} /></div>
        </div>
      </section>
      <MobileCtaBar primary={{ label: "Request hire quote", href: "/services/hire#enquire" }} secondary={{ label: "Call us", href: "/request-a-quote" }} />
    </>
  );
}
