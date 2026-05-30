"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireRole } from "./session";
import { db, schema } from "./db";
import { logAudit, nextReference } from "./portal-ops";
import type { FeeLine } from "./costing";

export type InvState = { ok: boolean; error?: string; id?: string } | null;

const MONEY_FIELDS = ["factoryFob", "freightInsurance", "ukDelivery", "pdi", "branding", "warrantyReserve", "rrp"] as const;
const intClamp = (n: unknown, max = 100_000_000) => Math.min(max, Math.max(0, Math.round(Number(n) || 0)));
const pctClamp = (n: unknown) => Math.min(100, Math.max(0, Math.round(Number(n) || 0)));

export interface ItemPatch {
  name?: string; modelSlug?: string | null; status?: string; specs?: Record<string, string>;
  photos?: { url: string; primary?: boolean }[]; supplierId?: string | null;
  factoryFob?: number; freightInsurance?: number; dutyPct?: number; antiDumping?: boolean;
  vatPct?: number; vatReclaimable?: boolean; otherFees?: FeeLine[];
  ukDelivery?: number; pdi?: number; branding?: number; warrantyReserve?: number;
  rrp?: number; targetMarginPct?: number; autoPrice?: boolean;
  stockOnHand?: number; stockOnOrder?: number; stockAllocated?: number; reorderPoint?: number;
  location?: string; notes?: string;
}

function sanitize(p: ItemPatch): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (p.name !== undefined) out.name = String(p.name).slice(0, 120);
  if (p.modelSlug !== undefined) out.modelSlug = p.modelSlug ? String(p.modelSlug).slice(0, 60) : null;
  if (p.status !== undefined && ["active", "draft", "archived"].includes(p.status)) out.status = p.status;
  if (p.specs !== undefined) out.specs = p.specs;
  if (p.photos !== undefined) out.photos = p.photos.slice(0, 12);
  if (p.supplierId !== undefined) out.supplierId = p.supplierId || null;
  for (const f of MONEY_FIELDS) if (p[f] !== undefined) out[f] = intClamp(p[f]);
  if (p.dutyPct !== undefined) out.dutyPct = pctClamp(p.dutyPct);
  if (p.vatPct !== undefined) out.vatPct = pctClamp(p.vatPct);
  if (p.targetMarginPct !== undefined) out.targetMarginPct = pctClamp(p.targetMarginPct);
  if (p.antiDumping !== undefined) out.antiDumping = !!p.antiDumping;
  if (p.vatReclaimable !== undefined) out.vatReclaimable = !!p.vatReclaimable;
  if (p.autoPrice !== undefined) out.autoPrice = !!p.autoPrice;
  if (p.otherFees !== undefined) out.otherFees = (p.otherFees ?? []).filter((x) => x && x.label).map((x) => ({ label: String(x.label).slice(0, 80), amount: intClamp(x.amount) })).slice(0, 20);
  if (p.stockOnHand !== undefined) out.stockOnHand = intClamp(p.stockOnHand, 100000);
  if (p.stockOnOrder !== undefined) out.stockOnOrder = intClamp(p.stockOnOrder, 100000);
  if (p.stockAllocated !== undefined) out.stockAllocated = intClamp(p.stockAllocated, 100000);
  if (p.reorderPoint !== undefined) out.reorderPoint = intClamp(p.reorderPoint, 100000);
  if (p.location !== undefined) out.location = String(p.location).slice(0, 80);
  if (p.notes !== undefined) out.notes = String(p.notes).slice(0, 4000);
  return out;
}

export async function createItem(name: string, modelSlug?: string): Promise<InvState> {
  const actor = await requireRole(["admin", "finance"]);
  if (!db) return { ok: false, error: "Unavailable." };
  const clean = String(name).trim().slice(0, 120);
  if (!clean) return { ok: false, error: "Name is required." };
  const id = crypto.randomUUID();
  const sku = `EB-${clean.toUpperCase().replace(/[^A-Z0-9]+/g, "-").slice(0, 16)}-${id.slice(0, 4)}`;
  await db.insert(schema.inventoryItem).values({ id, sku, name: clean, modelSlug: modelSlug || null, status: "draft" });
  await logAudit({ actorId: actor.id, actorName: actor.name, action: "inventory.create", entityType: "inventory_item", entityId: id, detail: { name: clean } });
  revalidatePath("/admin/inventory");
  return { ok: true, id };
}

export async function updateItem(id: string, patch: ItemPatch): Promise<InvState> {
  const actor = await requireRole(["admin", "finance"]);
  if (!db) return { ok: false, error: "Unavailable." };
  const [current] = await db.select().from(schema.inventoryItem).where(eq(schema.inventoryItem.id, id)).limit(1);
  if (!current) return { ok: false, error: "Item not found." };
  const set = sanitize(patch);
  if (Object.keys(set).length === 0) return { ok: true, id };
  set.updatedAt = new Date();

  // Log cost/price changes for the audit trail.
  const tracked: (keyof ItemPatch)[] = [...MONEY_FIELDS, "dutyPct", "vatPct", "targetMarginPct", "autoPrice"];
  for (const f of tracked) {
    if (set[f as string] !== undefined && String((current as Record<string, unknown>)[f]) !== String(set[f as string])) {
      await db.insert(schema.priceChangeLog).values({ id: crypto.randomUUID(), itemId: id, field: f as string, oldValue: String((current as Record<string, unknown>)[f] ?? ""), newValue: String(set[f as string] ?? ""), actorName: actor.name });
    }
  }
  await db.update(schema.inventoryItem).set(set as never).where(eq(schema.inventoryItem.id, id));
  await logAudit({ actorId: actor.id, actorName: actor.name, action: "inventory.update", entityType: "inventory_item", entityId: id, detail: { fields: Object.keys(set) } });
  revalidatePath("/admin/inventory");
  revalidatePath(`/admin/inventory/${id}`);
  return { ok: true, id };
}

export async function deleteItem(id: string): Promise<InvState> {
  const actor = await requireRole(["admin", "finance"]);
  if (!db) return { ok: false, error: "Unavailable." };
  // Archive rather than hard-delete so history/quotes referencing it survive.
  await db.update(schema.inventoryItem).set({ status: "archived", updatedAt: new Date() }).where(eq(schema.inventoryItem.id, id));
  await logAudit({ actorId: actor.id, actorName: actor.name, action: "inventory.archive", entityType: "inventory_item", entityId: id });
  revalidatePath("/admin/inventory");
  return { ok: true };
}

export async function duplicateItem(id: string): Promise<InvState> {
  const actor = await requireRole(["admin", "finance"]);
  if (!db) return { ok: false, error: "Unavailable." };
  const [src] = await db.select().from(schema.inventoryItem).where(eq(schema.inventoryItem.id, id)).limit(1);
  if (!src) return { ok: false, error: "Item not found." };
  const newId = crypto.randomUUID();
  await db.insert(schema.inventoryItem).values({ ...src, id: newId, sku: `${src.sku}-COPY-${newId.slice(0, 4)}`, name: `${src.name} (copy)`, status: "draft", stockOnHand: 0, stockAllocated: 0, createdAt: new Date(), updatedAt: new Date() });
  await logAudit({ actorId: actor.id, actorName: actor.name, action: "inventory.duplicate", entityType: "inventory_item", entityId: newId, detail: { from: id } });
  revalidatePath("/admin/inventory");
  return { ok: true, id: newId };
}

export async function addSupplier(form: { name: string; country?: string; contactName?: string; contactEmail?: string; leadTimeDays?: number; notes?: string }): Promise<InvState> {
  const actor = await requireRole(["admin", "finance"]);
  if (!db) return { ok: false, error: "Unavailable." };
  const name = form.name.trim().slice(0, 120);
  if (!name) return { ok: false, error: "Supplier name is required." };
  const id = crypto.randomUUID();
  await db.insert(schema.supplier).values({ id, name, country: form.country?.slice(0, 60) || null, contactName: form.contactName?.slice(0, 120) || null, contactEmail: form.contactEmail?.slice(0, 160) || null, leadTimeDays: form.leadTimeDays ? Math.round(form.leadTimeDays) : null, notes: form.notes?.slice(0, 2000) || null });
  await logAudit({ actorId: actor.id, actorName: actor.name, action: "supplier.create", entityType: "supplier", entityId: id });
  revalidatePath("/admin/inventory");
  return { ok: true, id };
}

export async function addPurchaseOrder(form: { itemId: string; supplierId?: string; quantity: number; unitCost: number; expectedAt?: string }): Promise<InvState> {
  const actor = await requireRole(["admin", "finance"]);
  if (!db) return { ok: false, error: "Unavailable." };
  const qty = Math.max(1, Math.round(form.quantity) || 1);
  const unitCost = intClamp(form.unitCost);
  const reference = await nextReference("EB-PO", schema.purchaseOrder);
  const id = crypto.randomUUID();
  await db.insert(schema.purchaseOrder).values({ id, reference, supplierId: form.supplierId || null, itemId: form.itemId, status: "ordered", quantity: qty, unitCost, totalCost: unitCost * qty, expectedAt: form.expectedAt && /^\d{4}-\d{2}-\d{2}$/.test(form.expectedAt) ? new Date(form.expectedAt) : null });
  // Reflect incoming stock.
  const [it] = await db.select().from(schema.inventoryItem).where(eq(schema.inventoryItem.id, form.itemId)).limit(1);
  if (it) await db.update(schema.inventoryItem).set({ stockOnOrder: it.stockOnOrder + qty, updatedAt: new Date() }).where(eq(schema.inventoryItem.id, form.itemId));
  await logAudit({ actorId: actor.id, actorName: actor.name, action: "po.create", entityType: "purchase_order", entityId: id, detail: { reference, qty } });
  revalidatePath("/admin/inventory");
  return { ok: true, id };
}

export async function receivePurchaseOrder(poId: string): Promise<InvState> {
  const actor = await requireRole(["admin", "finance"]);
  if (!db) return { ok: false, error: "Unavailable." };
  const [po] = await db.select().from(schema.purchaseOrder).where(eq(schema.purchaseOrder.id, poId)).limit(1);
  if (!po || po.status === "received") return { ok: false, error: "Already received." };
  await db.update(schema.purchaseOrder).set({ status: "received", receivedAt: new Date() }).where(eq(schema.purchaseOrder.id, poId));
  if (po.itemId) {
    const [it] = await db.select().from(schema.inventoryItem).where(eq(schema.inventoryItem.id, po.itemId)).limit(1);
    if (it) await db.update(schema.inventoryItem).set({ stockOnHand: it.stockOnHand + po.quantity, stockOnOrder: Math.max(0, it.stockOnOrder - po.quantity), updatedAt: new Date() }).where(eq(schema.inventoryItem.id, po.itemId));
  }
  await logAudit({ actorId: actor.id, actorName: actor.name, action: "po.receive", entityType: "purchase_order", entityId: poId });
  revalidatePath("/admin/inventory");
  return { ok: true };
}
