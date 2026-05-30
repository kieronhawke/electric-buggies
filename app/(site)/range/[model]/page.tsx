import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { Button, Arrow } from "@/components/ui/button";
import { VehicleRender } from "@/components/vehicle-render";
import { ModelGallery } from "@/components/model-gallery";
import { TechDrawer } from "@/components/tech-drawer";
import { ModelCard } from "@/components/model-card";
import { models as seedModels, modelBySlug } from "@/lib/data/models";
import { MODEL_SEO } from "@/lib/data/model-seo";
import { getModel, getModels } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { productJsonLd, breadcrumbJsonLd } from "@/lib/structured-data";
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "The Range", path: "/range" },
              { name: model.name, path: `/range/${model.slug}` },
            ]),
          ),
        }}
      />

      {/* Editorial hero */}
      <section className="bg-gradient-to-b from-paper-2 to-paper pt-32 md:pt-40">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-[0.7rem] uppercase tracking-[0.14em] text-ink-soft">
              <li><Link href="/" className="hover:text-ink">Home</Link></li>
              <li className="text-hairline">/</li>
              <li><Link href="/range" className="hover:text-ink">The Range</Link></li>
              <li className="text-hairline">/</li>
              <li className="text-ink">{model.name}</li>
            </ol>
          </nav>

          <div className="grid items-center gap-10 pb-12 lg:grid-cols-[1fr_1.1fr]">
            <Reveal>
              <p className="eyebrow">{model.categoryLabel}</p>
              <h1 className="mt-4 leading-[0.98] text-ink">
                <span className="block text-[clamp(2.75rem,6vw,5rem)]">{model.name}</span>
                {seo && (
                  <span className="mt-3 block font-display text-[clamp(1.1rem,2.4vw,1.7rem)] text-ink-soft">
                    {seo.descriptor}
                  </span>
                )}
              </h1>
              <p className="mt-4 font-display text-2xl italic text-champagne-deep">
                {model.tagline}
              </p>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
                {model.summary}
              </p>
              <div className="mt-8 flex items-center gap-8">
                {!isBespoke ? (
                  <div>
                    <span className="eyebrow block">Indicative from</span>
                    <span className="font-display text-3xl text-ink">{gbp(model.basePrice)}</span>
                  </div>
                ) : (
                  <span className="font-display text-3xl text-ink">Made to order</span>
                )}
                <TechDrawer specs={model.specs} modelName={model.name} />
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button href={isBespoke ? "/bespoke" : `/configure/${model.slug}`} size="lg">
                  {isBespoke ? "Start a Commission" : "Configure this Model"} <Arrow />
                </Button>
                <Button href="/request-a-quote" variant="outline" size="lg">
                  Request a Quote
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="relative aspect-[4/3]">
                {model.image ? (
                  <Image
                    src={model.image}
                    alt={`${model.name} electric buggy, ${model.categoryLabel.toLowerCase()}`}
                    fill
                    priority
                    sizes="(max-width:1024px) 100vw, 55vw"
                    className="object-contain drop-shadow-[0_40px_60px_rgba(22,21,15,0.18)]"
                  />
                ) : (
                  <VehicleRender colour={model.plate} roof="hard-roof" wheels="noble" seats={seatCount(model.category)} title={`${model.name}`} className="drop-shadow-[0_40px_60px_rgba(22,21,15,0.18)]" />
                )}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Spec table */}
      <section className="border-y border-hairline bg-white py-16 md:py-20">
        <Container>
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
                <div className="border-b border-hairline py-6">
                  <div className="eyebrow">{label}</div>
                  <div className="mt-2 font-display text-2xl text-ink">{value}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Editorial body + gallery placeholder */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-6">
              {model.body.map((p, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <p className="text-lg leading-relaxed text-ink-soft">{p}</p>
                </Reveal>
              ))}
              <Reveal>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {model.highlights.map((h) => (
                    <li
                      key={h}
                      className="rounded-full border border-hairline bg-paper-2 px-4 py-1.5 text-sm text-ink-soft"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {/* Gallery with zoom lightbox (real photography swaps in via CMS) */}
            <Reveal delay={0.1}>
              <ModelGallery plate={model.plate} seats={seatCount(model.category)} name={model.name} />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Related models */}
      <section className="bg-paper-2 py-16 md:py-24">
        <Container>
          <h2 className="text-3xl text-ink md:text-4xl">Related models</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((m) => (
              <ModelCard key={m.slug} model={m} />
            ))}
          </div>
        </Container>
      </section>

      {/* Sticky enquire bar */}
      <div className="sticky bottom-0 z-40 border-t border-hairline bg-white/95 backdrop-blur-md">
        <Container className="flex items-center justify-between py-4">
          <div className="hidden sm:block">
            <span className="font-display text-lg text-ink">{model.name}</span>
            {!isBespoke && (
              <span className="ml-3 text-sm text-ink-soft">from {gbp(model.basePrice)}</span>
            )}
          </div>
          <div className="flex w-full gap-3 sm:w-auto">
            <Button
              href={isBespoke ? "/bespoke" : `/configure/${model.slug}`}
              className="flex-1 sm:flex-none"
            >
              {isBespoke ? "Commission" : "Configure"} <Arrow />
            </Button>
            <Button href="/request-a-quote" variant="outline" className="flex-1 sm:flex-none">
              Enquire
            </Button>
          </div>
        </Container>
      </div>
    </>
  );
}
