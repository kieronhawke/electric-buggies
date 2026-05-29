import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { Button, Arrow } from "@/components/ui/button";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { buildMetadata } from "@/lib/seo";

const wrap = "mx-auto max-w-[1320px] px-[clamp(1.25rem,5vw,4.5rem)]";
export const metadata: Metadata = buildMetadata({
  title: "VIP Chauffeur Buggy Service",
  description:
    "Enhance your event with a VIP experience: chauffeured electric buggies for guests and VIPs, branded and white-glove. Perfect for weddings, galas, hospitality and golf days.",
  path: "/services/vip-chauffeur",
});

const occasions = ["Weddings", "Galas & awards", "Corporate hospitality", "Golf days", "Product launches", "Private estates"];
const benefits = [
  { t: "A first impression that lasts", b: "Guests are met and moved in a beautifully finished, silent carriage, the welcome starts the moment they arrive." },
  { t: "Branded to your event", b: "Livery, colours and detailing finished to your brand or the occasion." },
  { t: "Discreet, professional drivers", b: "White-glove chauffeurs who know the venue and look after every guest." },
];

export default function VipPage() {
  return (
    <>
      <PageHero eyebrow="Service" title="Enhance your event with a VIP experience."
        lede="Chauffeured electric buggies that move your guests and VIPs in comfort and style, branded, silent and beautifully presented."
        crumbs={[{ name: "Home", path: "/" }, { name: "Services", path: "/services/shuttle" }, { name: "VIP Chauffeur", path: "/services/vip-chauffeur" }]} />

      <section className="py-16 md:py-24">
        <div className={wrap}>
          <SectionHeading eyebrow="Why VIP chauffeur" title="The detail your guests remember." />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {benefits.map((b, i) => <Reveal key={b.t} delay={i * 0.06}><div className="h-full rounded-lg border border-line bg-white p-7"><h3 className="text-xl">{b.t}</h3><p className="mt-2 text-ink-2">{b.b}</p></div></Reveal>)}
          </div>
        </div>
      </section>

      <section className="bg-paper py-16 md:py-24">
        <div className={wrap}>
          <p className="eyebrow">Occasions</p>
          <div className="mt-5 flex flex-wrap gap-2">{occasions.map((o) => <span key={o} className="rounded-full border border-line-2 bg-white px-5 py-2 text-sm text-ink-2">{o}</span>)}</div>
          <figure className="mt-12 max-w-3xl rounded-lg border border-line bg-white p-8">
            <blockquote className="text-[1.15rem] leading-relaxed">&ldquo;The chauffeured buggies were the talk of the day. Guests felt looked after from the moment they stepped out of the car.&rdquo;</blockquote>
            <figcaption className="mt-4 text-sm text-ink-2">Illustrative example, not attributed to a specific client. Real case studies to follow.</figcaption>
          </figure>
          <div className="mt-10"><Button href="/request-a-quote" size="lg">Enquire about VIP chauffeur <Arrow /></Button></div>
        </div>
      </section>
      <MobileCtaBar primary={{ label: "Enquire", href: "/request-a-quote" }} secondary={{ label: "Shuttle service", href: "/services/shuttle" }} />
    </>
  );
}
