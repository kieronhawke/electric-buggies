import Link from "next/link";
import { Arrow } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Editorial pull-quote. */
export function PullQuote({ text, cite }: { text: string; cite?: string }) {
  return (
    <figure className="my-10">
      <blockquote className="border-l-2 border-ink pl-6 text-[clamp(1.3rem,2.4vw,1.7rem)] font-medium leading-snug tracking-[-0.01em]">
        {text}
      </blockquote>
      {cite && <figcaption className="mt-3 pl-6 text-[.85rem] text-ink-2">{cite}</figcaption>}
    </figure>
  );
}

/** Callout / tip / note / warning box. */
export function Callout({ tone = "note", title, children }: { tone?: "note" | "tip" | "warn"; title?: string; children: React.ReactNode }) {
  const label = { note: "Note", tip: "Tip", warn: "Worth knowing" }[tone];
  return (
    <aside className={cn("my-8 rounded-lg border p-5 sm:p-6", tone === "warn" ? "border-amber-200 bg-amber-50" : "border-line bg-paper")}>
      <div className="text-[.66rem] font-semibold uppercase tracking-[.16em] text-ink-2">{title || label}</div>
      <div className="mt-2 text-[.98rem] leading-relaxed text-ink">{children}</div>
    </aside>
  );
}

/** Key-stat blocks (1 to 4 across). */
export function KeyStats({ items }: { items: { value: string; label: string }[] }) {
  return (
    <div className="my-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((s) => (
        <div key={s.label} className="rounded-lg border border-line bg-white p-5">
          <div className="text-[clamp(1.6rem,3vw,2.2rem)] font-semibold tracking-[-0.02em]">{s.value}</div>
          <div className="mt-1.5 text-[.78rem] leading-snug text-ink-2">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

/** Comparison table (responsive, scrolls on small screens). */
export function ComparisonTable({ caption, columns, rows }: { caption?: string; columns: string[]; rows: { label: string; cells: string[] }[] }) {
  return (
    <figure className="my-10">
      {caption && <figcaption className="mb-3 text-[.66rem] font-semibold uppercase tracking-[.16em] text-ink-2">{caption}</figcaption>}
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[480px] border-collapse text-[.92rem]">
          <thead>
            <tr className="bg-paper">
              <th className="p-3.5 text-left font-semibold" />
              {columns.map((c) => <th key={c} className="p-3.5 text-left font-semibold">{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-t border-line">
                <th scope="row" className="p-3.5 text-left font-medium text-ink-2">{r.label}</th>
                {r.cells.map((cell, i) => <td key={i} className="p-3.5">{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

/** In-article contextual CTA to a model / sector / service / quote flow. */
export function CtaBox({ title, text, href, label, secondaryHref, secondaryLabel }: { title: string; text?: string; href: string; label: string; secondaryHref?: string; secondaryLabel?: string }) {
  return (
    <div className="my-10 rounded-xl border border-line bg-paper p-6 sm:p-7">
      <h3 className="text-xl font-semibold">{title}</h3>
      {text && <p className="mt-2 text-[.98rem] leading-relaxed text-ink-2">{text}</p>}
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href={href} className="inline-flex min-h-[44px] items-center gap-2 rounded-[2px] bg-ink px-6 text-[.74rem] font-semibold uppercase tracking-[.06em] text-white transition-colors hover:bg-black">
          {label} <Arrow />
        </Link>
        {secondaryHref && secondaryLabel && (
          <Link href={secondaryHref} className="inline-flex min-h-[44px] items-center rounded-[2px] border border-ink px-6 text-[.74rem] font-semibold uppercase tracking-[.06em] transition-colors hover:bg-ink hover:text-white">
            {secondaryLabel}
          </Link>
        )}
      </div>
    </div>
  );
}

/** FAQ block (accordion). Pair with faqJsonLd(items) for FAQPage schema. */
export function FaqBlock({ items }: { items: { q: string; a: string }[] }) {
  return (
    <section className="my-10">
      <h2 className="text-[clamp(1.4rem,2.4vw,1.9rem)] font-semibold">Frequently asked questions</h2>
      <div className="mt-5 divide-y divide-line rounded-lg border border-line">
        {items.map((f) => (
          <details key={f.q} className="group">
            <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium [&::-webkit-details-marker]:hidden">
              {f.q}
              <span className="text-xl leading-none text-ink-2 transition-transform duration-300 group-open:rotate-45">+</span>
            </summary>
            <p className="px-5 pb-5 text-[.95rem] leading-relaxed text-ink-2">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
