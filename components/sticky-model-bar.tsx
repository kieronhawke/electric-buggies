"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SpecStrip } from "@/components/spec-strip";

/**
 * Persistent bottom bar for model pages (Tesla pattern 3). Stays pinned while
 * scrolling, has an expand chevron revealing quick specs, and a primary button
 * that ends in "Request a tailored quote". Shows "From £X" only when real.
 * No finance / monthly-payment framing.
 */
export function StickyModelBar({
  name,
  priceLabel,
  quoteHref = "/request-a-quote",
  specs,
}: {
  name: string;
  priceLabel?: string | null;
  quoteHref?: string;
  specs?: { label: string; value: string }[];
}) {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const canExpand = !!specs && specs.length > 0;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur-md transition-transform duration-300",
        "[padding-bottom:env(safe-area-inset-bottom)]",
        show ? "translate-y-0" : "translate-y-full",
      )}
    >
      {open && canExpand && (
        <div className="mx-auto max-w-[1320px] border-b border-line px-[clamp(1rem,5vw,4.5rem)] py-5">
          <div className="mx-auto max-w-[460px]">
            <SpecStrip items={specs!} />
          </div>
          <p className="mt-4 text-center text-[.72rem] text-ink-2">
            Indicative figures. Final specification and price are confirmed on quotation.
          </p>
        </div>
      )}
      <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-3 px-[clamp(1rem,5vw,4.5rem)] py-3">
        <button
          type="button"
          onClick={() => canExpand && setOpen((o) => !o)}
          className={cn("min-w-0 text-left", canExpand ? "cursor-pointer" : "cursor-default")}
          aria-expanded={canExpand ? open : undefined}
          aria-label={canExpand ? "Toggle specification summary" : undefined}
        >
          <span className="block truncate text-[.95rem] font-semibold text-ink">{name}</span>
          <span className="flex items-center gap-1.5 text-[.72rem] text-ink-2">
            {priceLabel ?? "Tailored to your brief"}
            {canExpand && (
              <svg
                viewBox="0 0 24 24"
                className={cn("h-3.5 w-3.5 transition-transform", open ? "rotate-180" : "")}
                fill="none"
                aria-hidden
              >
                <path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
        </button>

        <div className="flex flex-none items-center gap-2.5">
          <Link
            href="#details"
            className="hidden min-h-[44px] items-center rounded-[2px] border border-ink px-5 text-[.72rem] font-semibold uppercase tracking-[.06em] text-ink transition-colors hover:bg-ink hover:text-white sm:inline-flex"
          >
            Learn more
          </Link>
          <Link
            href={quoteHref}
            className="inline-flex min-h-[44px] items-center rounded-[2px] bg-ink px-5 text-[.72rem] font-semibold uppercase tracking-[.06em] text-white transition-colors hover:bg-black"
          >
            Request a tailored quote
          </Link>
        </div>
      </div>
    </div>
  );
}
