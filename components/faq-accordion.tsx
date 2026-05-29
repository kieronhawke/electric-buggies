"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Faq } from "@/lib/data/faqs";
import { cn } from "@/lib/utils";

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ul className="divide-y divide-hairline border-y border-hairline">
      {faqs.map((faq, i) => {
        const isOpen = open === i;
        return (
          <li key={faq.question}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 py-6 text-left"
            >
              <span className="font-display text-xl text-ink md:text-2xl">{faq.question}</span>
              <span
                className={cn(
                  "flex h-8 w-8 flex-none items-center justify-center rounded-full border border-hairline transition-transform duration-300",
                  isOpen && "rotate-45 border-champagne text-champagne",
                )}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-6 leading-relaxed text-ink-soft">{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
