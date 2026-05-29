import Link from "next/link";
import { Wordmark } from "./wordmark";
import { site, footerNav } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-ink text-white/70">
      <div className="mx-auto max-w-[1320px] px-[clamp(1.25rem,5vw,4.5rem)] py-[clamp(3.5rem,6vw,5rem)]">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Wordmark href={null} className="text-white" />
            <p className="mt-5 max-w-[32ch] text-[.92rem] font-light text-white/70">
              Bespoke electric buggies and utility vehicles, built to order in Britain for
              estates, resorts, events and private land.
            </p>
            <p className="eyebrow mt-6 !text-white/50">{site.strapline}</p>
          </div>
          {Object.entries(footerNav).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="mb-[1.1rem] text-[.7rem] font-semibold uppercase tracking-[.2em] text-white">{heading}</h4>
              <ul className="flex flex-col gap-3">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[.92rem] font-light text-white/70 transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6 text-[.78rem] font-light text-white/55">
          <span>&copy; {new Date().getFullYear()} {site.name}. All rights reserved.</span>
          <span className="flex flex-wrap gap-x-5 gap-y-1">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/cookies" className="hover:text-white">Cookies</Link>
            <span>Bespoke Electric Vehicles · United Kingdom</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
