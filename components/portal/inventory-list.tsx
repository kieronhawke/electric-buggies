"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createItem } from "@/lib/inventory-actions";
import { vehicleImage } from "@/lib/vehicle-image";
import { gbpFromPence } from "@/lib/format";
import { ProfitBadge } from "@/components/portal/profit-badge";
import { cn } from "@/lib/utils";

/** Plain serialisable shape passed down from the server list. */
export interface InvRow {
  id: string;
  name: string;
  sku: string;
  modelSlug: string | null;
  status: string;
  available: number;
  stockOnHand: number;
  lowStock: boolean;
  totalCost: number;
  rrp: number;
  profit: number;
  marginPct: number;
  band: "green" | "amber" | "red";
}

const ST_STYLE: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  draft: "bg-paper text-ink-2 border-line-2",
  archived: "bg-rose-50 text-rose-700 border-rose-200",
};

type SortKey = "name" | "profit" | "margin" | "stock";

export function InventoryList({ rows }: { rows: InvRow[] }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState<SortKey>("name");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let out = rows.filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      if (!needle) return true;
      return r.name.toLowerCase().includes(needle) || r.sku.toLowerCase().includes(needle);
    });
    out = [...out].sort((a, b) => {
      switch (sort) {
        case "profit": return b.profit - a.profit;
        case "margin": return b.marginPct - a.marginPct;
        case "stock": return b.available - a.available;
        default: return a.name.localeCompare(b.name);
      }
    });
    return out;
  }, [rows, q, status, sort]);

  const field = "rounded-[3px] border border-line-2 bg-white px-3 py-2 text-[.85rem] outline-none focus:border-ink";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or SKU"
            className={cn(field, "w-[200px]")}
            aria-label="Search inventory"
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={field} aria-label="Filter by status">
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className={field} aria-label="Sort">
            <option value="name">Sort: name</option>
            <option value="profit">Sort: profit</option>
            <option value="margin">Sort: margin</option>
            <option value="stock">Sort: stock</option>
          </select>
        </div>
        <AddBuggy />
      </div>

      {/* Desktop table */}
      <div className="mt-4 hidden overflow-x-auto rounded-lg border border-line bg-white md:block">
        <table className="w-full min-w-[820px] border-collapse text-[.9rem]">
          <thead>
            <tr className="border-b border-line bg-paper text-left text-[.66rem] font-semibold uppercase tracking-[.1em] text-ink-2">
              <th className="p-3.5">Buggy</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Stock</th>
              <th className="p-3.5">Total cost</th>
              <th className="p-3.5">RRP</th>
              <th className="p-3.5">Profit</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="p-5 text-ink-2">No buggies match. Adjust your filters or add one.</td></tr>
            )}
            {filtered.map((r) => (
              <tr
                key={r.id}
                onClick={() => (window.location.href = `/admin/inventory/${r.id}`)}
                className="cursor-pointer border-b border-line last:border-0 hover:bg-paper"
              >
                <td className="p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md bg-paper">
                      <Image src={vehicleImage(r.modelSlug)} alt="" fill sizes="56px" className="object-contain p-1" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-medium">{r.name}</div>
                      <div className="truncate text-[.74rem] text-ink-2 tabular-nums">{r.sku}</div>
                    </div>
                  </div>
                </td>
                <td className="p-3.5">
                  <span className={cn("rounded-full border px-2.5 py-1 text-[.62rem] font-semibold uppercase tracking-[.06em]", ST_STYLE[r.status] ?? ST_STYLE.draft)}>{r.status}</span>
                </td>
                <td className="p-3.5">
                  <span className="font-medium tabular-nums">{r.available}</span>
                  <span className="text-ink-2 tabular-nums"> / {r.stockOnHand}</span>
                  {r.lowStock && (
                    <span className="ml-2 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[.6rem] font-semibold uppercase tracking-[.06em] text-amber-800">Low</span>
                  )}
                </td>
                <td className="p-3.5 tabular-nums">{gbpFromPence(r.totalCost)}</td>
                <td className="p-3.5 tabular-nums">{r.rrp ? gbpFromPence(r.rrp) : "-"}</td>
                <td className="p-3.5"><ProfitBadge profit={r.profit} marginPct={r.marginPct} band={r.band} variant="cell" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="mt-4 flex flex-col gap-3 md:hidden">
        {filtered.length === 0 && <p className="text-[.88rem] text-ink-2">No buggies match. Adjust your filters or add one.</p>}
        {filtered.map((r) => (
          <a key={r.id} href={`/admin/inventory/${r.id}`} className="block rounded-lg border border-line bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-paper">
                <Image src={vehicleImage(r.modelSlug)} alt="" fill sizes="64px" className="object-contain p-1" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{r.name}</div>
                <div className="truncate text-[.72rem] text-ink-2 tabular-nums">{r.sku}</div>
              </div>
              <span className={cn("rounded-full border px-2 py-0.5 text-[.6rem] font-semibold uppercase tracking-[.06em]", ST_STYLE[r.status] ?? ST_STYLE.draft)}>{r.status}</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <div className="text-[.82rem] text-ink-2">
                Stock <span className="font-medium text-ink tabular-nums">{r.available}</span> / {r.stockOnHand}
                {r.lowStock && <span className="ml-2 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[.58rem] font-semibold uppercase tracking-[.06em] text-amber-800">Low</span>}
              </div>
              <ProfitBadge profit={r.profit} marginPct={r.marginPct} band={r.band} variant="cell" />
            </div>
            <div className="mt-2 flex items-center gap-4 text-[.8rem] text-ink-2 tabular-nums">
              <span>Cost {gbpFromPence(r.totalCost)}</span>
              <span>RRP {r.rrp ? gbpFromPence(r.rrp) : "-"}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function AddBuggy() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    start(async () => {
      const r = await createItem(name.trim());
      if (r?.ok && r.id) router.push(`/admin/inventory/${r.id}`);
      else setError(r?.error || "Could not create the buggy.");
    });
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="rounded-[2px] bg-ink px-5 py-2.5 text-[.74rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black">
        Add buggy
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-center gap-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New buggy name"
        autoFocus
        className="rounded-[3px] border border-line-2 bg-white px-3 py-2 text-[.85rem] outline-none focus:border-ink"
        required
      />
      <button type="submit" disabled={pending} className="rounded-[2px] bg-ink px-4 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black disabled:opacity-50">
        {pending ? "Creating…" : "Create"}
      </button>
      <button type="button" onClick={() => setOpen(false)} className="rounded-[2px] border border-line-2 px-3 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em] text-ink-2">Cancel</button>
      {error && <span className="text-[.8rem] text-rose-600">{error}</span>}
    </form>
  );
}
