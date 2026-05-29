"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Cookie consent banner (GDPR/PECR + Google-ready). Stores the choice in
 * localStorage and dispatches `eb-consent` so analytics (GA4) can load only
 * after acceptance. No non-essential cookies fire before a choice is made.
 */
const KEY = "eb-cookie-consent";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      /* storage blocked */
    }
  }, []);

  const choose = (value: "accepted" | "declined") => {
    try { localStorage.setItem(KEY, value); } catch { /* ignore */ }
    window.dispatchEvent(new CustomEvent("eb-consent", { detail: value }));
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 z-[120] mx-auto max-w-3xl rounded-lg border border-line bg-white/95 p-5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-6 [padding-bottom:calc(1.25rem+env(safe-area-inset-bottom))]"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-ink-2">
          We use essential cookies to make this site work, and—with your consent—analytics to
          improve it. See our{" "}
          <Link href="/cookies" className="underline underline-offset-2 hover:text-ink">cookie notice</Link>.
        </p>
        <div className="flex flex-none gap-2">
          <button
            onClick={() => choose("declined")}
            className="rounded-[2px] border border-line-2 px-5 py-2.5 text-[.72rem] font-semibold uppercase tracking-[.06em] text-ink-2 transition-colors hover:border-ink hover:text-ink"
          >
            Decline
          </button>
          <button
            onClick={() => choose("accepted")}
            className="rounded-[2px] bg-ink px-5 py-2.5 text-[.72rem] font-semibold uppercase tracking-[.06em] text-white"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
