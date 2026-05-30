/**
 * Centralised costing, pricing and profit module (single source of truth).
 *
 * All money is in PENCE (integers) to match the rest of the app. Every figure
 * produced here is an ESTIMATE the admin can edit; duty / commodity code / VAT
 * treatment must be confirmed with a customs broker or accountant. This is not
 * financial or tax advice.
 *
 * The landed-cost stack:
 *   Factory price (FOB)
 *   + Shipping / freight + insurance
 *   = Customs value (CIF)
 *   + Import duty (default 10%, HS 8703 10 18, editable; anti-dumping flag)
 *   + Import VAT (default 20% of CIF + duty; "reclaimable" excludes it from
 *     cost-to-us, since a VAT-registered business recovers it)
 *   + Other fees (clearance, THC, documentation, drayage, etc.)
 *   + UK delivery + PDI + branding + warranty reserve
 *   = Total cost to us (all-in landed)
 *
 * These functions are pure and deterministic so the maths is auditable and
 * testable. Internal cost/profit DATA must never be sent to customers; that is
 * enforced by the serialisers in lib/access.ts, not here.
 */

export const HS_CODE = "8703 10 18";
export const DEFAULT_DUTY_PCT = 10;
export const DEFAULT_VAT_PCT = 20;

export interface FeeLine {
  label: string;
  amount: number; // pence
}

export interface CostInputs {
  factoryFob: number;
  freightInsurance: number;
  dutyPct: number;
  antiDumping: boolean;
  vatPct: number;
  vatReclaimable: boolean;
  otherFees: FeeLine[];
  ukDelivery: number;
  pdi: number;
  branding: number;
  warrantyReserve: number;
}

export interface CostStack {
  factoryFob: number;
  freightInsurance: number;
  cif: number;
  dutyPct: number;
  dutyAmount: number;
  antiDumping: boolean;
  vatPct: number;
  vatAmount: number;
  vatReclaimable: boolean;
  vatInCost: number; // VAT counted toward cost-to-us (0 when reclaimable)
  otherFees: FeeLine[];
  otherFeesTotal: number;
  ukDelivery: number;
  pdi: number;
  branding: number;
  warrantyReserve: number;
  landedExtras: number;
  totalCost: number; // all-in cost to us
}

const r = (n: number) => Math.round(n || 0);
const sumFees = (fees?: FeeLine[]) => (fees ?? []).reduce((s, f) => s + (r(f.amount) || 0), 0);

/** Compute the full landed-cost stack from editable inputs. */
export function buildCostStack(i: Partial<CostInputs>): CostStack {
  const factoryFob = r(i.factoryFob ?? 0);
  const freightInsurance = r(i.freightInsurance ?? 0);
  const cif = factoryFob + freightInsurance;
  const dutyPct = i.dutyPct ?? DEFAULT_DUTY_PCT;
  const dutyAmount = r((cif * dutyPct) / 100);
  const vatPct = i.vatPct ?? DEFAULT_VAT_PCT;
  const vatAmount = r(((cif + dutyAmount) * vatPct) / 100);
  const vatReclaimable = i.vatReclaimable ?? true;
  const vatInCost = vatReclaimable ? 0 : vatAmount;
  const otherFees = (i.otherFees ?? []).filter((f) => f && f.label);
  const otherFeesTotal = sumFees(otherFees);
  const ukDelivery = r(i.ukDelivery ?? 0);
  const pdi = r(i.pdi ?? 0);
  const branding = r(i.branding ?? 0);
  const warrantyReserve = r(i.warrantyReserve ?? 0);
  const landedExtras = ukDelivery + pdi + branding + warrantyReserve;
  const totalCost = cif + dutyAmount + vatInCost + otherFeesTotal + landedExtras;
  return {
    factoryFob, freightInsurance, cif, dutyPct, dutyAmount, antiDumping: !!i.antiDumping,
    vatPct, vatAmount, vatReclaimable, vatInCost, otherFees, otherFeesTotal,
    ukDelivery, pdi, branding, warrantyReserve, landedExtras, totalCost,
  };
}

export interface ProfitResult {
  cost: number;
  price: number;
  profit: number;
  marginPct: number; // profit as a percentage of price
  band: ProfitBand;
  belowCost: boolean;
}

export type ProfitBand = "green" | "amber" | "red";

// Margin thresholds for the colour-coded standout (editable business rules).
export const MARGIN_HEALTHY = 25; // >= this is green
export const MARGIN_THIN = 12; // >= this (and < healthy) is amber; below is red

/** Profit band from a margin percentage and whether we are at/under cost. */
export function profitBand(marginPct: number, belowCost: boolean): ProfitBand {
  if (belowCost || marginPct < 0) return "red";
  if (marginPct >= MARGIN_HEALTHY) return "green";
  if (marginPct >= MARGIN_THIN) return "amber";
  return "red";
}

/** Profit for a given total cost and sell price (per unit, qty applied by caller). */
export function computeProfit(cost: number, price: number): ProfitResult {
  const c = r(cost);
  const p = r(price);
  const profit = p - c;
  const marginPct = p > 0 ? (profit / p) * 100 : 0;
  const belowCost = p < c;
  return { cost: c, price: p, profit, marginPct, band: profitBand(marginPct, belowCost), belowCost };
}

/** Recommended retail price from a total cost and a target margin percentage. */
export function rrpFromMargin(totalCost: number, targetMarginPct: number): number {
  const m = Math.min(95, Math.max(0, targetMarginPct || 0));
  if (m <= 0) return r(totalCost);
  return r(totalCost / (1 - m / 100));
}

/** Effective RRP for an item: manual value, or auto-derived from target margin. */
export function effectiveRrp(item: { rrp?: number | null; targetMarginPct?: number | null; autoPrice?: boolean | null }, totalCost: number): number {
  if (item.autoPrice) return rrpFromMargin(totalCost, item.targetMarginPct ?? 30);
  return r(item.rrp ?? 0);
}

/** Apply a markup percentage to a base price. */
export function applyMarkup(base: number, pct: number): number {
  return r(base * (1 + (pct || 0) / 100));
}

/** Apply a discount: returns { was, now, saving }. discount is a percentage. */
export function applyDiscountPct(price: number, discountPct: number): { was: number; now: number; saving: number } {
  const pct = Math.min(95, Math.max(0, discountPct || 0));
  const was = r(price);
  const now = r(was * (1 - pct / 100));
  return { was, now, saving: was - now };
}

export const labelForBand: Record<ProfitBand, string> = {
  green: "Healthy margin",
  amber: "Thin margin",
  red: "Loss / below target",
};
