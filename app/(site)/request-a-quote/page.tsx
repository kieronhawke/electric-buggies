import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { LeadWizard } from "@/components/wizard/lead-wizard";
import { getModels, getSiteSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Request a Tailored Quote",
  description:
    "Request a tailored quote for electric buggies. Tell us the models, quantity, branding and delivery, and we will respond with specification, pricing and lead time.",
  path: "/request-a-quote",
});

export default async function RequestQuotePage() {
  const [models, settings] = await Promise.all([getModels(), getSiteSettings()]);
  const lite = models.filter((m) => m.basePrice > 0).map((m) => ({ slug: m.slug, name: m.name, categoryLabel: m.categoryLabel, image: m.image }));
  const tel = settings.phone.replace(/[^+\d]/g, "");

  return (
    <>
      <PageHero
        eyebrow="Request a Quote"
        title="Build your enquiry in a minute."
        lede="A few quick questions so we can tailor your quote. Your progress saves as you go."
        crumbs={[{ name: "Home", path: "/" }, { name: "Request a Quote", path: "/request-a-quote" }]}
      />
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
            <LeadWizard flow="quote" models={lite} />
            <aside className="space-y-8 lg:border-l lg:border-line lg:pl-12">
              <div>
                <p className="eyebrow">Speak to a member of the team</p>
                <a href={`tel:${tel}`} className="mt-3 block text-2xl font-semibold hover:underline">{settings.phone}</a>
                <a href={`mailto:${settings.email}`} className="mt-1 block text-ink-2 hover:text-ink">{settings.email}</a>
                <p className="mt-3 text-sm text-ink-2">We typically reply within a few working hours.</p>
              </div>
              <div className="rounded-lg border border-line bg-paper p-6">
                <h2 className="text-lg">What happens next</h2>
                <ol className="mt-4 space-y-3 text-sm text-ink-2">
                  <li>1. We review your enquiry and any attached build.</li>
                  <li>2. We respond with specification, indicative pricing and lead time.</li>
                  <li>3. We refine the detail together and confirm your order.</li>
                </ol>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
