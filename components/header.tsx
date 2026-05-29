"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Wordmark } from "./wordmark";
import { primaryNav } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Transparent over the homepage's dark hero only; solid (legible) elsewhere.
  const overHero = pathname === "/";
  const solid = scrolled || mobileOpen || openMenu !== null || !overHero;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  // Body scroll lock while the mobile menu is open (brief §A).
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const open = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };

  const active = primaryNav.find((n) => n.label === openMenu);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[100] h-[var(--header-h)] transition-[background,color,box-shadow,border-color] duration-300",
        solid
          ? "bg-white/95 text-ink border-b border-line backdrop-blur-md supports-[backdrop-filter]:bg-white/90"
          : "bg-transparent text-white border-b border-transparent",
      )}
      onMouseLeave={scheduleClose}
    >
      <div className="mx-auto flex h-full max-w-[1320px] items-center justify-between px-[clamp(1.25rem,5vw,4.5rem)]">
        <div className="flex items-center gap-12">
          <Wordmark size="sm" />
          <nav className="hidden items-center gap-[2.1rem] lg:flex" aria-label="Primary">
            {primaryNav.map((item) => {
              const hasMenu = !!item.columns;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <div
                  key={item.label}
                  onMouseEnter={() => (hasMenu ? open(item.label) : setOpenMenu(null))}
                >
                  {hasMenu ? (
                    <button
                      className="relative inline-flex items-center gap-1.5 py-2 text-[.8rem] font-medium tracking-[.02em]"
                      aria-haspopup="true"
                      aria-expanded={openMenu === item.label}
                      onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                    >
                      {item.label}
                      <svg viewBox="0 0 10 6" width="9" height="9" fill="none" className={cn("opacity-60 transition-transform", openMenu === item.label && "rotate-180")}>
                        <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.4" />
                      </svg>
                      <span className={cn("absolute -bottom-0.5 left-0 right-3 h-0.5 origin-left bg-current transition-transform", openMenu === item.label ? "scale-x-100" : "scale-x-0")} />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn("relative inline-flex py-2 text-[.8rem] font-medium tracking-[.02em] transition-opacity", isActive ? "opacity-100" : "opacity-90 hover:opacity-100")}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-5">
          <Link href="/about" className="hidden text-[.8rem] font-medium lg:inline">About</Link>
          <Link
            href="/request-a-quote"
            className="hidden rounded-[2px] border border-current px-5 py-2.5 text-[.72rem] font-semibold uppercase tracking-[.08em] transition-colors hover:opacity-80 lg:inline-block"
          >
            Request a Quote
          </Link>
          <button
            className="flex flex-col gap-[5px] p-2 lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span className={cn("h-0.5 w-6 bg-current transition-transform duration-300", mobileOpen && "translate-y-[7px] rotate-45")} />
            <span className={cn("h-0.5 w-6 bg-current transition-opacity duration-300", mobileOpen && "opacity-0")} />
            <span className={cn("h-0.5 w-6 bg-current transition-transform duration-300", mobileOpen && "-translate-y-[7px] -rotate-45")} />
          </button>
        </div>
      </div>

      {/* Desktop mega panel */}
      <AnimatePresence>
        {active?.columns && (
          <motion.div
            key={active.label}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-[var(--header-h)] hidden border-y border-line bg-white text-ink shadow-[0_24px_40px_-28px_rgba(0,0,0,0.25)] lg:block"
            onMouseEnter={() => open(active.label)}
            onMouseLeave={scheduleClose}
          >
            <div className="mx-auto grid max-w-[1320px] grid-cols-[1.1fr_1fr_1fr] gap-10 px-[clamp(1.25rem,5vw,4.5rem)] py-11">
              {active.columns.map((col) => (
                <div key={col.heading}>
                  <h4 className="mb-[1.1rem] text-[.68rem] font-semibold uppercase tracking-[.22em] text-ink-2">{col.heading}</h4>
                  <ul className="flex flex-col gap-3.5">
                    {col.links.map((l) => (
                      <li key={l.label + l.href}>
                        <Link href={l.href} className="inline-flex flex-col transition-transform hover:translate-x-1">
                          <span className="text-base font-medium">{l.label}</span>
                          {l.note && <span className="text-[.82rem] text-ink-2">{l.note}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {active.feature && (
                <Link href={active.feature.href} className="relative flex min-h-[180px] flex-col justify-end overflow-hidden rounded-md p-6 ph--dark">
                  <div className="relative z-10 text-white">
                    {active.feature.eyebrow && <div className="eyebrow !text-white/80 mb-1.5">{active.feature.eyebrow}</div>}
                    <div className="text-lg font-semibold">{active.feature.title}</div>
                  </div>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 top-[var(--header-h)] z-[95] overflow-y-auto bg-white px-[clamp(1.25rem,5vw,4.5rem)] pb-12 pt-2 text-ink lg:hidden"
          >
            {primaryNav.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 + i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="border-b border-line"
              >
                {item.columns ? (
                  <details>
                    <summary className="flex cursor-pointer list-none items-center justify-between py-[1.1rem] text-lg font-semibold [&::-webkit-details-marker]:hidden">
                      {item.label}
                      <span className="text-xl font-normal text-ink-2">+</span>
                    </summary>
                    <div className="pb-4">
                      {item.columns.flatMap((c) => c.links).map((l) => (
                        <Link key={l.label + l.href} href={l.href} className="block py-2 text-ink-2">{l.label}</Link>
                      ))}
                    </div>
                  </details>
                ) : (
                  <Link href={item.href} className="block py-[1.1rem] text-lg font-semibold">{item.label}</Link>
                )}
              </motion.div>
            ))}
            <Link href="/request-a-quote" className="mt-7 inline-flex w-full items-center justify-center rounded-[2px] bg-ink px-6 py-4 text-[.78rem] font-semibold uppercase tracking-[.06em] text-white">
              Request a Quote
            </Link>
            <Link href="/about" className="mt-4 block text-center text-ink-2">About Electric Buggies</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
