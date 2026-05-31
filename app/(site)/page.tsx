import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { ModelCard } from "@/components/model-card";
import { Media } from "@/components/media";
import { Button, ArrowLink, Arrow } from "@/components/ui/button";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { FeatureCarousel } from "@/components/feature-carousel";
import { Counter } from "@/components/counter";
import { getModels, getSectors, getSiteSettings, pricesVisible } from "@/lib/content";
import { locations } from "@/lib/data/locations";
import { posts } from "@/lib/data/blog";
import { testimonials } from "@/lib/data/testimonials";
import { imagery, blogImage } from "@/lib/images";
import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";

const wrap = "mx-auto max-w-[1320px] px-[clamp(1.25rem,5vw,4.5rem)]";

// Homepage on-page SEO (PAGE-BY-PAGE-ONPAGE-SPEC §1). Title carries the brand,
// so use it verbatim. Worldwide + premium-affordable positioning per owner.
export const metadata = buildMetadata({
  title: "Electric Buggies UK | Premium Golf & Utility Buggies",
  description:
    "Premium electric golf and utility buggies, delivered worldwide. Bespoke builds, custom fleet branding and a 3-year warranty. Request a tailored quote.",
  path: "/",
  ogImage: "/img/vehicles/eight.webp",
  absoluteTitle: true,
});

// Fully static: the homepage is baked at build time and served as an immutable
// part of each deployment (refreshed on deploy), so it can never be served a
// stale ISR copy across deployments. CMS edits to homepage data land on the
// next deploy; on-demand /api/revalidate can also refresh it.
export const dynamic = "force-static";

export default async function HomePage() {
  // revalidate:false → data is baked into the static build (no per-request ISR).
  const [models, sectors, settings, showPrice] = await Promise.all([getModels(false), getSectors(false), getSiteSettings(false), pricesVisible()]);
  return (
    <>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative isolate flex min-h-[100svh] items-start overflow-hidden bg-[#0a0a0b] text-white md:items-center">
        {/* Looping background video. Muted + playsInline so it autoplays on
            mobile; the poster paints instantly while it loads. Decorative. */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/img/vehicles/eight.webp"
          aria-hidden
          tabIndex={-1}
        >
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
        {/* Scrims keep the headline legible over the video. */}
        <div aria-hidden className="absolute inset-0 bg-black/35" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b] via-[#0a0a0b]/70 to-transparent md:via-[#0a0a0b]/40" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/40 to-transparent md:via-transparent" />
        <div className={`${wrap} relative w-full pt-[calc(var(--header-h)+2rem)] md:pt-[var(--header-h)]`}>
          <Reveal><p className="eyebrow !text-white/80">{site.strapline}</p></Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-3 max-w-[16ch] text-[clamp(2.6rem,6.6vw,5.6rem)] font-semibold tracking-[-0.03em]">
              Premium electric golf buggies and utility vehicles.
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 max-w-[48ch] text-[clamp(1.02rem,1.35vw,1.22rem)] font-light text-white/85">
              Refined, silent electric vehicles for estates, resorts, golf clubs and events.
              Configured to your brief, branded as your own, with free delivery and support
              worldwide.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-wrap gap-3.5">
              <Button href="/range" variant="light" size="lg">Explore Vehicles</Button>
              <Button href="/request-a-quote" variant="lightOutline" size="lg">Request a Quote</Button>
            </div>
          </Reveal>
        </div>
        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-[.66rem] uppercase tracking-[.28em] text-white/70">Scroll</div>
      </section>

      {/* ── Statement ────────────────────────────────── */}
      <section className={`${wrap} py-[clamp(5rem,10vw,9rem)] text-center`}>
        <Reveal><p className="eyebrow">Golf and utility buggies, made premium</p></Reveal>
        <Reveal delay={0.08}>
          <p className="mx-auto mt-4 max-w-[30ch] text-[clamp(1.5rem,3.3vw,2.5rem)] font-medium leading-[1.25] tracking-[-0.025em]">
            From golf buggies to utility vehicles, we build premium electric buggies that move
            guests, families, kit and crews. Every one is made to order, and we can build
            almost anything you can picture.
          </p>
        </Reveal>
      </section>

      {/* ── Range ────────────────────────────────────── */}
      <section className="bg-paper py-[clamp(4.5rem,9vw,8.5rem)]">
        <div className={wrap}>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="The Collection" title="Six starting points. One standard." />
            <Reveal delay={0.1}><ArrowLink href="/range">View all models</ArrowLink></Reveal>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {models.map((m, i) => (
              <Reveal key={m.slug} delay={i * 0.06}><ModelCard model={m} showPrice={showPrice} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Capability / stats ───────────────────────── */}
      <section className="py-[clamp(4.5rem,9vw,8.5rem)]">
        <div className={wrap}>
          <SectionHeading
            eyebrow="The Difference"
            title="Ownership without compromise."
            lede="We build the right vehicle, deliver it anywhere, and stand behind it long after it arrives."
          />
          <div className="mt-11 grid grid-cols-2 gap-8 border-t border-line pt-12 lg:grid-cols-4">
            {[
              { n: "100%", l: "Electric & silent" },
              { n: "Bespoke", l: "Built to order" },
              { n: settings.warrantyTerm, l: "Extended warranty" },
              { n: "Worldwide", l: "Free delivery & support" },
            ].map((s, i) => (
              <Reveal key={s.l} delay={i * 0.08}>
                <div className="text-[clamp(2.4rem,4.6vw,3.6rem)] font-semibold tracking-[-0.03em]">
                  {s.n === "100%" ? <Counter to={100} suffix="%" /> : s.n}
                </div>
                <div className="mt-2.5 text-[.72rem] font-semibold uppercase tracking-[.16em] text-ink-2">{s.l}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Meet ownership (swipeable feature carousel) ─ */}
      <FeatureCarousel
        eyebrow="Meet ownership"
        title="More than a vehicle."
        items={[
          {
            label: "Warranty",
            image: "/img/email/six.png",
            blurb: `Every build is covered by our ${settings.warrantyTerm} warranty, with UK parts and people standing behind it long after delivery.`,
            href: "/ownership",
          },
          {
            label: "Support",
            image: "/img/email/four.png",
            blurb: "Talk to a real person. UK-based support and servicing for the life of the vehicle, wherever it is in the world.",
            href: "/ownership",
          },
          {
            label: "Bespoke",
            image: "/img/email/bespoke.png",
            blurb: "Any livery, any fit-out. We build to your brief, from a single commission to a fully branded fleet.",
            href: "/bespoke",
          },
          {
            label: "Delivery",
            image: "/img/email/eight.png",
            blurb: "Built and branded in Britain, then delivered to your door, with shipping and import coordinated worldwide.",
            href: "/locations",
          },
          {
            label: "Service",
            image: "/img/email/utility.png",
            blurb: "Servicing, parts and care plans that keep your fleet quiet, clean and moving for years.",
            href: "/ownership",
          },
        ]}
      />

      {/* ── Bespoke & branding ───────────────────────── */}
      <section className="bg-paper py-[clamp(4.5rem,9vw,8.5rem)]">
        <div className={`${wrap} grid items-center gap-12 lg:grid-cols-2`}>
          <Reveal>
            <Media src={imagery.sectors["golf-clubs"]} className="aspect-[4/3]" >
              <span className="absolute left-5 top-5 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[.66rem] font-semibold uppercase tracking-[.2em] text-white backdrop-blur">Bespoke</span>
            </Media>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow">Bespoke &amp; branding</p>
            <h2 className="mt-3 text-[clamp(1.9rem,4vw,3.1rem)]">Built around your brand.</h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-2">
              Choose the model, colour, roof, wheels and interior, then add your livery for a
              fleet that arrives unmistakably yours. Tell us how and where it will work and we
              will prepare a specification and a tailored quote built around you.
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <Button href="/request-a-quote" size="lg">Request a Quote <Arrow /></Button>
              <Button href="/bespoke" variant="outline" size="lg">Go fully bespoke</Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Sectors ──────────────────────────────────── */}
      <section className="py-[clamp(4.5rem,9vw,8.5rem)]">
        <div className={wrap}>
          <SectionHeading eyebrow="Where They Go" title="At home in Britain's finest places." />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sectors.map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.05}>
                <Link href={`/sectors/${s.slug}`} className="group block">
                  <Media src={imagery.sectors[s.slug]} sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" className="flex aspect-[4/3] items-end">
                    <div className="relative z-10 p-6">
                      <h3 className="text-xl font-semibold text-white">{s.name}</h3>
                      <span className="mt-2 inline-flex items-center gap-1.5 text-[.7rem] font-semibold uppercase tracking-[.16em] text-white/80">
                        Explore <Arrow className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Media>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Locations strip ──────────────────────────── */}
      <section className="bg-paper py-[clamp(4.5rem,9vw,8.5rem)]">
        <div className={wrap}>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Worldwide" title="Delivered and supported worldwide." />
            <Reveal delay={0.1}><ArrowLink href="/locations">All locations</ArrowLink></Reveal>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {locations.slice(0, 8).map((l, i) => (
              <Reveal key={l.slug} delay={i * 0.06}>
                <Link href={`/locations/${l.slug}`} className="group block">
                  <Media src={imagery.locations[l.slug]} sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw" className="flex aspect-[3/4] items-end">
                    <div className="relative z-10 p-5">
                      <h3 className="text-lg font-semibold text-white">{l.name}</h3>
                      <p className="text-[.8rem] text-white/75">{l.region}</p>
                    </div>
                  </Media>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Latest from the Guides ──────────────────── */}
      <section className="py-[clamp(4.5rem,9vw,8.5rem)]">
        <div className={wrap}>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="The Guides" title="Guides, insight & buyer's advice." />
            <Reveal delay={0.1}><ArrowLink href="/guides">Read the Guides</ArrowLink></Reveal>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {posts.slice(0, 3).map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.06}>
                <Link href={`/guides/${p.slug}`} className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-white transition-all hover:-translate-y-1 hover:shadow-[0_26px_44px_-30px_rgba(0,0,0,0.28)]">
                  <Media src={blogImage(i)} rounded={false} sizes="(max-width:768px) 100vw, 33vw" className="aspect-[16/10]" overlay={false} />
                  <div className="flex flex-1 flex-col p-6">
                    <span className="text-[.64rem] font-semibold uppercase tracking-[.2em] text-ink-2">{p.category}</span>
                    <h3 className="mt-2 text-xl leading-snug">{p.title}</h3>
                    <p className="mt-2 line-clamp-2 text-[.92rem] text-ink-2">{p.excerpt}</p>
                    <span className="mt-auto pt-4 text-[.74rem] font-semibold uppercase tracking-[.04em]">{p.readingTime} min read</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials / social proof ──────────────── */}
      <section className="bg-paper py-[clamp(4.5rem,9vw,8.5rem)]">
        <div className={wrap}>
          <SectionHeading eyebrow="Illustrative examples" title="Built for Britain's finest places." />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name + t.sector} delay={i * 0.06}>
                <figure className="flex h-full flex-col rounded-lg border border-line bg-white p-7">
                  <blockquote className="flex-1 text-[1.05rem] leading-relaxed text-ink">&ldquo;{t.quote}&rdquo;</blockquote>
                  <figcaption className="mt-6 border-t border-line pt-4">
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-[.85rem] text-ink-2">{t.role}</div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
          <Reveal><p className="mt-6 text-[.78rem] text-ink-2">Illustrative examples of the briefs we serve, not attributed to specific clients. Real, named case studies will replace these once approved.</p></Reveal>
        </div>
      </section>

      {/* ── CTA band ─────────────────────────────────── */}
      <section className="relative isolate text-center text-white">
        <Media src={imagery.ctaBand} rounded={false} className="absolute inset-0 -z-10" />
        <div className={`${wrap} py-[clamp(5rem,10vw,8.5rem)]`}>
          <Reveal><p className="eyebrow !text-white/80">Personal &amp; Business</p></Reveal>
          <Reveal delay={0.08}>
            <h2 className="mx-auto mt-3 max-w-[20ch] text-[clamp(2rem,4.4vw,3.4rem)] text-white">Request a tailored quote.</h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto mt-4 max-w-[48ch] text-white/85">
              Tell us how and where you&rsquo;ll use your vehicle, and we&rsquo;ll prepare a
              specification and price built around you.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-wrap justify-center gap-3.5">
              <Button href="/request-a-quote" variant="light" size="lg">Start your enquiry</Button>
              <Button href={`tel:${site.contact.phone}`} variant="lightOutline" size="lg">Call us</Button>
            </div>
          </Reveal>
        </div>
      </section>

      <MobileCtaBar />
    </>
  );
}
