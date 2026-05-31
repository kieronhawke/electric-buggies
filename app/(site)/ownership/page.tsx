import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { Button, Arrow } from "@/components/ui/button";
import { FaqAccordion } from "@/components/faq-accordion";
import { getFaqs, getSiteSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { faqPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata({
  title: "Owning an Electric Buggy | Warranty & Running Costs",
  description:
    "Owning an electric buggy: the 3-year warranty, 24-hour VIP call-out, charging, running costs versus petrol, servicing and finance. Free worldwide delivery. Request a quote.",
  path: "/ownership",
  ogImage: "/fleet/six-blue.png",
  absoluteTitle: true,
});

// Keyword-rich ownership topics (running costs, charging, finance) with links
// to the supporting guides, for depth, internal linking and topical authority.
const topics = [
  { h: "The 3-year warranty", b: "Every electric buggy is backed by a 3-year warranty as standard, covering the drivetrain, battery and bodywork, with extended cover available on request. It is the simplest sign of how long we expect these vehicles to serve you." },
  { h: "24-hour VIP call-out", b: "If something needs attention, our technical team responds within 24 hours, and our VIP service can come to your site rather than you bringing the vehicle to us. For a busy estate, club or resort, uptime is everything." },
  { h: "Charging and battery care", b: "Our electric buggies charge from a standard supply and are ready for a full day's use. Lithium batteries are low-maintenance and forgiving of partial charging; we set out simple care that keeps range and life at their best.", href: "/guides/lithium-vs-lead-acid-range-lifespan", link: "Lithium vs lead-acid batteries" },
  { h: "Running costs versus petrol", b: "Electricity per mile is a fraction of petrol, there are far fewer moving parts to service, and there is no fuel storage or engine upkeep. Over the years of ownership that adds up, which is why an electric buggy is usually the lower total cost of ownership.", href: "/guides/electric-vs-petrol-buggies-running-cost", link: "Electric vs petrol running costs" },
  { h: "Servicing, parts and support", b: "Scheduled servicing keeps a fleet dependable, and genuine parts and responsive support are available across the UK and worldwide. Service plans can be matched to how hard your vehicles work.", href: "/services/service-plan", link: "Service plans and call-out" },
  { h: "Finance and delivery", b: "We build to order and deliver free across the UK and worldwide, coordinating freight and import where needed. Finance and fleet options are available for business buyers; ask the team when you request a quote." },
];

export default async function OwnershipPage() {
  const [faqs, settings] = await Promise.all([getFaqs(), getSiteSettings()]);
  const pillars = [
    { title: `${settings.warrantyTerm} warranty`, body: "Drivetrain, battery and bodywork covered as standard, with extended cover available on request." },
    { title: "Free worldwide delivery", body: "Delivered and commissioned wherever you are, coordinated with your team, with freight and import handled for you." },
    { title: "Servicing & support", body: "Scheduled servicing and responsive support through our UK network, minimal by design." },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(faqs)) }} />
      <PageHero
        eyebrow="Ownership"
        title="Owned with the same ease it's driven."
        lede="Every Electric Buggies vehicle is engineered to ask little of you once it arrives, quiet, clean and supported across the UK."
        crumbs={[{ name: "Home", path: "/" }, { name: "Ownership", path: "/ownership" }]}
      />

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="h-full rounded-lg border border-line bg-white p-8">
                  <h2 className="text-2xl">{p.title}</h2>
                  <p className="mt-3 leading-relaxed text-ink-2">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Detailed ownership topics */}
      <section className="border-t border-line py-16 md:py-24">
        <Container>
          <Reveal>
            <p className="eyebrow">What ownership looks like</p>
            <h2 className="mt-3 max-w-[24ch] text-3xl md:text-4xl">Looked after, long after delivery.</h2>
          </Reveal>
          <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {topics.map((t, i) => (
              <Reveal key={t.h} delay={i * 0.05}>
                <div className="border-t border-line pt-6">
                  <h3 className="text-xl">{t.h}</h3>
                  <p className="mt-3 leading-relaxed text-ink-2">{t.b}</p>
                  {t.href && (
                    <Link href={t.href} className="mt-3 inline-block text-[.82rem] font-semibold uppercase tracking-[.06em] underline-offset-4 hover:underline">
                      {t.link} →
                    </Link>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper py-16 md:py-24">
        <Container size="narrow">
          <Reveal>
            <p className="eyebrow">Questions</p>
            <h2 className="mt-3 text-3xl md:text-4xl">Ownership FAQs</h2>
          </Reveal>
          <div className="mt-10"><FaqAccordion faqs={faqs} /></div>
          <Reveal className="mt-12 text-center">
            <p className="text-ink-2">Still have a question?</p>
            <div className="mt-5 flex justify-center">
              <Button href="/request-a-quote" size="lg">Contact the team <Arrow /></Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
