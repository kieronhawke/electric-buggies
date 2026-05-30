"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Wordmark } from "@/components/wordmark";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/service", label: "Service" },
  { href: "/admin/crm", label: "CRM" },
  { href: "/admin/quotes", label: "Quotes" },
];

export function AdminTopBar({ name, role }: { name: string; role: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const active = (href: string, exact?: boolean) => (exact ? pathname === href : pathname === href || pathname.startsWith(href + "/"));
  async function logout() { await signOut(); router.push("/login"); router.refresh(); }
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <div className="mx-auto flex h-[58px] max-w-[1280px] items-center justify-between gap-4 px-5">
        <div className="flex items-center gap-6">
          <Link href="/admin" aria-label="Admin home"><Wordmark href={null} size="sm" /></Link>
          <span className="hidden rounded-full bg-ink px-2.5 py-0.5 text-[.6rem] font-semibold uppercase tracking-[.12em] text-white sm:inline">{role}</span>
        </div>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Admin">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={cn("rounded-[3px] px-3 py-2 text-[.82rem] font-medium transition-colors", active(n.href, n.exact) ? "bg-paper text-ink" : "text-ink-2 hover:text-ink")}>{n.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden text-[.82rem] text-ink-2 lg:inline">{name}</span>
          <button onClick={logout} className="rounded-[2px] border border-line-2 px-3 py-1.5 text-[.7rem] font-semibold uppercase tracking-[.06em] text-ink-2 transition-colors hover:border-ink hover:text-ink">Sign out</button>
        </div>
      </div>
      {/* Mobile nav row */}
      <nav className="flex gap-1 overflow-x-auto border-t border-line px-3 py-2 md:hidden" aria-label="Admin">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className={cn("whitespace-nowrap rounded-[3px] px-3 py-2 text-[.8rem] font-medium", active(n.href, n.exact) ? "bg-paper text-ink" : "text-ink-2")}>{n.label}</Link>
        ))}
      </nav>
    </header>
  );
}
