"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { ModelSpec } from "@/lib/data/models";

const labels: Record<keyof ModelSpec, string> = {
  seats: "Seats",
  range: "Range",
  battery: "Battery",
  topSpeed: "Top speed",
  dimensions: "Dimensions (L×W×H)",
  charge: "Charge time",
};

/** Slide-in technical-data drawer, Porsche-style (brief §5). */
export function TechDrawer({ specs, modelName }: { specs: ModelSpec; modelName: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.16em] text-champagne-deep transition-colors hover:text-ink"
      >
        Technical data
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 right-0 z-[61] w-full max-w-md overflow-y-auto bg-white p-8 md:p-10"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-label={`${modelName} technical data`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="eyebrow">Technical data</p>
                  <h2 className="mt-2 font-display text-3xl text-ink">{modelName}</h2>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="text-ink-soft hover:text-ink"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
              </div>

              <dl className="mt-8 divide-y divide-hairline">
                {(Object.keys(labels) as (keyof ModelSpec)[]).map((key) => (
                  <div key={key} className="flex items-baseline justify-between py-4">
                    <dt className="text-sm uppercase tracking-[0.12em] text-ink-soft">
                      {labels[key]}
                    </dt>
                    <dd className="font-display text-xl text-ink">{specs[key]}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-8 text-xs leading-relaxed text-ink-soft">
                Figures are indicative and vary by specification, terrain and load. Final
                specification is confirmed at the point of quotation.
              </p>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
