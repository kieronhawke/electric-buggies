import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Media } from "@/components/media";
import { Button, Arrow } from "@/components/ui/button";
import { posts, postBySlug, type Block } from "@/lib/data/blog";
import { blogImage } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/structured-data";
import { site } from "@/lib/site";

const wrap = "mx-auto max-w-[1320px] px-[clamp(1.25rem,5vw,4.5rem)]";
const slugifyHeading = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = postBySlug(slug);
  if (!p) return {};
  return buildMetadata({ title: p.title, description: p.excerpt, path: `/blog/${p.slug}` });
}

function renderBlock(b: Block, i: number) {
  switch (b.type) {
    case "h2":
      return <h2 key={i} id={slugifyHeading(b.text)} className="mt-12 scroll-mt-28 text-[clamp(1.4rem,2.4vw,1.9rem)]">{b.text}</h2>;
    case "quote":
      return <blockquote key={i} className="my-8 border-l-2 border-ink pl-6 text-[clamp(1.2rem,2vw,1.5rem)] font-medium leading-snug">{b.text}</blockquote>;
    case "list":
      return <ul key={i} className="my-6 list-disc space-y-2 pl-6 text-ink-2 marker:text-ink-2">{b.items.map((it, j) => <li key={j}>{it}</li>)}</ul>;
    default:
      return <p key={i} className="mt-5 text-[1.075rem] leading-[1.75] text-ink-2">{b.text}</p>;
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = postBySlug(slug);
  if (!p) notFound();

  const idx = posts.findIndex((x) => x.slug === slug);
  const cover = blogImage(idx);
  const headings = p.body.filter((b): b is Extract<Block, { type: "h2" }> => b.type === "h2");
  const related = p.related.map(postBySlug).filter((x) => x !== undefined);
  const prev = posts[idx - 1];
  const next = posts[idx + 1];
  const dateLabel = new Date(p.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const shareUrl = `${site.url}/blog/${p.slug}`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd({ title: p.title, description: p.excerpt, path: `/blog/${p.slug}`, datePublished: p.date, author: p.author, image: cover })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Journal", path: "/blog" }, { name: p.title, path: `/blog/${p.slug}` }])) }} />

      {/* Hero */}
      <section className="relative isolate flex min-h-[58svh] items-end text-white">
        <Media src={cover} rounded={false} priority className="absolute inset-0 -z-10" />
        <div className={`${wrap} w-full pb-12 pt-[calc(var(--header-h)+3rem)]`}>
          <nav aria-label="Breadcrumb" className="mb-5 text-[.7rem] uppercase tracking-[.14em] text-white/70">
            <Link href="/blog" className="hover:text-white">Journal</Link> <span className="text-white/40">/</span> {p.category}
          </nav>
          <h1 className="max-w-[20ch] text-[clamp(2rem,4.6vw,3.6rem)] text-white">{p.title}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1 text-[.85rem] text-white/80">
            <span>{p.author}</span><span className="text-white/40">·</span>
            <span>{dateLabel}</span><span className="text-white/40">·</span>
            <span>{p.readingTime} min read</span>
          </div>
        </div>
      </section>

      {/* Body + TOC */}
      <section className="py-16 md:py-24">
        <div className={`${wrap} grid gap-12 lg:grid-cols-[1fr_220px]`}>
          <article className="max-w-[68ch]">
            <p className="text-[clamp(1.2rem,2vw,1.45rem)] font-medium leading-[1.5] text-ink">{p.excerpt}</p>
            {p.body.map(renderBlock)}

            {/* Contextual CTA */}
            <div className="mt-14 rounded-lg border border-line bg-paper p-8">
              <h3 className="text-xl">Configure your buggy</h3>
              <p className="mt-2 text-ink-2">Build, brand and price your vehicle in minutes — then request a tailored quote.</p>
              <div className="mt-5 flex flex-wrap gap-3"><Button href="/configure">Start a build <Arrow /></Button><Button href="/request-a-quote" variant="outline">Request a quote</Button></div>
            </div>

            {/* Share + prev/next */}
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-sm">
              <div className="flex items-center gap-3 text-ink-2">
                <span className="font-semibold uppercase tracking-[.1em] text-[.7rem]">Share</span>
                <a className="hover:text-ink" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener">LinkedIn</a>
                <a className="hover:text-ink" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(p.title)}`} target="_blank" rel="noopener">X</a>
                <a className="hover:text-ink" href={`mailto:?subject=${encodeURIComponent(p.title)}&body=${encodeURIComponent(shareUrl)}`}>Email</a>
              </div>
            </div>
            <div className="mt-6 flex justify-between gap-4 text-sm">
              {prev ? <Link href={`/blog/${prev.slug}`} className="text-ink-2 hover:text-ink">← {prev.title}</Link> : <span />}
              {next ? <Link href={`/blog/${next.slug}`} className="text-right text-ink-2 hover:text-ink">{next.title} →</Link> : <span />}
            </div>
          </article>

          {/* Sticky TOC */}
          {headings.length > 1 && (
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <p className="eyebrow mb-4">On this page</p>
                <ul className="space-y-2.5 border-l border-line">
                  {headings.map((h) => (
                    <li key={h.text}>
                      <a href={`#${slugifyHeading(h.text)}`} className="-ml-px block border-l border-transparent pl-4 text-sm text-ink-2 transition-colors hover:border-ink hover:text-ink">{h.text}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-paper py-16 md:py-24">
          <div className={wrap}>
            <h2 className="text-3xl">Related reading</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {related.map((r) => (
                <Link key={r!.slug} href={`/blog/${r!.slug}`} className="group rounded-lg border border-line bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-[0_26px_44px_-30px_rgba(0,0,0,0.28)]">
                  <span className="text-[.64rem] font-semibold uppercase tracking-[.2em] text-ink-2">{r!.category}</span>
                  <h3 className="mt-2 text-lg leading-snug">{r!.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
