import Link from "next/link";
import { Container } from "./container";
import { PageHero } from "./page-hero";
import { Reveal } from "./reveal";
import { Button, Arrow } from "./ui/button";
import { ModelCard } from "./model-card";
import { modelBySlug } from "@/lib/data/models";
import { sectorBySlug } from "@/lib/data/sectors";
import { pricesVisible } from "@/lib/content";
import type { LandingPage } from "@/lib/data/landing";

export async function LandingTemplate({ page }: { page: LandingPage }) {
  const showPrice = await pricesVisible();
  const models = page.recommendedModels.map(modelBySlug).filter((m) => m !== undefined);
  const sectors = page.relatedSectors.map(sectorBySlug).filter((s) => s !== undefined);

  return (
    <>
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        lede={page.intro}
        crumbs={[
          { name: "Home", path: "/" },
          { name: page.eyebrow, path: `/${page.slug}` },
        ]}
      />

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-3">
            {page.sections.map((s, i) => (
              <Reveal key={s.heading} delay={i * 0.08}>
                <div className="border-t border-hairline pt-6">
                  <h2 className="font-display text-2xl text-ink">{s.heading}</h2>
                  <p className="mt-3 leading-relaxed text-ink-soft">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper-2 py-16 md:py-24">
        <Container>
          <h2 className="text-3xl text-ink md:text-4xl">Recommended models</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {models.map((m) => (
              <ModelCard key={m!.slug} model={m!} showPrice={showPrice} />
            ))}
          </div>

          {sectors.length > 0 && (
            <div className="mt-14">
              <p className="eyebrow">Related sectors</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {sectors.map((s) => (
                  <Link
                    key={s!.slug}
                    href={`/sectors/${s!.slug}`}
                    className="rounded-full border border-hairline bg-white px-5 py-2 text-sm text-ink-soft transition-colors hover:border-ink hover:text-ink"
                  >
                    {s!.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12">
            <Button href="/request-a-quote" size="lg">
              Request a Tailored Quote <Arrow />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
