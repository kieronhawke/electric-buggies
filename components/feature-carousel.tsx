"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface FeatureItem {
  label: string;
  image: string;
  blurb: string;
  href?: string;
}

/**
 * Swipeable "Meet ..." feature carousel (Tesla pattern 5): scroll-snap cards,
 * each a strong image + one-word label + a "+" to expand detail. Our imagery,
 * our copy. Mobile-first horizontal scroll; honours reduced-motion.
 */
export function FeatureCarousel({
  eyebrow,
  title,
  items,
}: {
  eyebrow?: string;
  title: string;
  items: FeatureItem[];
}) {
  return (
    <section className="py-[clamp(4.5rem,9vw,8.5rem)]">
      <div className="mx-auto mb-10 max-w-[1320px] px-[clamp(1.25rem,5vw,4.5rem)]">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="mt-3 text-[clamp(1.9rem,4vw,3.1rem)]">{title}</h2>
      </div>
      <ul
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-[clamp(1.25rem,5vw,4.5rem)] pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollPaddingLeft: "clamp(1.25rem,5vw,4.5rem)" }}
      >
        {items.map((it) => (
          <FeatureCard key={it.label} item={it} />
        ))}
      </ul>
    </section>
  );
}

function FeatureCard({ item }: { item: FeatureItem }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="relative w-[78vw] max-w-[340px] flex-none snap-start overflow-hidden rounded-lg border border-line bg-paper sm:w-[340px]">
      <div className="relative aspect-[4/5]">
        <Image
          src={item.image}
          alt={item.label}
          fill
          sizes="(max-width:640px) 78vw, 340px"
          className="object-contain p-6"
        />
        {/* Bottom gradient + label */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-paper via-paper/70 to-transparent" />
        <h3 className="absolute bottom-5 left-5 right-14 text-[1.4rem] font-light tracking-[-0.02em] text-ink">
          {item.label}
        </h3>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? `Hide ${item.label} detail` : `Show ${item.label} detail`}
          className="absolute bottom-5 right-5 grid h-9 w-9 place-items-center rounded-full border border-ink bg-white text-ink transition-colors hover:bg-ink hover:text-white"
        >
          <svg viewBox="0 0 24 24" className={cn("h-4 w-4 transition-transform", open ? "rotate-45" : "")} fill="none" aria-hidden>
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {open && (
        <div className="border-t border-line p-5">
          <p className="text-[.92rem] leading-relaxed text-ink-2">{item.blurb}</p>
          {item.href && (
            <Link
              href={item.href}
              className="mt-3 inline-flex items-center gap-2 text-[.74rem] font-semibold uppercase tracking-[.06em] text-ink hover:opacity-80"
            >
              Learn more
              <svg width="16" height="9" viewBox="0 0 18 10" fill="none" aria-hidden>
                <path d="M1 5h15M12 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </Link>
          )}
        </div>
      )}
    </li>
  );
}
