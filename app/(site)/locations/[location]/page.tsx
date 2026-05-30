import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { Media } from "@/components/media";
import { Button, Arrow } from "@/components/ui/button";
import { ModelCard } from "@/components/model-card";
import { FaqAccordion } from "@/components/faq-accordion";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { locations as seedLocations, locationBySlug } from "@/lib/data/locations";
import { getLocation, getModels } from "@/lib/content";
import { sectorBySlug } from "@/lib/data/sectors";
import { imagery } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import { serviceJsonLd, faqPageJsonLd, breadcrumbJsonLd } from "@/lib/structured-data";

const wrap = "mx-auto max-w-[1320px] px-[clamp(1.25rem,5vw,4.5rem)]";

export function generateStaticParams() {
  return seedLocations.map((l) => ({ location: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ location: string }> }): Promise<Metadata> {
  const { location } = await params;
  const l = locationBySlug(location);
  if (!l) return {};
  return buildMetadata({
    title: `Electric & Golf Buggies ${l.name} | Premium Delivery`,
    description: l.metaDescription,
    path: `/locations/${l.slug}`,
    absoluteTitle: true,
  });
}

export default async function LocationPage({ params }: { params: Promise<{ location: string }> }) {
  const { location } = await params;
  const l = await getLocation(location);
  if (!l) notFound();

  const allModels = await getModels();
  const fleet = l.recommendedModels.map((slug) => allModels.find((m) => m.slug === slug)).filter((m) => m !== undefined);
  const sectors = l.relatedSectors.map(sectorBySlug).filter((s) => s !== undefined);
  const faqItems = l.faqs.map((f) => ({ question: f.q, answer: f.a, category: "Location" }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({ name: `Electric buggies in ${l.name}`, description: l.intro, areaServed: l.name, path: `/locations/${l.slug}` })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(l.faqs.map((f) => ({ question: f.q, answer: f.a })))) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Locations", path: "/locations" }, { name: l.name, path: `/locations/${l.slug}` }])) }} />

      {/* Localized hero */}
      <section className="relative isolate flex min-h-[68svh] items-end text-white">
        <Media src={l.hero ?? imagery.locations[l.slug] ?? imagery.heroEstate} rounded={false} priority className="absolute inset-0 -z-10" />
        <div className={`${wrap} w-full pb-14 pt-[calc(var(--header-h)+3rem)]`}>
          <Reveal>
            <nav aria-label="Breadcrumb" className="mb-5 text-[.7rem] uppercase tracking-[.14em] text-white/70">
              <Link href="/locations" className="hover:text-white">Locations</Link> <span className="text-white/40">/</span> {l.name}
            </nav>
            <p className="eyebrow !text-white/80">{l.region}</p>
            <h1 className="mt-3 max-w-[18ch] text-[clamp(2.4rem,5.4vw,4.4rem)] text-white">{l.name}</h1>
            <p className="mt-4 max-w-[52ch] text-lg font-light text-white/85">{l.tagline}</p>
          </Reveal>
        </div>
      </section>

      {/* Intro + sections */}
      <section className="py-16 md:py-24">
        <div className={wrap}>
          <Reveal><p className="max-w-[68ch] text-[clamp(1.2rem,2vw,1.6rem)] leading-[1.5] tracking-[-0.01em]">{l.intro}</p></Reveal>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {l.sections.map((s, i) => (
              <Reveal key={s.heading} delay={i * 0.08}>
                <div className="border-t border-line pt-6">
                  <h2 className="text-xl">{s.heading}</h2>
                  <p className="mt-3 leading-relaxed text-ink-2">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12">
            <p className="eyebrow">Typical uses in {l.name}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {l.useCases.map((u) => (
                <li key={u} className="rounded-full border border-line-2 px-4 py-1.5 text-sm text-ink-2">{u}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* In-context photograph (second image) */}
      <section className="px-[clamp(1.25rem,5vw,4.5rem)] pb-4">
        <div className="mx-auto max-w-[1320px]">
          <Reveal>
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg sm:aspect-[16/7]">
              <Media src={imagery.locationSecondary?.[l.slug] ?? imagery.locations[l.slug] ?? imagery.heroEstate} rounded={false} className="absolute inset-0" />
              <div className="absolute bottom-0 left-0 p-7 md:p-10">
                <p className="max-w-[34ch] text-[clamp(1.1rem,2.2vw,1.7rem)] font-light leading-snug text-white">Premium electric buggies, built in Britain and delivered to {l.name}.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Fleet */}
      <section className="bg-paper py-16 md:py-24">
        <div className={wrap}>
          <h2 className="text-3xl md:text-4xl">The fleet for {l.name}</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fleet.map((m) => <ModelCard key={m!.slug} model={m!} />)}
          </div>
        </div>
      </section>

      {/* Delivery note */}
      <section className="py-16 md:py-24">
        <div className={`${wrap} grid gap-10 md:grid-cols-[1fr_1.4fr]`}>
          <Reveal><h2 className="text-3xl md:text-4xl">Delivery &amp; shipping</h2></Reveal>
          <Reveal delay={0.08}>
            <p className="text-lg leading-relaxed text-ink-2">{l.delivery}</p>
            {l.currencyNote && <p className="mt-4 text-sm text-ink-2">{l.currencyNote}</p>}
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-paper py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-[clamp(1.25rem,5vw,4.5rem)]">
          <p className="eyebrow">Questions</p>
          <h2 className="mt-3 text-3xl md:text-4xl">{l.name}, frequently asked</h2>
          <div className="mt-10"><FaqAccordion faqs={faqItems} /></div>
          {sectors.length > 0 && (
            <div className="mt-12">
              <p className="eyebrow">Related sectors</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {sectors.map((s) => (
                  <Link key={s!.slug} href={`/sectors/${s!.slug}`} className="rounded-full border border-line-2 bg-white px-5 py-2 text-sm text-ink-2 transition-colors hover:border-ink hover:text-ink">{s!.name}</Link>
                ))}
              </div>
            </div>
          )}
          <div className="mt-12"><Button href="/request-a-quote" size="lg">Enquire about {l.name} <Arrow /></Button></div>
        </div>
      </section>
      <MobileCtaBar />
    </>
  );
}
