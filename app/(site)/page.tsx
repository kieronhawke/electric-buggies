import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { ModelCard } from "@/components/model-card";
import { Media } from "@/components/media";
import { Button, ArrowLink, Arrow } from "@/components/ui/button";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { Counter } from "@/components/counter";
import { getModels, getSectors, getSiteSettings } from "@/lib/content";
import { locations } from "@/lib/data/locations";
import { posts } from "@/lib/data/blog";
import { testimonials } from "@/lib/data/testimonials";
import { imagery, blogImage } from "@/lib/images";
import { site } from "@/lib/site";

const wrap = "mx-auto max-w-[1320px] px-[clamp(1.25rem,5vw,4.5rem)]";

export default async function HomePage() {
  const [models, sectors, settings] = await Promise.all([getModels(), getSectors(), getSiteSettings()]);
  return (
    <>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative isolate flex min-h-[100svh] items-end text-white">
        <Media src={imagery.heroEstate} rounded={false} priority className="absolute inset-0 -z-10" overlay />
        <div className={`${wrap} w-full pb-[clamp(3.5rem,9vh,7rem)] pt-[calc(var(--header-h)+3rem)]`}>
          <Reveal><p className="eyebrow !text-white/80">{site.strapline}</p></Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-3 max-w-[17ch] text-[clamp(2.6rem,6.6vw,5.6rem)] font-semibold tracking-[-0.03em]">
              The quiet way to move, beautifully made.
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 max-w-[50ch] text-[clamp(1.02rem,1.35vw,1.22rem)] font-light text-white/85">
              Bespoke electric buggies and utility vehicles for Britain&rsquo;s finest estates,
              resorts and events — configured to your exact brief and built to order.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-wrap gap-3.5">
              <Button href="/range" variant="light" size="lg">Explore the Range</Button>
              <Button href="/configure" variant="lightOutline" size="lg">Configure Yours</Button>
            </div>
          </Reveal>
        </div>
        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-[.58rem] uppercase tracking-[.28em] text-white/70">Scroll</div>
      </section>

      {/* ── Statement ────────────────────────────────── */}
      <section className={`${wrap} py-[clamp(5rem,10vw,9rem)] text-center`}>
        <Reveal><p className="eyebrow">No golf carts here</p></Reveal>
        <Reveal delay={0.08}>
          <p className="mx-auto mt-4 max-w-[26ch] text-[clamp(1.5rem,3.3vw,2.5rem)] font-medium leading-[1.25] tracking-[-0.025em]">
            We build the considered electric vehicles that move guests, families and grounds
            teams — each one made to order.
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
              <Reveal key={m.slug} delay={i * 0.06}><ModelCard model={m} /></Reveal>
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
              { n: "UK-wide", l: "Delivery & support" },
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

      {/* ── Configurator + Branding teaser ───────────── */}
      <section className="bg-paper py-[clamp(4.5rem,9vw,8.5rem)]">
        <div className={`${wrap} grid items-center gap-12 lg:grid-cols-2`}>
          <Reveal>
            <Media src={imagery.sectors["golf-clubs"]} className="aspect-[4/3]" >
              <span className="absolute left-5 top-5 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[.6rem] font-semibold uppercase tracking-[.2em] text-white backdrop-blur">Live preview</span>
            </Media>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow">The Configurator</p>
            <h2 className="mt-3 text-[clamp(1.9rem,4vw,3.1rem)]">Build it. Brand it. See it change live.</h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-2">
              Choose the model, colour, roof, wheels and interior and watch your vehicle take
              shape in real time. Upload your logo, place it on the bodywork for a branded fleet,
              then carry the whole build into a tailored quote.
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <Button href="/configure" size="lg">Start a New Build <Arrow /></Button>
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
            <SectionHeading eyebrow="Worldwide" title="Built in Britain, delivered around the world." />
            <Reveal delay={0.1}><ArrowLink href="/locations">All locations</ArrowLink></Reveal>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {locations.map((l, i) => (
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

      {/* ── Latest from the Journal ──────────────────── */}
      <section className="py-[clamp(4.5rem,9vw,8.5rem)]">
        <div className={wrap}>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="The Journal" title="Guides, insight & buyer's advice." />
            <Reveal delay={0.1}><ArrowLink href="/blog">Read the Journal</ArrowLink></Reveal>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {posts.slice(0, 3).map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.06}>
                <Link href={`/blog/${p.slug}`} className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-white transition-all hover:-translate-y-1 hover:shadow-[0_26px_44px_-30px_rgba(0,0,0,0.28)]">
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
          <Reveal><p className="mt-6 text-[.78rem] text-ink-2">Illustrative examples of the briefs we serve — not attributed to specific clients. Real, named case studies will replace these once approved.</p></Reveal>
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
