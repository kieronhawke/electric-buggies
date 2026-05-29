import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { QuoteForm } from "@/components/quote-form";
import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Request a Tailored Quote",
  description:
    "Request a tailored quote from Electric Buggies. Tell us about your requirement — personal or business — and we'll respond with specification, pricing and lead time.",
  path: "/request-a-quote",
});

export default function RequestQuotePage() {
  return (
    <>
      <PageHero
        eyebrow="Request a Quote"
        title="Tell us what you need it to do."
        lede="Every Electric Buggies begins with a brief, not a checkout. Share yours and we'll respond with specification, indicative pricing and lead time."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Request a Quote", path: "/request-a-quote" },
        ]}
      />
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
            <Suspense fallback={<div className="text-ink-soft">Loading…</div>}>
              <QuoteForm />
            </Suspense>
            <aside className="space-y-8">
              <div className="rounded-lg border border-hairline bg-white p-8">
                <h2 className="font-display text-2xl text-ink">What happens next</h2>
                <ol className="mt-5 space-y-4 text-sm text-ink-soft">
                  <li className="flex gap-3"><span className="font-display text-champagne-deep">1.</span> We review your requirement and any attached build.</li>
                  <li className="flex gap-3"><span className="font-display text-champagne-deep">2.</span> We respond with specification, indicative pricing and lead time.</li>
                  <li className="flex gap-3"><span className="font-display text-champagne-deep">3.</span> We refine the detail together and confirm your order.</li>
                </ol>
              </div>
              <div className="rounded-lg border border-hairline bg-paper-2 p-8">
                <p className="eyebrow">Prefer to talk?</p>
                <a href={`tel:${site.contact.phone}`} className="mt-3 block font-display text-2xl text-ink hover:text-champagne-deep">
                  {site.contact.phoneDisplay}
                </a>
                <a href={`mailto:${site.contact.email}`} className="mt-1 block text-ink-soft hover:text-ink">
                  {site.contact.email}
                </a>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
