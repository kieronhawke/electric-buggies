import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { Button, Arrow } from "@/components/ui/button";
import { VehicleRender } from "@/components/vehicle-render";
import { ProductHero } from "@/components/product-hero";
import { StickyModelBar } from "@/components/sticky-model-bar";
import { ModelGallery } from "@/components/model-gallery";
import { ModelCard } from "@/components/model-card";
import { models as seedModels, modelBySlug } from "@/lib/data/models";
import { MODEL_SEO } from "@/lib/data/model-seo";
import { modelFaqs } from "@/lib/data/model-faqs";
import { FaqAccordion } from "@/components/faq-accordion";
import { getModel, getModels, pricesVisible } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { productJsonLd, breadcrumbJsonLd, faqPageJsonLd } from "@/lib/structured-data";
import { gbp } from "@/lib/utils";

export function generateStaticParams() {
  return seedModels.map((m) => ({ model: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ model: string }>;
}): Promise<Metadata> {
  const { model: slug } = await params;
  const model = modelBySlug(slug);
  if (!model) return {};
  const seo = MODEL_SEO[model.slug];
  return buildMetadata({
    // Keyword-led, name-independent: `{keyword} | {name} | Electric Buggies`.
    title: seo ? `${seo.keyword} | ${model.name} | Electric Buggies` : model.name,
    description: seo?.description ?? model.summary,
    path: `/range/${model.slug}`,
    absoluteTitle: !!seo,
  });
}

const seatCount = (cat: string) => (cat === "2-seater" || cat === "utility" ? 2 : 4);

export default async function ModelPage({
  params,
}: {
  params: Promise<{ model: string }>;
}) {
  const { model: slug } = await params;
  const model = await getModel(slug);
  if (!model) notFound();
  const seo = MODEL_SEO[model.slug];
  const faqs = modelFaqs(model);
  const showPrice = await pricesVisible();

  const related = (await getModels()).filter((m) => m.slug !== model.slug).slice(0, 3);
  const isBespoke = model.basePrice === 0;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(model)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(faqs.map((f) => ({ question: f.q, answer: f.a })))) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Vehicles", path: "/range" },
              { name: model.name, path: `/range/${model.slug}` },
            ]),
          ),
        }}
      />

      {/* MOBILE: new Tesla-style hero (big image, name, spec strip, two buttons) */}
      <div className="lg:hidden">
        <ProductHero model={model} />
      </div>

      {/* DESKTOP: original editorial 2-column layout */}
      <section className="hidden bg-gradient-to-b from-paper-2 to-paper pt-[calc(var(--header-h)+2.5rem)] lg:block">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-[0.7rem] uppercase tracking-[0.14em] text-ink-2">
              <li><Link href="/" className="hover:text-ink">Home</Link></li>
              <li className="text-line-2">/</li>
              <li><Link href="/range" className="hover:text-ink">Vehicles</Link></li>
              <li className="text-line-2">/</li>
              <li className="text-ink">{model.name}</li>
            </ol>
          </nav>
          <div className="grid items-center gap-10 pb-14 lg:grid-cols-[1fr_1.1fr]">
            <Reveal>
              <p className="eyebrow">{model.categoryLabel}</p>
              <h1 className="mt-4 text-[clamp(2.75rem,4.2vw,4.2rem)] font-light leading-[1.0] tracking-[-0.02em] text-ink">{model.name}</h1>
              {seo?.descriptor && <p className="mt-3 text-[clamp(1.1rem,1.6vw,1.55rem)] text-ink-2">{seo.descriptor}</p>}
              <p className="mt-4 text-2xl italic text-ink">{model.tagline}</p>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-2">{model.summary}</p>
              {showPrice && !isBespoke ? (
                <div className="mt-8">
                  <span className="eyebrow block">Indicative from</span>
                  <span className="text-3xl font-semibold text-ink">{gbp(model.basePrice)}</span>
                </div>
              ) : (
                <p className="mt-8 max-w-md text-[.95rem] text-ink-2">
                  Pricing depends on configuration. We aim to offer the best vehicles at the most competitive, affordable rate, confirmed on your tailored quote.
                </p>
              )}
              <div className="mt-8 flex flex-wrap gap-4">
                <Button href="/request-a-quote" size="lg">Get a Quote <Arrow /></Button>
                <Button href="#details" variant="outline" size="lg">Learn More</Button>
              </div>
              <p className="mt-4 text-[.8rem]">
                <Link href="#details" className="font-semibold uppercase tracking-[.08em] text-ink-2 underline-offset-4 hover:text-ink hover:underline">View technical data</Link>
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="relative aspect-[4/3]">
                {model.image ? (
                  <Image
                    src={model.image}
                    alt={`${model.name} electric buggy, ${model.categoryLabel.toLowerCase()}`}
                    fill
                    sizes="55vw"
                    className="object-contain drop-shadow-[0_40px_60px_rgba(10,10,11,0.16)]"
                  />
                ) : (
                  <VehicleRender colour={model.plate} roof="hard-roof" wheels="noble" seats={seatCount(model.category)} title={model.name} className="drop-shadow-[0_40px_60px_rgba(10,10,11,0.16)]" />
                )}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Technical data (inline section, anchored). Shown on every breakpoint. */}
      <section id="details" className="scroll-mt-[var(--header-h)] border-y border-line bg-white py-16 md:py-20">
        <Container>
          <h2 className="sr-only">{model.name} technical data</h2>
          <div className="grid gap-x-12 gap-y-px overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries({
              Seats: model.specs.seats,
              Range: model.specs.range,
              Battery: model.specs.battery,
              "Top speed": model.specs.topSpeed,
              Dimensions: model.specs.dimensions,
              "Charge time": model.specs.charge,
            }).map(([label, value], i) => (
              <Reveal key={label} delay={i * 0.04}>
                <div className="border-b border-line py-6">
                  <div className="eyebrow">{label}</div>
                  <div className="mt-2 text-2xl text-ink">{value}</div>
                </div>
              </Reveal>
            ))}
          </div>
          {!showPrice && (
            <p className="mt-8 max-w-2xl text-[.92rem] text-ink-2">
              Pricing depends on configuration. We aim to offer the best vehicles at the most competitive, affordable rate, confirmed on your tailored quote.
            </p>
          )}
        </Container>
      </section>

      {/* Editorial body + gallery */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-6">
              {model.body.map((p, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <p className="text-lg leading-relaxed text-ink-2">{p}</p>
                </Reveal>
              ))}
              <Reveal>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {model.highlights.map((h) => (
                    <li
                      key={h}
                      className="rounded-full border border-line bg-paper-2 px-4 py-1.5 text-sm text-ink-2"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <ModelGallery plate={model.plate} seats={seatCount(model.category)} name={model.name} />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Detailed sections (premium depth + natural keyword coverage) */}
      {model.sections && model.sections.length > 0 && (
        <section className="border-t border-line bg-paper-2 py-16 md:py-24">
          <Container>
            <h2 className="sr-only">About the {model.name}</h2>
            <div className="grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
              {model.sections.map((s, i) => (
                <Reveal key={s.heading} delay={i * 0.05}>
                  <div className="border-t border-line pt-6">
                    <h3 className="text-xl text-ink">{s.heading}</h3>
                    <p className="mt-3 leading-relaxed text-ink-2">{s.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* FAQ */}
      <section className="border-t border-line py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="eyebrow">Questions</p>
            <h2 className="mt-3 text-3xl text-ink md:text-4xl">The {model.name}, frequently asked</h2>
            <div className="mt-10">
              <FaqAccordion faqs={faqs.map((f) => ({ question: f.q, answer: f.a, category: model.name }))} />
            </div>
          </div>
        </Container>
      </section>

      {/* Repeated action: the two buttons at the bottom of the page */}
      <section className="border-t border-line py-14 md:py-16">
        <Container>
          <div className="mx-auto flex max-w-xl flex-col items-stretch justify-center gap-3 text-center sm:flex-row sm:items-center">
            <Button href="/request-a-quote" size="lg">Get a Quote <Arrow /></Button>
            <Button href="#details" variant="outline" size="lg">Learn More</Button>
          </div>
        </Container>
      </section>

      {/* Related models */}
      <section className="bg-paper-2 py-16 md:py-24">
        <Container>
          <h2 className="text-3xl text-ink md:text-4xl">Related models</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((m) => (
              <ModelCard key={m.slug} model={m} showPrice={showPrice} />
            ))}
          </div>
        </Container>
      </section>

      {/* Persistent quote-led bottom bar */}
      <StickyModelBar
        name={model.name}
        priceLabel={showPrice && !isBespoke ? `From ${gbp(model.basePrice)}` : null}
        specs={
          isBespoke
            ? undefined
            : [
                { label: "Seats", value: model.specs.seats.replace(/\s*seats?$/i, "") },
                { label: "Range", value: model.specs.range },
                { label: "Top speed", value: model.specs.topSpeed },
              ]
        }
      />
    </>
  );
}
