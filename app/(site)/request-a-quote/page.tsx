import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { QuoteForm } from "@/components/quote-form";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { getSiteSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Request a Tailored Quote",
  description:
    "Request a tailored quote from Electric Buggies. Tell us about your requirement — personal or business — and we'll respond with specification, pricing and lead time.",
  path: "/request-a-quote",
});

export default async function RequestQuotePage() {
  const settings = await getSiteSettings();
  return (
    <>
      <PageHero
        eyebrow="Request a Quote"
        title="Tell us what you need it to do."
        lede="Every Electric Buggies enquiry begins with a brief, not a checkout. Share yours and we'll respond with specification, indicative pricing and lead time."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Request a Quote", path: "/request-a-quote" },
        ]}
      />
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
            {/* Server-rendered; no Suspense gate, so it can never stick on "Loading…" */}
            <QuoteForm />
            <aside className="space-y-8">
              <div className="rounded-lg border border-line bg-white p-8">
                <h2 className="text-2xl">What happens next</h2>
                <ol className="mt-5 space-y-4 text-sm text-ink-2">
                  <li className="flex gap-3"><span className="font-semibold text-ink">1.</span> We review your requirement and any attached build.</li>
                  <li className="flex gap-3"><span className="font-semibold text-ink">2.</span> We respond with specification, indicative pricing and lead time.</li>
                  <li className="flex gap-3"><span className="font-semibold text-ink">3.</span> We refine the detail together and confirm your order.</li>
                </ol>
              </div>
              <div className="rounded-lg border border-line bg-paper p-8">
                <p className="eyebrow">Prefer to talk?</p>
                <a href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`} className="mt-3 block text-2xl font-semibold hover:underline">
                  {settings.phone}
                </a>
                <a href={`mailto:${settings.email}`} className="mt-1 block text-ink-2 hover:text-ink">
                  {settings.email}
                </a>
              </div>
            </aside>
          </div>
        </Container>
      </section>
      <MobileCtaBar primary={{ label: "Call us", href: `tel:${settings.phone.replace(/[^+\d]/g, "")}` }} secondary={{ label: "Explore Range", href: "/range" }} />
    </>
  );
}
