/**
 * Field-level access control (server-side). The single rule: customers and
 * engineers must NEVER receive internal commercial data (cost, landed cost,
 * fees breakdown, margin, profit, supplier, inventory). These serialisers strip
 * those fields BEFORE data is handed to a customer/engineer-facing render or
 * payload, so it never reaches the browser. Use them at every customer boundary;
 * never rely on client-side hiding.
 */
import type { Role } from "./session";

/** Roles permitted to see costing / margin / profit. */
export function canSeeCosting(role: Role): boolean {
  return role === "admin" || role === "finance" || role === "sales";
}

/** Roles permitted to see full financials (revenue, payments, reports). */
export function canSeeFinancials(role: Role): boolean {
  return role === "admin" || role === "finance";
}

/** Roles permitted to manage inventory. */
export function canManageInventory(role: Role): boolean {
  return role === "admin" || role === "finance";
}

/** Roles permitted to use the CRM / quote generator / pipeline. */
export function canSeeCrm(role: Role): boolean {
  return role === "admin" || role === "finance" || role === "sales";
}

export interface CustomerQuoteView {
  reference: string;
  customerName: string;
  modelSlug: string | null;
  lineItems: unknown;
  inclusions: unknown;
  status: string;
  currency: string;
  originalTotal: number | null;
  discountPct: number;
  total: number;
  estDelivery: Date | null;
  validUntil: Date | null;
  sentAt: Date | null;
}

/**
 * Reduce a full quote row to ONLY customer-facing fields. Internal fields
 * (itemId, costSnapshot, profitSnapshot, markupPct, feesApplied internals,
 * accessToken, dealId) are intentionally dropped here so they cannot leak into
 * a customer page or JSON payload.
 */
export function toCustomerQuote(q: {
  reference: string; customerName: string; modelSlug: string | null; lineItems: unknown;
  inclusions: unknown; status: string; currency: string; originalTotal: number | null;
  discountPct: number; total: number; estDelivery: Date | null; validUntil: Date | null; sentAt: Date | null;
}): CustomerQuoteView {
  return {
    reference: q.reference,
    customerName: q.customerName,
    modelSlug: q.modelSlug,
    lineItems: q.lineItems,
    inclusions: q.inclusions,
    status: q.status,
    currency: q.currency,
    originalTotal: q.originalTotal,
    discountPct: q.discountPct,
    total: q.total,
    estDelivery: q.estDelivery,
    validUntil: q.validUntil,
    sentAt: q.sentAt,
  };
}

/** Keys that must never appear in a customer/engineer payload (defensive list). */
export const INTERNAL_QUOTE_KEYS = [
  "costSnapshot", "profitSnapshot", "markupPct", "itemId", "accessToken", "dealId", "unitCost",
] as const;
