import { requireRole } from "@/lib/session";
import { listInventory, inventoryAnalytics } from "@/lib/inventory-data";
import { gbpFromPence } from "@/lib/format";
import { InventoryList, type InvRow } from "@/components/portal/inventory-list";
import { cn } from "@/lib/utils";

export const ESTIMATES_NOTE =
  "All cost, duty, VAT and fee figures are estimates you can edit. Confirm commodity code, duty (anti-dumping can apply) and VAT treatment with a customs broker or accountant. Not financial or tax advice.";

export default async function AdminInventory() {
  await requireRole(["admin", "finance"]);
  const [items, analytics] = await Promise.all([listInventory(), inventoryAnalytics()]);

  const rows: InvRow[] = items.map((e) => ({
    id: e.item.id,
    name: e.item.name,
    sku: e.item.sku,
    modelSlug: e.item.modelSlug,
    status: e.item.status,
    available: e.available,
    stockOnHand: e.item.stockOnHand,
    lowStock: e.lowStock,
    totalCost: e.stack.totalCost,
    rrp: e.rrp,
    profit: e.profit.profit,
    marginPct: e.profit.marginPct,
    band: e.profit.band,
  }));

  const cards: { label: string; value: string; tone?: "good" | "warn" }[] = [
    { label: "SKUs", value: String(analytics.skuCount) },
    { label: "Units on hand", value: String(analytics.unitsOnHand) },
    { label: "Stock value at cost", value: gbpFromPence(analytics.stockValueAtCost) },
    { label: "Stock value at RRP", value: gbpFromPence(analytics.stockValueAtRrp) },
    { label: "Potential profit in stock", value: gbpFromPence(analytics.potentialProfit), tone: "good" },
    { label: "Low stock", value: String(analytics.lowStockCount), tone: analytics.lowStockCount > 0 ? "warn" : undefined },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-semibold tracking-[-0.02em]">Inventory</h1>
          <p className="mt-1 text-[.9rem] text-ink-2">Landed cost, pricing and stock per buggy, with live profit and margin.</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-6">
        {cards.map((c) => (
          <div
            key={c.label}
            className={cn(
              "rounded-lg border bg-white p-5",
              c.tone === "good" ? "border-emerald-200 bg-emerald-50" : c.tone === "warn" ? "border-amber-200 bg-amber-50" : "border-line",
            )}
          >
            <div
              className={cn(
                "text-[1.45rem] font-semibold tracking-[-0.02em] tabular-nums",
                c.tone === "good" ? "text-emerald-800" : c.tone === "warn" ? "text-amber-800" : "",
              )}
            >
              {c.value}
            </div>
            <div className={cn("mt-1 text-[.78rem]", c.tone === "good" ? "text-emerald-700" : c.tone === "warn" ? "text-amber-800" : "text-ink-2")}>{c.label}</div>
          </div>
        ))}
      </div>

      <p className="mt-4 rounded-[4px] border border-line bg-paper px-3.5 py-2.5 text-[.78rem] leading-relaxed text-ink-2">{ESTIMATES_NOTE}</p>

      <div className="mt-6">
        <InventoryList rows={rows} />
      </div>
    </div>
  );
}
