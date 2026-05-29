import Link from "next/link";
import { Reveal } from "./reveal";

/** Compact editorial hero for interior pages, with breadcrumb (v2, cool light). */
export function PageHero({
  eyebrow,
  title,
  lede,
  crumbs,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  crumbs?: { name: string; path: string }[];
}) {
  return (
    <section className="border-b border-line bg-paper pt-[calc(var(--header-h)+3rem)] pb-16 md:pb-20">
      <div className="mx-auto max-w-[1320px] px-[clamp(1.25rem,5vw,4.5rem)]">
        {crumbs && (
          <Reveal>
            <nav aria-label="Breadcrumb" className="mb-7">
              <ol className="flex flex-wrap items-center gap-2 text-[.7rem] uppercase tracking-[.14em] text-ink-2">
                {crumbs.map((c, i) => (
                  <li key={c.path} className="flex items-center gap-2">
                    {i > 0 && <span className="text-line-2">/</span>}
                    {i === crumbs.length - 1 ? (
                      <span className="text-ink">{c.name}</span>
                    ) : (
                      <Link href={c.path} className="hover:text-ink">{c.name}</Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </Reveal>
        )}
        {eyebrow && <Reveal><p className="eyebrow">{eyebrow}</p></Reveal>}
        <Reveal delay={0.06}>
          <h1 className="mt-3 max-w-[20ch] text-[clamp(2.4rem,5.4vw,4.4rem)] leading-[1.02]">{title}</h1>
        </Reveal>
        {lede && (
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-[60ch] text-[clamp(1.05rem,1.4vw,1.2rem)] leading-relaxed text-ink-2">{lede}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
