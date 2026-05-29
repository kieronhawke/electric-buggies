import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { Button, Arrow } from "@/components/ui/button";
import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Electric Buggies builds bespoke electric buggies and utility vehicles in Britain — restrained, expensive and confident, for the places that demand it.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A British marque for the electric grounds vehicle."
        lede="We took a category that had been treated as an afterthought and held it to the standard of the places it serves."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
      />

      <section className="py-16 md:py-24">
        <Container size="narrow">
          <div className="space-y-6 text-lg leading-relaxed text-ink-soft">
            <Reveal>
              <p>
                Electric Buggies was founded on a simple observation: the vehicles that move
                guests, families and grounds teams across Britain&rsquo;s finest estates,
                resorts and clubs were being chosen on price, not on standard — and it showed.
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <p>
                We source proven electric platforms and rebuild them as a bespoke, white-label
                British marque: restrained in design, considered in finish, and configured to
                each client&rsquo;s exact brief. Every vehicle is electric, every vehicle is
                built to order, and every vehicle is supported the length of the country.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <p>
                The result is a vehicle that belongs at the front door of a country house as
                naturally as it does on the eighteenth fairway — quiet, clean and quietly
                expensive.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-paper-2 py-16 md:py-24">
        <Container className="text-center">
          <Reveal>
            <p className="eyebrow">{site.strapline}</p>
            <h2 className="mx-auto mt-4 max-w-2xl text-3xl text-ink md:text-4xl">
              Restrained, expensive and confident — by design.
            </h2>
            <div className="mt-8 flex justify-center gap-4">
              <Button href="/range" size="lg">
                Explore the Range <Arrow />
              </Button>
              <Button href="/request-a-quote" variant="outline" size="lg">
                Contact us
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
