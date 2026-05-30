import "server-only";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "./db";
import { buildCostStack, effectiveRrp, computeProfit, type CostStack, type ProfitResult } from "./costing";

export interface EnrichedItem {
  item: typeof schema.inventoryItem.$inferSelect;
  stack: CostStack;
  rrp: number;
  profit: ProfitResult;
  available: number;
  lowStock: boolean;
}

/** Compute the cost stack, RRP and profit for one item row (server-side). */
export function enrich(item: typeof schema.inventoryItem.$inferSelect): EnrichedItem {
  const stack = buildCostStack({
    factoryFob: item.factoryFob, freightInsurance: item.freightInsurance, dutyPct: item.dutyPct,
    antiDumping: item.antiDumping, vatPct: item.vatPct, vatReclaimable: item.vatReclaimable,
    otherFees: (item.otherFees as { label: string; amount: number }[]) ?? [],
    ukDelivery: item.ukDelivery, pdi: item.pdi, branding: item.branding, warrantyReserve: item.warrantyReserve,
  });
  const rrp = effectiveRrp(item, stack.totalCost);
  const profit = computeProfit(stack.totalCost, rrp);
  const available = item.stockOnHand - item.stockAllocated;
  const lowStock = item.status === "active" && available <= item.reorderPoint;
  return { item, stack, rrp, profit, available, lowStock };
}

export async function listInventory(): Promise<EnrichedItem[]> {
  if (!db) return [];
  const rows = await db.select().from(schema.inventoryItem).orderBy(desc(schema.inventoryItem.createdAt));
  return rows.map(enrich);
}

export async function getInventoryItem(id: string) {
  if (!db) return null;
  const [item] = await db.select().from(schema.inventoryItem).where(eq(schema.inventoryItem.id, id)).limit(1);
  if (!item) return null;
  const [units, pos, priceLog, suppliers] = await Promise.all([
    db.select().from(schema.inventoryUnit).where(eq(schema.inventoryUnit.itemId, id)),
    db.select().from(schema.purchaseOrder).where(eq(schema.purchaseOrder.itemId, id)).orderBy(desc(schema.purchaseOrder.createdAt)),
    db.select().from(schema.priceChangeLog).where(eq(schema.priceChangeLog.itemId, id)).orderBy(desc(schema.priceChangeLog.createdAt)).limit(20),
    db.select().from(schema.supplier),
  ]);
  const supplier = item.supplierId ? suppliers.find((s) => s.id === item.supplierId) ?? null : null;
  return { ...enrich(item), units, pos, priceLog, supplier, suppliers };
}

export async function listSuppliers() {
  if (!db) return [];
  return db.select().from(schema.supplier).orderBy(schema.supplier.name);
}

export async function listPurchaseOrders() {
  if (!db) return [];
  const pos = await db.select().from(schema.purchaseOrder).orderBy(desc(schema.purchaseOrder.createdAt));
  const items = await db.select().from(schema.inventoryItem);
  const suppliers = await db.select().from(schema.supplier);
  return pos.map((p) => ({ ...p, itemName: items.find((i) => i.id === p.itemId)?.name ?? "-", supplierName: suppliers.find((s) => s.id === p.supplierId)?.name ?? "-" }));
}

export interface InventoryAnalytics {
  skuCount: number;
  unitsOnHand: number;
  stockValueAtCost: number;
  stockValueAtRrp: number;
  potentialProfit: number;
  lowStockCount: number;
  byModel: { name: string; marginPct: number; profit: number; onHand: number; band: string }[];
}

/** Portfolio-level inventory analytics (admin/finance only). */
export async function inventoryAnalytics(): Promise<InventoryAnalytics> {
  const items = await listInventory();
  const active = items.filter((e) => e.item.status !== "archived");
  let stockValueAtCost = 0, stockValueAtRrp = 0, potentialProfit = 0, unitsOnHand = 0, lowStockCount = 0;
  for (const e of active) {
    const n = e.item.stockOnHand;
    unitsOnHand += n;
    stockValueAtCost += e.stack.totalCost * n;
    stockValueAtRrp += e.rrp * n;
    potentialProfit += e.profit.profit * n;
    if (e.lowStock) lowStockCount++;
  }
  const byModel = active.map((e) => ({ name: e.item.name, marginPct: e.profit.marginPct, profit: e.profit.profit, onHand: e.item.stockOnHand, band: e.profit.band }));
  return { skuCount: active.length, unitsOnHand, stockValueAtCost, stockValueAtRrp, potentialProfit, lowStockCount, byModel };
}
