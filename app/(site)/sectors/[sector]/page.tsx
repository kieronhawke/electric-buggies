import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { Media } from "@/components/media";
import { Button, Arrow } from "@/components/ui/button";
import { ModelCard } from "@/components/model-card";
import { FaqAccordion } from "@/components/faq-accordion";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { sectors as seedSectors, sectorBySlug } from "@/lib/data/sectors";
import { getSector, getModels, pricesVisible } from "@/lib/content";
import { postBySlug } from "@/lib/data/blog";
import { locations } from "@/lib/data/locations";
import { imagery } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import { serviceJsonLd, faqPageJsonLd, breadcrumbJsonLd } from "@/lib/structured-data";

const wrap = "mx-auto max-w-[1320px] px-[clamp(1.25rem,5vw,4.5rem)]";

export function generateStaticParams() {
  return seedSectors.map((s) => ({ sector: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ sector: string }> }): Promise<Metadata> {
  const { sector } = await params;
  const s = sectorBySlug(sector);
  if (!s) return {};
  return buildMetadata({ title: `Electric Buggies for ${s.name}`, description: s.metaDescription, path: `/sectors/${s.slug}`, absoluteTitle: true });
}

export default async function SectorPage({ params }: { params: Promise<{ sector: string }> }) {
  const { sector } = await params;
  const s = await getSector(sector);
  if (!s) notFound();

  const allModels = await getModels();
  const showPrice = await pricesVisible();
  const fleet = s.recommendedModels.map((slug) => allModels.find((m) => m.slug === slug)).filter((m) => m !== undefined);
  const relatedPosts = s.relatedPosts.map(postBySlug).filter((p) => p !== undefined);
  const relatedLocations = locations.filter((l) => l.relatedSectors.includes(s.slug)).slice(0, 3);
  const faqItems = s.faqs.map((f) => ({ question: f.q, answer: f.a, category: "Sector" }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({ name: `Electric buggies for ${s.name}`, description: s.intro, areaServed: "United Kingdom", path: `/sectors/${s.slug}` })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(s.faqs.map((f) => ({ question: f.q, answer: f.a })))) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Sectors", path: "/sectors" }, { name: s.name, path: `/sectors/${s.slug}` }])) }} />

      {/* Hero */}
      <section className="relative isolate flex min-h-[64svh] items-end text-white">
        <Media src={imagery.sectors[s.slug]} rounded={false} priority className="absolute inset-0 -z-10" />
        <div className={`${wrap} w-full pb-12 pt-[calc(var(--header-h)+3rem)]`}>
          <nav aria-label="Breadcrumb" className="mb-5 text-[.7rem] uppercase tracking-[.14em] text-white/70">
            <Link href="/sectors" className="hover:text-white">Sectors</Link> <span className="text-white/40">/</span> {s.name}
          </nav>
          <h1 className="max-w-[18ch] text-[clamp(2.4rem,5.4vw,4.4rem)] text-white">{s.name}</h1>
          <p className="mt-4 max-w-[52ch] text-lg font-light text-white/85">{s.tagline}</p>
        </div>
      </section>

      {/* Problem → solution */}
      <section className="py-16 md:py-24">
        <div className={`${wrap} grid gap-12 lg:grid-cols-2`}>
          <Reveal>
            <p className="eyebrow">The challenge</p>
            <p className="mt-4 text-[clamp(1.2rem,2vw,1.55rem)] leading-[1.5] tracking-[-0.01em]">{s.problem}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="eyebrow">What we provide</p>
            <p className="mt-4 leading-relaxed text-ink-2">{s.intro}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {s.useCases.map((u) => <li key={u} className="rounded-full border border-line-2 px-4 py-1.5 text-sm text-ink-2">{u}</li>)}
            </ul>
          </Reveal>
        </div>
        {/* Detailed sections grid (scales with the richer content) */}
        <div className={`${wrap} mt-14`}>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {s.sections.map((sec, i) => (
              <Reveal key={sec.heading} delay={i * 0.06}>
                <div className="border-t border-line pt-6">
                  <h2 className="text-xl">{sec.heading}</h2>
                  <p className="mt-3 leading-relaxed text-ink-2">{sec.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* In-context photograph (second image) */}
      <section className="px-[clamp(1.25rem,5vw,4.5rem)] pb-4">
        <div className="mx-auto max-w-[1320px]">
          <Reveal>
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg sm:aspect-[16/7]">
              <Media src={imagery.sectorSecondary?.[s.slug] ?? imagery.sectors[s.slug]} rounded={false} className="absolute inset-0" />
              <div className="absolute bottom-0 left-0 p-7 md:p-10">
                <p className="max-w-[34ch] text-[clamp(1.1rem,2.2vw,1.7rem)] font-light leading-snug text-white">Premium electric buggies for {s.name.toLowerCase()}.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Recommended fleet */}
      <section className="bg-paper py-16 md:py-24">
        <div className={wrap}>
          <h2 className="text-3xl md:text-4xl">Recommended for {s.name.toLowerCase()}</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fleet.map((m) => <ModelCard key={m!.slug} model={m!} showPrice={showPrice} />)}
          </div>
          <div className="mt-10"><Button href="/request-a-quote" size="lg">Request a quote <Arrow /></Button></div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-[clamp(1.25rem,5vw,4.5rem)]">
          <p className="eyebrow">Questions</p>
          <h2 className="mt-3 text-3xl md:text-4xl">{s.name}, frequently asked</h2>
          <div className="mt-10"><FaqAccordion faqs={faqItems} /></div>
        </div>
      </section>

      {/* Internal links */}
      {(relatedPosts.length > 0 || relatedLocations.length > 0) && (
        <section className="bg-paper py-16 md:py-24">
          <div className={`${wrap} grid gap-12 md:grid-cols-2`}>
            {relatedPosts.length > 0 && (
              <div>
                <p className="eyebrow">From the Guides</p>
                <ul className="mt-5 space-y-3">
                  {relatedPosts.map((p) => (
                    <li key={p!.slug}><Link href={`/guides/${p!.slug}`} className="text-lg hover:underline hover:underline-offset-4">{p!.title}</Link></li>
                  ))}
                </ul>
              </div>
            )}
            {relatedLocations.length > 0 && (
              <div>
                <p className="eyebrow">Where we deliver</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {relatedLocations.map((l) => (
                    <Link key={l.slug} href={`/locations/${l.slug}`} className="rounded-full border border-line-2 bg-white px-5 py-2 text-sm text-ink-2 transition-colors hover:border-ink hover:text-ink">{l.name}</Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
      <MobileCtaBar />
    </>
  );
}
