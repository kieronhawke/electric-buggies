import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { Button, Arrow } from "@/components/ui/button";
import { FaqAccordion } from "@/components/faq-accordion";
import { getFaqs, getSiteSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { faqPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata({
  title: "Ownership & Warranty",
  description:
    "Electric Buggies ownership, UK-wide delivery, a standard 3-year warranty, servicing and support. Read our ownership FAQs.",
  path: "/ownership",
});

export default async function OwnershipPage() {
  const [faqs, settings] = await Promise.all([getFaqs(), getSiteSettings()]);
  const pillars = [
    { title: `${settings.warrantyTerm} warranty`, body: "Drivetrain, battery and bodywork covered as standard, with extended cover available on request." },
    { title: "UK-wide delivery", body: "Delivered and commissioned the length of the country, coordinated with your team." },
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
