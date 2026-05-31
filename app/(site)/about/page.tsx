import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { Button, Arrow } from "@/components/ui/button";
import { SpeakToTeam } from "@/components/speak-to-team";
import { Counter } from "@/components/counter";
import { getSiteSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

const wrap = "mx-auto max-w-[1320px] px-[clamp(1.25rem,5vw,4.5rem)]";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Electric Buggies builds bespoke electric buggies and utility vehicles in Britain for estates, resorts, golf clubs and events. Read our story, ethos and service promise.",
  path: "/about",
    ogImage: "/img/vehicles/eight.webp",
});

const steps = [
  { n: "01", t: "Start with the brief", b: "We begin with where the vehicle will work and what it must do, not a catalogue." },
  { n: "02", t: "Proven platforms", b: "We source proven electric platforms with the range, build and safety record to rely on." },
  { n: "03", t: "Rebuilt to the marque", b: "Bodywork, finish, livery, wheels and interior are reworked to a British standard." },
  { n: "04", t: "Delivered and supported", b: "Built to order, delivered UK-wide and worldwide, and supported long after it arrives." },
];

export default async function AboutPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A British marque for the electric grounds vehicle."
        lede="We took a category treated as an afterthought and held it to the standard of the places it serves."
        crumbs={[{ name: "Home", path: "/" }, { name: "About", path: "/about" }]}
      />

      <section className="py-16 md:py-24">
        <Container size="narrow">
          <div className="space-y-6 text-lg leading-relaxed text-ink-2">
            <Reveal><p>Electric Buggies began with a simple observation. The vehicles that move guests, families and grounds teams across Britain&rsquo;s finest estates, resorts and clubs were being chosen on price alone, and it showed.</p></Reveal>
            <Reveal delay={0.06}><p>So we built a marque. We take proven electric platforms and rebuild them: restrained in design, considered in finish, and configured to each client&rsquo;s brief. Every vehicle is electric, built to order, and supported the length of the country and beyond.</p></Reveal>
            <Reveal delay={0.12}><p>The result belongs at the front door of a country house as naturally as on the eighteenth fairway. Quiet, clean and quietly expensive.</p></Reveal>
          </div>
        </Container>
      </section>

      <section className="border-t border-line py-16 md:py-24">
        <div className={wrap}>
          <SectionHeading eyebrow="What we make, and who we make it for" title="Premium electric buggies, built to order in Britain." />
          <div className="mt-10 grid gap-x-12 gap-y-9 md:grid-cols-2">
            <Reveal>
              <p className="leading-relaxed text-ink-2">
                We build the full range of premium electric vehicles for moving people and kit across large private and public ground: two to eight-seat electric buggies, electric golf buggies, and electric utility vehicles with real payload and load space. Every one is electric, near-silent and zero local emission at the point of use, made to order and finished to a British standard rather than picked off a shelf.
              </p>
              <p className="mt-5 leading-relaxed text-ink-2">
                Because we build to order, the vehicle is shaped around the client. Seat count, load bed, colour, upholstery, roof, wheels and full livery are specified to the brief, and fleets are branded as one. It is the difference between a vehicle that merely does the job and one that belongs at the front door.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="leading-relaxed text-ink-2">
                Our clients are the places that move people across distance and care how it looks doing it: country estates, luxury resorts and hotels, golf and country clubs, holiday parks, healthcare and university sites, warehouses and work sites, parks and public spaces, and event organisers who need a branded fleet for a weekend. We deliver and support UK-wide and worldwide.
              </p>
              <p className="mt-5 leading-relaxed text-ink-2">
                Behind every vehicle is the promise that matters most once it arrives: a 3-year warranty, genuine parts, and a 24-hour VIP call-out team that travels to your location to repair on site. We aim to beat any genuine like-for-like quote, and to be the marque you call long after the sale.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-paper py-16 md:py-24">
        <div className={wrap}>
          <SectionHeading eyebrow="How bespoke works" title="From a conversation to a finished vehicle." />
          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <Reveal key={s.n} className="bg-white p-7"><div className="text-2xl font-semibold text-ink-2">{s.n}</div><h3 className="mt-3 text-lg">{s.t}</h3><p className="mt-2 text-sm text-ink-2">{s.b}</p></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className={wrap}>
          <SectionHeading eyebrow="Why electric" title="Better to live with, and ready for what is coming." lede="Near-silent running, zero local emissions and far less maintenance than petrol. Electric is not a compromise here, it is the better vehicle." />
          <div className="mt-11 grid grid-cols-2 gap-8 border-t border-line pt-12 lg:grid-cols-4">
            {[{ n: "100%", l: "Electric & silent" }, { n: "Bespoke", l: "Built to order" }, { n: settings.warrantyTerm, l: "Extended warranty" }, { n: "Worldwide", l: "Delivery & support" }].map((s) => (
              <Reveal key={s.l}><div className="text-[clamp(2.2rem,4.2vw,3.2rem)] font-semibold tracking-[-0.03em]">{s.n === "100%" ? <Counter to={100} suffix="%" /> : s.n}</div><div className="mt-2 text-[.72rem] font-semibold uppercase tracking-[.16em] text-ink-2">{s.l}</div></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-16 md:py-24">
        <div className={wrap}><SpeakToTeam phone={settings.phone} email={settings.email} /></div>
      </section>

      <section className="py-16 md:py-24">
        <Container className="text-center">
          <Reveal>
            <p className="eyebrow">{settings.strapline}</p>
            <h2 className="mx-auto mt-4 max-w-2xl text-3xl md:text-4xl">Restrained, considered and confident, by design.</h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/range" size="lg">Explore the Range <Arrow /></Button>
              <Button href="/request-a-quote" variant="outline" size="lg">Request a quote</Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
