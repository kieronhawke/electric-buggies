import { Container } from "./container";
import { PageHero } from "./page-hero";
import type { LegalDoc } from "@/lib/data/legal";

export function LegalTemplate({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={doc.title}
        crumbs={[
          { name: "Home", path: "/" },
          { name: doc.title, path: `/${doc.slug}` },
        ]}
      />
      <section className="py-16 md:py-24">
        <Container size="narrow">
          <p className="text-ink-soft">{doc.intro}</p>
          <div className="mt-10 space-y-10">
            {doc.sections.map((s) => (
              <div key={s.heading}>
                <h2 className="font-display text-2xl text-ink">{s.heading}</h2>
                <p className="mt-3 leading-relaxed text-ink-soft">{s.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-12 text-xs text-ink-soft">
            Last updated {new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" })}.
          </p>
        </Container>
      </section>
    </>
  );
}
