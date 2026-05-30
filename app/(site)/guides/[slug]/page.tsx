import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { Media } from "@/components/media";
import { Button, Arrow } from "@/components/ui/button";
import { posts as seedPosts, type Block } from "@/lib/data/blog";
import { getPost, getPosts } from "@/lib/content";
import { blogImage } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import { articleJsonLd, breadcrumbJsonLd, faqPageJsonLd } from "@/lib/structured-data";
import { site } from "@/lib/site";
import { ReadingProgress } from "@/components/guides/reading-progress";
import { Feedback } from "@/components/guides/feedback";
import { Poll } from "@/components/guides/poll";
import { PullQuote, Callout, KeyStats, ComparisonTable, CtaBox, FaqBlock } from "@/components/guides/article-components";

const wrap = "mx-auto max-w-[1320px] px-[clamp(1.25rem,5vw,4.5rem)]";
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function generateStaticParams() {
  return seedPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug: s } = await params;
  const p = await getPost(s);
  if (!p) return {};
  return buildMetadata({ title: p.title, description: p.excerpt, path: `/guides/${p.slug}` });
}

// Is this a Portable Text body (CMS) vs seed Block[]?
function isPT(body: unknown[]): boolean {
  return body.length > 0 && typeof body[0] === "object" && body[0] !== null && "_type" in (body[0] as object);
}
const ptText = (block: { children?: { text?: string }[] }) => (block.children ?? []).map((c) => c.text ?? "").join("");

function seedHeadings(body: Block[]) {
  return body.filter((b): b is Extract<Block, { type: "h2" }> => b.type === "h2").map((b) => b.text);
}
function ptHeadings(body: { _type?: string; style?: string; children?: { text?: string }[] }[]) {
  return body.filter((b) => b._type === "block" && b.style === "h2").map(ptText);
}

const ptComponents: PortableTextComponents = {
  block: {
    h2: ({ children, value }) => <h2 id={slug(ptText(value as { children?: { text?: string }[] }))} className="mt-12 scroll-mt-28 text-[clamp(1.4rem,2.4vw,1.9rem)]">{children}</h2>,
    blockquote: ({ children }) => <blockquote className="my-8 border-l-2 border-ink pl-6 text-[clamp(1.2rem,2vw,1.5rem)] font-medium leading-snug">{children}</blockquote>,
    normal: ({ children }) => <p className="mt-5 text-[1.075rem] leading-[1.75] text-ink-2">{children}</p>,
  },
  types: {
    callout: ({ value }) => <div className="my-8 rounded-lg border border-line bg-paper p-6 text-ink">{(value as { text?: string }).text}</div>,
  },
};

function renderSeedBlock(b: Block, i: number) {
  switch (b.type) {
    case "h2": return <h2 key={i} id={slug(b.text)} className="mt-12 scroll-mt-28 text-[clamp(1.4rem,2.4vw,1.9rem)]">{b.text}</h2>;
    case "quote": return <blockquote key={i} className="my-8 border-l-2 border-ink pl-6 text-[clamp(1.2rem,2vw,1.5rem)] font-medium leading-snug">{b.text}</blockquote>;
    case "list": return <ul key={i} className="my-6 list-disc space-y-2 pl-6 text-ink-2">{b.items.map((it, j) => <li key={j}>{it}</li>)}</ul>;
    case "pullquote": return <PullQuote key={i} text={b.text} cite={b.cite} />;
    case "callout": return <Callout key={i} tone={b.tone} title={b.title}>{b.text}</Callout>;
    case "keystats": return <KeyStats key={i} items={b.items} />;
    case "comparison": return <ComparisonTable key={i} caption={b.caption} columns={b.columns} rows={b.rows} />;
    case "cta": return <CtaBox key={i} title={b.title} text={b.text} href={b.href} label={b.label} secondaryHref={b.secondaryHref} secondaryLabel={b.secondaryLabel} />;
    case "faq": return <FaqBlock key={i} items={b.items} />;
    case "poll": return <Poll key={i} id={b.id} question={b.question} options={b.options} />;
    case "p": return <p key={i} className="mt-5 text-[1.075rem] leading-[1.75] text-ink-2">{b.text}</p>;
    default: return null;
  }
}

/** Collect FAQ items from a seed body for FAQPage JSON-LD. */
function collectFaqs(body: Block[]) {
  return body.flatMap((b) => (b.type === "faq" ? b.items.map((f) => ({ question: f.q, answer: f.a })) : []));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: s } = await params;
  const p = await getPost(s);
  if (!p) notFound();

  const all = await getPosts();
  const idx = all.findIndex((x) => x.slug === s);
  const cover = p.image ?? blogImage(idx < 0 ? 0 : idx);
  const body = (p.body ?? []) as unknown[];
  const portable = isPT(body);
  const headings = portable ? ptHeadings(body as never) : seedHeadings(body as Block[]);
  const relatedSlugs = (p as { related?: string[] }).related ?? [];
  const related = relatedSlugs.map((r) => all.find((x) => x.slug === r)).filter((x) => x !== undefined);
  const prev = all[idx - 1];
  const next = all[idx + 1];
  const dateLabel = new Date(p.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const shareUrl = `${site.url}/guides/${p.slug}`;
  const faqs = portable ? [] : collectFaqs(body as Block[]);

  return (
    <>
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd({ title: p.title, description: p.excerpt, path: `/guides/${p.slug}`, datePublished: p.date, author: p.author, image: cover })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }, { name: p.title, path: `/guides/${p.slug}` }])) }} />
      {faqs.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(faqs)) }} />}

      <section className="relative isolate flex min-h-[58svh] items-end text-white">
        <Media src={cover} rounded={false} priority className="absolute inset-0 -z-10" />
        <div className={`${wrap} w-full pb-12 pt-[calc(var(--header-h)+3rem)]`}>
          <nav aria-label="Breadcrumb" className="mb-5 text-[.7rem] uppercase tracking-[.14em] text-white/70">
            <Link href="/guides" className="hover:text-white">Guides</Link> <span className="text-white/40">/</span> {p.category}
          </nav>
          <h1 className="max-w-[20ch] text-[clamp(2rem,4.6vw,3.6rem)] text-white">{p.title}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1 text-[.85rem] text-white/80">
            <span>{p.author}</span><span className="text-white/40">·</span><span>{dateLabel}</span><span className="text-white/40">·</span><span>{p.readingTime} min read</span>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className={`${wrap} grid gap-12 lg:grid-cols-[1fr_220px]`}>
          <article className="max-w-[68ch]">
            <p className="text-[clamp(1.2rem,2vw,1.45rem)] font-medium leading-[1.5] text-ink">{p.excerpt}</p>
            {portable
              ? <div className="mt-2"><PortableText value={body as never} components={ptComponents} /></div>
              : (body as Block[]).map(renderSeedBlock)}

            <div className="mt-14 rounded-lg border border-line bg-paper p-8">
              <h3 className="text-xl">Configure your buggy</h3>
              <p className="mt-2 text-ink-2">Build, brand and price your vehicle in minutes, then request a tailored quote.</p>
              <div className="mt-5 flex flex-wrap gap-3"><Button href="/configure">Start a build <Arrow /></Button><Button href="/request-a-quote" variant="outline">Request a quote</Button></div>
            </div>

            <Feedback slug={p.slug} />

            <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-line pt-6 text-sm text-ink-2">
              <span className="text-[.7rem] font-semibold uppercase tracking-[.1em]">Share</span>
              <a className="hover:text-ink" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener">LinkedIn</a>
              <a className="hover:text-ink" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(p.title)}`} target="_blank" rel="noopener">X</a>
              <a className="hover:text-ink" href={`mailto:?subject=${encodeURIComponent(p.title)}&body=${encodeURIComponent(shareUrl)}`}>Email</a>
            </div>
            <div className="mt-6 flex justify-between gap-4 text-sm">
              {prev ? <Link href={`/guides/${prev.slug}`} className="text-ink-2 hover:text-ink">← {prev.title}</Link> : <span />}
              {next ? <Link href={`/guides/${next.slug}`} className="text-right text-ink-2 hover:text-ink">{next.title} →</Link> : <span />}
            </div>
          </article>

          {headings.length > 1 && (
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <p className="eyebrow mb-4">On this page</p>
                <ul className="space-y-2.5 border-l border-line">
                  {headings.map((h) => (
                    <li key={h}><a href={`#${slug(h)}`} className="-ml-px block border-l border-transparent pl-4 text-sm text-ink-2 transition-colors hover:border-ink hover:text-ink">{h}</a></li>
                  ))}
                </ul>
              </div>
            </aside>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-paper py-16 md:py-24">
          <div className={wrap}>
            <h2 className="text-3xl">Related reading</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {related.map((r) => (
                <Link key={r!.slug} href={`/guides/${r!.slug}`} className="group rounded-lg border border-line bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-[0_26px_44px_-30px_rgba(0,0,0,0.28)]">
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
