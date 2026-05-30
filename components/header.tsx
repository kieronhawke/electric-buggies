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
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Body scroll lock while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const clearTimers = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (openTimer.current) clearTimeout(openTimer.current);
  };

  // Hover-intent open. If a menu is already open we switch instantly (the user
  // is travelling within the nav); otherwise we wait a beat so brushing past a
  // top-level item doesn't fire the panel open.
  const openWithIntent = (label: string) => {
    clearTimers();
    if (openMenu !== null) {
      setOpenMenu(label);
    } else {
      openTimer.current = setTimeout(() => setOpenMenu(label), 90);
    }
  };

  // Delayed close keeps the menu (and the header's solid state) stable while the
  // cursor crosses the gaps between items or travels down into the panel: no
  // off-and-on flashing.
  const scheduleClose = () => {
    clearTimers();
    closeTimer.current = setTimeout(() => setOpenMenu(null), 180);
  };

  const keepOpen = (label: string) => {
    clearTimers();
    setOpenMenu(label);
  };

  const active = primaryNav.find((n) => n.label === openMenu);
  // Desktop bar stays calm with the six mega-menu sections only (Porsche/Land
  // Rover density). Guides & Bespoke remain reachable via the mega panels,
  // the footer and the full mobile menu.
  const desktopNav = primaryNav.filter((n) => n.columns);

  return (
    <>
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[100] h-[var(--header-h)] transition-[background,color,box-shadow,border-color] duration-300 ease-out",
        solid
          ? "border-b border-line bg-white/90 text-ink shadow-[0_1px_0_0_rgba(0,0,0,0.02)] backdrop-blur-md supports-[backdrop-filter]:bg-white/85"
          : "border-b border-transparent bg-transparent text-white",
      )}
      onMouseLeave={scheduleClose}
    >
      <div className="mx-auto flex h-full max-w-[1320px] items-center justify-between px-[clamp(1.25rem,5vw,4.5rem)]">
        <div className="flex items-center gap-8 xl:gap-12">
          <Wordmark size="sm" />
          <nav className="hidden items-center gap-5 lg:flex xl:gap-[1.9rem]" aria-label="Primary">
            {desktopNav.map((item) => {
              const hasMenu = !!item.columns;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const isOpen = openMenu === item.label;
              return (
                <div
                  key={item.label}
                  className="flex h-[var(--header-h)] items-center whitespace-nowrap"
                  onMouseEnter={() => (hasMenu ? openWithIntent(item.label) : scheduleClose())}
                >
                  {hasMenu ? (
                    <button
                      className="group relative inline-flex items-center gap-1.5 rounded-[2px] py-2 text-[.82rem] font-medium tracking-[.01em] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
                      aria-haspopup="true"
                      aria-expanded={isOpen}
                      onClick={() => (isOpen ? setOpenMenu(null) : keepOpen(item.label))}
                    >
                      <span className={cn("transition-opacity duration-200", isOpen || isActive ? "opacity-100" : "opacity-80 group-hover:opacity-100")}>
                        {item.label}
                      </span>
                      <svg viewBox="0 0 10 6" width="9" height="9" fill="none" aria-hidden className={cn("opacity-50 transition-transform duration-300", isOpen && "rotate-180")}>
                        <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className={cn("absolute -bottom-[3px] left-0 right-0 h-px origin-center bg-current transition-transform duration-300 ease-out", isOpen ? "scale-x-100" : "scale-x-0")} />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className="group relative inline-flex rounded-[2px] py-2 text-[.82rem] font-medium tracking-[.01em] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
                    >
                      <span className={cn("transition-opacity duration-200", isActive ? "opacity-100" : "opacity-80 group-hover:opacity-100")}>
                        {item.label}
                      </span>
                      <span className={cn("absolute -bottom-[3px] left-0 right-0 h-px origin-center bg-current transition-transform duration-300 ease-out", isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100")} />
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-5" onMouseEnter={scheduleClose}>
          <Link
            href="/about"
            className="hidden whitespace-nowrap rounded-[2px] py-2 text-[.82rem] font-medium opacity-80 outline-none transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current xl:inline"
          >
            About
          </Link>
          <Link
            href="/request-a-quote"
            className="hidden rounded-[2px] border border-current px-5 py-2.5 text-[.72rem] font-semibold uppercase tracking-[.08em] transition-[background-color,color,opacity] duration-200 hover:opacity-70 lg:inline-block"
          >
            Request a Quote
          </Link>
          <button
            className="-mr-2 flex flex-col gap-[5px] p-3 lg:hidden"
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

      {/* Desktop mega panel: one persistent panel that stays mounted while any
          menu is open; only its inner content crossfades when switching items,
          so the panel itself never flickers open/closed mid-traversal. */}
      <AnimatePresence>
        {active?.columns && (
          <motion.div
            key="mega"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-[var(--header-h)] hidden border-b border-line bg-white text-ink shadow-[0_28px_50px_-32px_rgba(0,0,0,0.3)] lg:block"
            onMouseEnter={() => keepOpen(active.label)}
            onMouseLeave={scheduleClose}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active.label}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                className="mx-auto grid max-w-[1320px] grid-cols-[1.1fr_1fr_1fr] gap-10 px-[clamp(1.25rem,5vw,4.5rem)] py-11"
              >
                {active.columns.map((col) => (
                  <div key={col.heading}>
                    <h4 className="mb-[1.1rem] text-[.66rem] font-semibold uppercase tracking-[.22em] text-ink-2">{col.heading}</h4>
                    <ul className="flex flex-col gap-1">
                      {col.links.map((l) => (
                        <li key={l.label + l.href}>
                          <Link
                            href={l.href}
                            className="-mx-3 flex flex-col rounded-[3px] px-3 py-2 outline-none transition-colors hover:bg-paper focus-visible:bg-paper"
                          >
                            <span className="text-[.98rem] font-medium">{l.label}</span>
                            {l.note && <span className="mt-0.5 text-[.82rem] text-ink-2">{l.note}</span>}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {active.feature && (
                  <Link href={active.feature.href} className="group relative flex min-h-[180px] flex-col justify-end overflow-hidden rounded-md p-6 ph--dark outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative z-10 text-white">
                      {active.feature.eyebrow && <div className="eyebrow !text-white/80 mb-1.5">{active.feature.eyebrow}</div>}
                      <div className="text-lg font-semibold">{active.feature.title}</div>
                    </div>
                  </Link>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </header>

      {/* Mobile full-screen menu: rendered OUTSIDE <header> because the header
          carries a backdrop-filter, which would otherwise become the containing
          block for this position:fixed panel and collapse it to header height. */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 top-[var(--header-h)] z-[95] overflow-y-auto overscroll-contain bg-white px-[clamp(1.25rem,5vw,4.5rem)] pb-12 pt-2 text-ink lg:hidden"
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
                  <details className="group">
                    <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between py-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                      {item.label}
                      <span className="text-2xl font-normal leading-none text-ink-2 transition-transform duration-300 group-open:rotate-45">+</span>
                    </summary>
                    <div className="pb-3">
                      {item.columns.flatMap((c) => c.links).map((l) => (
                        <Link key={l.label + l.href} href={l.href} className="block min-h-[48px] py-3 text-ink-2">{l.label}</Link>
                      ))}
                    </div>
                  </details>
                ) : (
                  <Link href={item.href} className="flex min-h-[56px] items-center py-4 text-lg font-semibold">{item.label}</Link>
                )}
              </motion.div>
            ))}
            <Link href="/request-a-quote" className="mt-8 inline-flex min-h-[52px] w-full items-center justify-center rounded-[2px] bg-ink px-6 text-[.78rem] font-semibold uppercase tracking-[.06em] text-white">
              Request a Quote
            </Link>
            <Link href="/about" className="mt-4 flex min-h-[48px] items-center justify-center text-center text-ink-2">About Electric Buggies</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
