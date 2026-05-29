import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { QuoteForm } from "@/components/quote-form";
import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Contact Electric Buggies — bespoke electric buggies and utility vehicles, built in Britain. Call, email or send us your requirement.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Start the conversation."
        lede="Call us, email us, or send your requirement and we'll be in touch."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
            <aside className="space-y-6">
              <div>
                <p className="eyebrow">By phone</p>
                <a href={`tel:${site.contact.phone}`} className="mt-2 block font-display text-3xl text-ink hover:text-champagne-deep">
                  {site.contact.phoneDisplay}
                </a>
              </div>
              <div>
                <p className="eyebrow">By email</p>
                <a href={`mailto:${site.contact.email}`} className="mt-2 block text-lg text-ink hover:text-champagne-deep">
                  {site.contact.email}
                </a>
              </div>
              <div>
                <p className="eyebrow">Based in</p>
                <p className="mt-2 text-lg text-ink">{site.contact.address.line2}, {site.contact.address.country}</p>
                <p className="text-sm text-ink-soft">Delivering & supporting UK-wide.</p>
              </div>
            </aside>
            <div>
              <h2 className="font-display text-2xl text-ink">Send us a message</h2>
              <div className="mt-6">
                <Suspense fallback={<div className="text-ink-soft">Loading…</div>}>
                  <QuoteForm />
                </Suspense>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
