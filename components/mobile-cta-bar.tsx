"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Sticky bottom action bar on mobile (brief §A) — appears on scroll, honours
 * safe-area insets. Two actions: configure + quote (labels configurable).
 */
export function MobileCtaBar({
  primary = { label: "Configure", href: "/configure" },
  secondary = { label: "Request a Quote", href: "/request-a-quote" },
}: {
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line bg-white/95 px-4 py-3 backdrop-blur-md transition-transform duration-300 lg:hidden",
        "[padding-bottom:calc(0.75rem+env(safe-area-inset-bottom))]",
        show ? "translate-y-0" : "translate-y-full",
      )}
    >
      <Link href={secondary.href} className="flex flex-1 items-center justify-center rounded-[2px] border border-ink py-3 text-[.72rem] font-semibold uppercase tracking-[.06em]">
        {secondary.label}
      </Link>
      <Link href={primary.href} className="flex flex-1 items-center justify-center rounded-[2px] bg-ink py-3 text-[.72rem] font-semibold uppercase tracking-[.06em] text-white">
        {primary.label}
      </Link>
    </div>
  );
}
