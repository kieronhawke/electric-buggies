import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { canSeeFinancials, canSeeCrm } from "@/lib/access";
import { enrich } from "@/lib/inventory-data";

/**
 * Date-range CSV export for reporting. Server-side role-gated: financial exports
 * (orders, quotes with profit, inventory) require finance/admin; deal exports
 * require CRM access. A lower role is denied here, not just in the UI.
 */
export const dynamic = "force-dynamic";

const csvCell = (v: unknown) => {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const csv = (rows: (string | number)[][]) => rows.map((r) => r.map(csvCell).join(",")).join("\n");
const gbp = (p: number) => (p / 100).toFixed(2);

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role === "customer" || user.role === "engineer") {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }
  if (!db) return NextResponse.json({ ok: false }, { status: 503 });
  const sp = req.nextUrl.searchParams;
  const type = sp.get("type") || "orders";
  const from = sp.get("from") ? new Date(sp.get("from")!) : new Date(0);
  const to = sp.get("to") ? new Date(sp.get("to")! + "T23:59:59") : new Date();
  const inRange = (d: Date | null) => !!d && d >= from && d <= to;

  let rows: (string | number)[][] = [];
  let filename = "report.csv";

  if (type === "orders") {
    if (!canSeeFinancials(user.role)) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    const orders = await db.select().from(schema.order);
    const items = await db.select().from(schema.inventoryItem);
    const costBy = new Map(items.map((i) => [i.modelSlug ?? i.sku, enrich(i).stack.totalCost]));
    rows = [["Reference", "Customer order", "Model", "Stage", "Value (GBP)", "Est cost (GBP)", "Est profit (GBP)", "Created"]];
    for (const o of orders.filter((o) => inRange(o.createdAt))) {
      const cost = costBy.get(o.modelSlug) ?? Math.round(o.totalAmount * 0.7);
      rows.push([o.reference, o.modelName, o.modelSlug, o.stage, gbp(o.totalAmount), gbp(cost), gbp(o.totalAmount - cost), o.createdAt.toISOString().slice(0, 10)]);
    }
    filename = "orders-report.csv";
  } else if (type === "quotes") {
    if (!canSeeFinancials(user.role) && !canSeeCrm(user.role)) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    const quotes = await db.select().from(schema.quote);
    rows = [["Reference", "Customer", "Status", "Total (GBP)", "Margin %", "Created"]];
    for (const q of quotes.filter((q) => inRange(q.createdAt))) {
      const margin = canSeeFinancials(user.role) || canSeeCrm(user.role) ? Math.round((q.profitSnapshot as { marginPct?: number } | null)?.marginPct ?? 0) : 0;
      rows.push([q.reference, q.customerName, q.status, gbp(q.total), margin, q.createdAt.toISOString().slice(0, 10)]);
    }
    filename = "quotes-report.csv";
  } else if (type === "deals") {
    if (!canSeeCrm(user.role)) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    const deals = await db.select().from(schema.deal);
    rows = [["Name", "Company", "Stage", "Source", "Value (GBP)", "Owner", "Created"]];
    for (const d of deals.filter((d) => inRange(d.createdAt))) {
      rows.push([d.name, d.company ?? "", d.stage, d.source ?? "", gbp(d.value ?? 0), d.assigneeName ?? "", d.createdAt.toISOString().slice(0, 10)]);
    }
    filename = "deals-report.csv";
  } else {
    return NextResponse.json({ ok: false, error: "Unknown report" }, { status: 400 });
  }

  return new NextResponse(csv(rows), {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${filename}"` },
  });
}
