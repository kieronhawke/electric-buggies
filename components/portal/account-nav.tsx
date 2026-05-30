"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Wordmark } from "@/components/wordmark";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/account", label: "Home", icon: IconHome, exact: true },
  { href: "/account/fleet", label: "Fleet", icon: IconFleet },
  { href: "/account/quotes", label: "Quotes", icon: IconQuote },
  { href: "/account/orders", label: "Orders", icon: IconOrders },
  { href: "/account/help", label: "Help", icon: IconHelp },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
}

export function AccountTopBar({ name }: { name: string }) {
  const router = useRouter();
  const pathname = usePathname();
  async function logout() {
    await signOut();
    router.push("/login");
    router.refresh();
  }
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-[60px] max-w-[1100px] items-center justify-between px-5">
        <Link href="/account" aria-label="Account home"><Wordmark href={null} size="sm" /></Link>
        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Account">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-[3px] px-3.5 py-2 text-[.82rem] font-medium transition-colors",
                isActive(pathname, item.href, item.exact) ? "bg-paper text-ink" : "text-ink-2 hover:text-ink",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden text-[.82rem] text-ink-2 sm:inline">{name}</span>
          <button onClick={logout} className="rounded-[2px] border border-line-2 px-3.5 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em] text-ink-2 transition-colors hover:border-ink hover:text-ink">
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}

export function AccountBottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Account"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur-md lg:hidden [padding-bottom:env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto grid max-w-[640px] grid-cols-5">
        {NAV.map((item) => {
          const active = isActive(pathname, item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-[58px] flex-col items-center justify-center gap-1 text-[.62rem] font-semibold tracking-[.02em] transition-colors",
                active ? "text-ink" : "text-ink-2",
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon active={active} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// ── Icons (1.5px stroke, inherit currentColor) ──────────────────────────────
type IP = { active?: boolean };
function base(active?: boolean) {
  return { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: active ? 1.9 : 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
}
function IconHome({ active }: IP) { return <svg {...base(active)}><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /></svg>; }
function IconFleet({ active }: IP) { return <svg {...base(active)}><path d="M3 13l2-5h11l2 5" /><path d="M2 16h20" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></svg>; }
function IconQuote({ active }: IP) { return <svg {...base(active)}><path d="M6 3h9l4 4v14H6z" /><path d="M9 9h7M9 13h7M9 17h4" /></svg>; }
function IconOrders({ active }: IP) { return <svg {...base(active)}><path d="M4 7l8-4 8 4-8 4-8-4z" /><path d="M4 7v10l8 4 8-4V7" /><path d="M12 11v10" /></svg>; }
function IconHelp({ active }: IP) { return <svg {...base(active)}><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 113.5 2.3c-.8.4-1 .9-1 1.7" /><path d="M12 17h.01" /></svg>; }
