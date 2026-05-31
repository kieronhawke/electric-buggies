import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { Media } from "@/components/media";
import { categories as seedCategories } from "@/lib/data/blog";
import { getPosts, getCategories } from "@/lib/content";
import { blogImage } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";

const wrap = "mx-auto max-w-[1320px] px-[clamp(1.25rem,5vw,4.5rem)]";

export function generateStaticParams() {
  return seedCategories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = seedCategories.find((c) => c.slug === slug);
  if (!cat) return {};
  return buildMetadata({
    title: `${cat.name} | Electric & Golf Buggy Guides`,
    description: `${cat.name} guides for electric and golf buggies: practical, expert advice on choosing, running and getting the most from your vehicles. Read the guides.`,
    path: `/guides/category/${cat.slug}`,
    ogImage: "/img/vehicles/four.webp",
    absoluteTitle: true,
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [allPosts, cats] = await Promise.all([getPosts(), getCategories()]);
  const cat = cats.find((c) => c.slug === slug) ?? seedCategories.find((c) => c.slug === slug);
  if (!cat) notFound();
  const list = allPosts.filter((p) => p.categorySlug === slug);

  return (
    <>
      <PageHero
        eyebrow="The Guides"
        title={cat.name}
        lede={`Articles and guides in ${cat.name}.`}
        crumbs={[{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }, { name: cat.name, path: `/guides/category/${cat.slug}` }]}
      />
      <section className="py-16 md:py-24">
        <div className={wrap}>
          <Reveal>
            <div className="mb-12 flex flex-wrap gap-2">
              <Link href="/guides" className="inline-flex min-h-[44px] items-center rounded-full border border-line-2 px-5 py-2 text-[.72rem] font-semibold uppercase tracking-[.12em] text-ink-2 hover:border-ink hover:text-ink">All</Link>
              {cats.map((c) => (
                <Link key={c.slug} href={`/guides/category/${c.slug}`} className={`inline-flex min-h-[44px] items-center rounded-full border px-5 py-2 text-[.72rem] font-semibold uppercase tracking-[.12em] ${c.slug === slug ? "border-ink bg-ink text-white" : "border-line-2 text-ink-2 hover:border-ink hover:text-ink"}`}>{c.name}</Link>
              ))}
            </div>
          </Reveal>
          {list.length === 0 ? (
            <p className="text-ink-2">No articles in this category yet.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {list.map((p, i) => (
                <Link key={p.slug} href={`/guides/${p.slug}`} className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-white transition-all hover:-translate-y-1 hover:shadow-[0_26px_44px_-30px_rgba(0,0,0,0.28)]">
                  <Media src={p.image ?? blogImage(i)} rounded={false} overlay={false} className="aspect-[16/10]" />
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl leading-snug">{p.title}</h3>
                    <p className="mt-2 line-clamp-2 text-[.92rem] text-ink-2">{p.excerpt}</p>
                    <span className="mt-auto pt-4 text-[.74rem] font-semibold uppercase tracking-[.04em] text-ink-2">{p.readingTime} min read</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
