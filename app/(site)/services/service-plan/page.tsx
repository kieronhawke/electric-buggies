import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { Button, Arrow } from "@/components/ui/button";
import { FaqAccordion } from "@/components/faq-accordion";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { buildMetadata } from "@/lib/seo";
import { faqPageJsonLd, serviceJsonLd } from "@/lib/structured-data";

const wrap = "mx-auto max-w-[1320px] px-[clamp(1.25rem,5vw,4.5rem)]";
export const metadata: Metadata = buildMetadata({
  title: "Service Plan & 24-Hour Call-Out",
  description:
    "A service plan with 24-hour call-out and a VIP technical team that comes to your location to repair, 24/7. Bought from outside the UK? Our experts aim to reach you within 24 to 48 hours.",
  path: "/services/service-plan",
    ogImage: "/img/vehicles/utility.webp",
});

const tiers = [
  { t: "Essential", b: "Scheduled servicing, genuine parts and priority phone support to keep your fleet running." },
  { t: "Priority", b: "Everything in Essential plus 24-hour call-out and faster response, ideal for venues that rely on the fleet daily." },
  { t: "Concierge", b: "Our VIP technical team comes to your location, 24/7, with international response for buyers outside the UK." },
];
const faqs = [
  { q: "What is the 24-hour call-out?", a: "If something goes wrong, our technical team responds within 24 hours, and our VIP team can come to your location to repair on site rather than you bringing the vehicle to us." },
  { q: "I am buying from outside the UK. Is support a problem?", a: "Not at all. Our experts come to you, and we aim to be with international clients within 24 to 48 hours." },
  { q: "Do you operate out of hours?", a: "Yes, the Concierge plan operates 24/7 so a busy venue is never left without support." },
];

export default function ServicePlanPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({ name: "Electric buggy servicing, warranty and repair", description: "Servicing, repair and warranty plans for electric and golf buggies, with a 3-year warranty and 24-hour VIP call-out.", areaServed: "United Kingdom", path: "/services/service-plan" })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(faqs.map((f) => ({ question: f.q, answer: f.a })))) }} />
      <PageHero eyebrow="Ownership" title="The experts come to you. 24 hours a day."
        lede="A service plan built around uptime: 24-hour call-out and a VIP technical team that travels to your location to repair, 24/7. Bought from outside the UK? We aim to reach you within 24 to 48 hours."
        crumbs={[{ name: "Home", path: "/" }, { name: "Ownership", path: "/ownership" }, { name: "Service Plan", path: "/services/service-plan" }]} />

      <section className="py-16 md:py-24">
        <div className={wrap}>
          <SectionHeading eyebrow="Service plans" title="Cover that matches how hard your fleet works." />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {tiers.map((t, i) => <Reveal key={t.t} delay={i * 0.06}><div className="h-full rounded-lg border border-line bg-white p-8"><h3 className="text-2xl">{t.t}</h3><p className="mt-3 text-ink-2">{t.b}</p></div></Reveal>)}
          </div>
        </div>
      </section>

      <section className="bg-ink py-16 text-white md:py-24">
        <div className={wrap}>
          <div className="grid gap-8 sm:grid-cols-3">
            {[["24h", "Call-out response"], ["24/7", "Concierge operation"], ["24–48h", "International, on site"]].map(([n, l]) => (
              <Reveal key={l}><div className="text-[clamp(2.4rem,4.6vw,3.4rem)] font-semibold">{n}</div><div className="mt-2 text-[.72rem] font-semibold uppercase tracking-[.16em] text-white/60">{l}</div></Reveal>
            ))}
          </div>
          <div className="mt-10"><Button href="/request-a-quote" variant="light" size="lg">Talk to us about cover <Arrow /></Button></div>
        </div>
      </section>

      <section className="border-t border-line py-16 md:py-24">
        <div className={wrap}>
          <SectionHeading eyebrow="Why uptime matters" title="When the fleet has to be ready, every day." />
          <p className="mt-6 max-w-[70ch] text-[1.05rem] leading-[1.6] text-ink-2">
            A buggy that is off the road is a guest left waiting, a round delayed or a job not done. Our service plans, genuine parts and 24-hour VIP call-out are built around keeping your vehicles working, with the technical team coming to your location rather than you bringing the vehicle to us. Here is where that cover earns its keep.
          </p>
          <div className="mt-10 grid gap-x-10 gap-y-9 md:grid-cols-2">
            {[
              {
                t: "Resorts & hotels",
                b: "Guest shuttles run from first arrival to last departure. On-site repair and priority response keep the service moving through the busy season, so a fault never becomes a guest complaint.",
              },
              {
                t: "Golf clubs & estates",
                b: "Fleets that work hard across the season need scheduled servicing and fast call-out to stay reliable on the course and around the grounds. We keep batteries, brakes and tyres in good order and step in quickly when something goes wrong.",
              },
              {
                t: "Events & hire fleets",
                b: "When a fleet is booked for a specific day, there is no room for downtime. Priority cover and rapid response mean every vehicle is ready when the gates open.",
              },
              {
                t: "International buyers",
                b: "Bought from outside the UK? Support is not a problem. Our experts travel to you, and we aim to be with international clients within 24 to 48 hours, so distance never means being left without help.",
              },
            ].map((u, i) => (
              <Reveal key={u.t} delay={i * 0.05}>
                <div className="border-t border-line-2 pt-6">
                  <h3 className="text-xl font-semibold">{u.t}</h3>
                  <p className="mt-3 leading-relaxed text-ink-2">{u.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-[clamp(1.25rem,5vw,4.5rem)]">
          <p className="eyebrow">Questions</p><h2 className="mt-3 text-3xl md:text-4xl">Service & support, frequently asked</h2>
          <div className="mt-10"><FaqAccordion faqs={faqs.map((f) => ({ question: f.q, answer: f.a, category: "Service" }))} /></div>
        </div>
      </section>
      <MobileCtaBar primary={{ label: "Enquire", href: "/request-a-quote" }} secondary={{ label: "Ownership", href: "/ownership" }} />
    </>
  );
}
