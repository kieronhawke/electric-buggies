import Link from "next/link";
import { Wordmark } from "./wordmark";
import { footerNav } from "@/lib/site";
import { getSiteSettings } from "@/lib/content";
import { NewsletterSignup } from "./newsletter-signup";

export async function Footer() {
  const settings = await getSiteSettings();
  const tel = settings.phone.replace(/[^+\d]/g, "");
  // Contact column reads CMS-driven email/phone (seed fallback).
  const contact = [
    { label: "Request a quote", href: "/request-a-quote" },
    { label: settings.email, href: `mailto:${settings.email}` },
    { label: settings.phone, href: `tel:${tel}` },
  ];
  const cols: Record<string, { label: string; href: string }[]> = {
    Explore: [...footerNav.Explore],
    Sectors: [...footerNav.Sectors],
    Locations: [...footerNav.Locations],
    Contact: contact,
  };

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
            <p className="eyebrow mt-6 !text-white/50">{settings.strapline}</p>
            <div className="mt-6 max-w-xs"><NewsletterSignup /></div>
          </div>
          {Object.entries(cols).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="mb-[1.1rem] text-[.7rem] font-semibold uppercase tracking-[.2em] text-white">{heading}</h4>
              <ul className="flex flex-col gap-3">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="break-words text-[.92rem] font-light text-white/70 transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6 text-[.78rem] font-light text-white/55">
          <span>&copy; {new Date().getFullYear()} {settings.name}. All rights reserved.</span>
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
