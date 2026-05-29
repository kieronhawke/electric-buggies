import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { Media } from "@/components/media";
import { Arrow } from "@/components/ui/button";
import { getPosts, getCategories } from "@/lib/content";
import { blogImage } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";

const wrap = "mx-auto max-w-[1320px] px-[clamp(1.25rem,5vw,4.5rem)]";

export const metadata: Metadata = buildMetadata({
  title: "The Journal, Guides & Insight",
  description:
    "Buying guides, regulations explained, battery & range advice and sector insight for electric buggies, from the Electric Buggies team.",
  path: "/blog",
});

export default async function BlogIndex() {
  const [posts, categories] = await Promise.all([getPosts(), getCategories()]);
  const [featured, ...rest] = posts;
  return (
    <>
      <PageHero
        eyebrow="The Journal"
        title="Guides, insight & buyer's advice."
        lede="Honest, practical reading on electric buggies, costs, regulations, batteries and choosing the right vehicle for your setting."
        crumbs={[{ name: "Home", path: "/" }, { name: "Journal", path: "/blog" }]}
      />

      <section className="py-16 md:py-24">
        <div className={wrap}>
          {/* Category filter */}
          <Reveal>
            <div className="mb-12 flex flex-wrap gap-2">
              <span className="rounded-full border border-ink bg-ink px-5 py-2 text-[.72rem] font-semibold uppercase tracking-[.12em] text-white">All</span>
              {categories.map((c) => (
                <Link key={c.slug} href={`/blog/category/${c.slug}`} className="rounded-full border border-line-2 px-5 py-2 text-[.72rem] font-semibold uppercase tracking-[.12em] text-ink-2 transition-colors hover:border-ink hover:text-ink">
                  {c.name}
                </Link>
              ))}
            </div>
          </Reveal>

          {/* Featured */}
          <Reveal>
            <Link href={`/blog/${featured.slug}`} className="group grid overflow-hidden rounded-lg border border-line bg-white md:grid-cols-2">
              <Media src={featured.image ?? blogImage(0)} rounded={false} overlay={false} className="aspect-[16/10] md:aspect-auto" />
              <div className="flex flex-col justify-center p-8 md:p-12">
                <span className="text-[.64rem] font-semibold uppercase tracking-[.2em] text-ink-2">{featured.category} · Featured</span>
                <h2 className="mt-3 text-[clamp(1.6rem,3vw,2.4rem)] leading-tight">{featured.title}</h2>
                <p className="mt-3 text-ink-2">{featured.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-[.74rem] font-semibold uppercase tracking-[.04em]">Read article <Arrow className="h-4 w-4" /></span>
              </div>
            </Link>
          </Reveal>

          {/* Grid */}
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {rest.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.06}>
                <Link href={`/blog/${p.slug}`} className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-white transition-all hover:-translate-y-1 hover:shadow-[0_26px_44px_-30px_rgba(0,0,0,0.28)]">
                  <Media src={p.image ?? blogImage(i + 1)} rounded={false} overlay={false} className="aspect-[16/10]" />
                  <div className="flex flex-1 flex-col p-6">
                    <span className="text-[.64rem] font-semibold uppercase tracking-[.2em] text-ink-2">{p.category}</span>
                    <h3 className="mt-2 text-xl leading-snug">{p.title}</h3>
                    <p className="mt-2 line-clamp-2 text-[.92rem] text-ink-2">{p.excerpt}</p>
                    <span className="mt-auto pt-4 text-[.74rem] font-semibold uppercase tracking-[.04em] text-ink-2">{p.readingTime} min read</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
