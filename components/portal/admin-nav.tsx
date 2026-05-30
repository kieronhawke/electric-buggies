"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Wordmark } from "@/components/wordmark";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

// Each item lists the roles that may see it, matching the server-side
// requireRole gate on that page. Admin sees everything; finance handles
// orders/inventory/financials; sales runs the pipeline + quotes + enquiries.
const NAV: { href: string; label: string; exact?: boolean; roles: string[] }[] = [
  { href: "/admin", label: "Dashboard", exact: true, roles: ["admin", "finance", "sales"] },
  { href: "/admin/orders", label: "Orders", roles: ["admin", "finance"] },
  { href: "/admin/inventory", label: "Inventory", roles: ["admin", "finance"] },
  { href: "/admin/crm", label: "CRM", roles: ["admin", "finance", "sales"] },
  { href: "/admin/quotes", label: "Quotes", roles: ["admin", "finance", "sales"] },
  { href: "/admin/service", label: "Service", roles: ["admin"] },
  { href: "/admin/marketing", label: "Marketing", roles: ["admin"] },
  { href: "/admin/reports", label: "Reports", roles: ["admin", "finance", "sales"] },
  { href: "/admin/enquiries", label: "Enquiries", roles: ["admin", "sales"] },
  { href: "/admin/communications", label: "Comms", roles: ["admin"] },
];

export function AdminTopBar({ name, role }: { name: string; role: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const nav = NAV.filter((n) => n.roles.includes(role));
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
          {nav.map((n) => (
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
        {nav.map((n) => (
          <Link key={n.href} href={n.href} className={cn("whitespace-nowrap rounded-[3px] px-3 py-2 text-[.8rem] font-medium", active(n.href, n.exact) ? "bg-paper text-ink" : "text-ink-2")}>{n.label}</Link>
        ))}
      </nav>
    </header>
  );
}
