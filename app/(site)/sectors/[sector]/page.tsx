import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { Button, Arrow } from "@/components/ui/button";
import { ModelCard } from "@/components/model-card";
import { sectors, sectorBySlug } from "@/lib/data/sectors";
import { modelBySlug } from "@/lib/data/models";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export function generateStaticParams() {
  return sectors.map((s) => ({ sector: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sector: string }>;
}): Promise<Metadata> {
  const { sector: slug } = await params;
  const sector = sectorBySlug(slug);
  if (!sector) return {};
  return buildMetadata({
    title: `${sector.name} — Electric Vehicles`,
    description: sector.intro,
    path: `/sectors/${sector.slug}`,
  });
}

export default async function SectorPage({
  params,
}: {
  params: Promise<{ sector: string }>;
}) {
  const { sector: slug } = await params;
  const sector = sectorBySlug(slug);
  if (!sector) notFound();

  const recommended = sector.recommendedModels
    .map((s) => modelBySlug(s))
    .filter((m) => m !== undefined);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Sectors", path: "/sectors" },
              { name: sector.name, path: `/sectors/${sector.slug}` },
            ]),
          ),
        }}
      />
      <PageHero
        eyebrow="Sector"
        title={sector.name}
        lede={sector.intro}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Sectors", path: "/sectors" },
          { name: sector.name, path: `/sectors/${sector.slug}` },
        ]}
      />

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            {sector.sections.map((s, i) => (
              <Reveal key={s.heading} delay={i * 0.08}>
                <div className="border-t border-hairline pt-6">
                  <h2 className="font-display text-2xl text-ink">{s.heading}</h2>
                  <p className="mt-3 leading-relaxed text-ink-soft">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-14">
            <p className="eyebrow">Typical uses</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {sector.useCases.map((u) => (
                <li
                  key={u}
                  className="rounded-full border border-hairline bg-paper-2 px-4 py-1.5 text-sm text-ink-soft"
                >
                  {u}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      <section className="bg-paper-2 py-16 md:py-24">
        <Container>
          <h2 className="text-3xl text-ink md:text-4xl">Recommended for {sector.name.toLowerCase()}</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map((m) => (
              <ModelCard key={m!.slug} model={m!} />
            ))}
          </div>
          <div className="mt-12">
            <Button href="/request-a-quote" size="lg">
              Discuss your requirement <Arrow />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
