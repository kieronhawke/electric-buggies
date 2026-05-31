import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { ProductHero } from "@/components/product-hero";
import { StickyModelBar } from "@/components/sticky-model-bar";
import { ModelGallery } from "@/components/model-gallery";
import { ModelCard } from "@/components/model-card";
import { models as seedModels, modelBySlug } from "@/lib/data/models";
import { MODEL_SEO } from "@/lib/data/model-seo";
import { modelFaqs } from "@/lib/data/model-faqs";
import { FaqAccordion } from "@/components/faq-accordion";
import { getModel, getModels } from "@/lib/content";
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
  const faqs = modelFaqs(model);

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
              { name: "The Range", path: "/range" },
              { name: model.name, path: `/range/${model.slug}` },
            ]),
          ),
        }}
      />

      {/* Full-bleed product hero + 3-spec strip */}
      <ProductHero model={model} />

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

      {/* Detailed sections (premium depth + natural keyword coverage) */}
      {model.sections && model.sections.length > 0 && (
        <section className="border-t border-hairline bg-paper-2 py-16 md:py-24">
          <Container>
            <h2 className="sr-only">About the {model.name}</h2>
            <div className="grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
              {model.sections.map((s, i) => (
                <Reveal key={s.heading} delay={i * 0.05}>
                  <div className="border-t border-hairline pt-6">
                    <h3 className="text-xl text-ink">{s.heading}</h3>
                    <p className="mt-3 leading-relaxed text-ink-soft">{s.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* FAQ: genuine buyer questions (FAQPage rich results + AI answers) */}
      <section className="border-t border-hairline py-16 md:py-24">
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

      {/* Persistent quote-led bottom bar */}
      <StickyModelBar
        name={model.name}
        priceLabel={isBespoke ? null : `From ${gbp(model.basePrice)}`}
        configureHref={isBespoke ? "/bespoke" : `/configure/${model.slug}`}
        configureLabel={isBespoke ? "Commission" : "Configure"}
        specs={
          isBespoke
            ? undefined
            : [
                { label: "Range", value: model.specs.range },
                { label: "Top speed", value: model.specs.topSpeed },
                { label: "Seats", value: model.specs.seats.replace(/\s*seats?$/i, "") },
              ]
        }
      />
    </>
  );
}
