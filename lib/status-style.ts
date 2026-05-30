/**
 * Functional colour for statuses across the portal. Pure (server + client).
 * `badge` = pill classes, `dot` = swatch, `isAction` flags stages where the
 * customer must do something (amber), so the UI can surface it.
 */
import type { OrderStage } from "./orders";

type Style = { badge: string; dot: string; isAction?: boolean };

const S = (badge: string, dot: string, isAction = false): Style => ({ badge, dot, isAction });

export const ORDER_STAGE_STYLE: Record<OrderStage, Style> = {
  confirmed: S("bg-blue-50 text-blue-700 border-blue-200", "bg-blue-500"),
  contract_sent: S("bg-amber-50 text-amber-800 border-amber-200", "bg-amber-500", true),
  contract_signed: S("bg-violet-50 text-violet-700 border-violet-200", "bg-violet-500"),
  payment_pending: S("bg-amber-50 text-amber-800 border-amber-200", "bg-amber-500", true),
  payment_received: S("bg-emerald-50 text-emerald-700 border-emerald-200", "bg-emerald-500"),
  in_production: S("bg-indigo-50 text-indigo-700 border-indigo-200", "bg-indigo-500"),
  quality_check: S("bg-sky-50 text-sky-700 border-sky-200", "bg-sky-500"),
  ready_for_delivery: S("bg-amber-50 text-amber-800 border-amber-200", "bg-amber-500", true),
  in_transit: S("bg-cyan-50 text-cyan-700 border-cyan-200", "bg-cyan-500"),
  delivered: S("bg-emerald-50 text-emerald-700 border-emerald-200", "bg-emerald-500"),
};

export function orderStageStyle(stage: OrderStage): Style {
  return ORDER_STAGE_STYLE[stage] ?? S("bg-paper text-ink-2 border-line-2", "bg-line-2");
}

export const SERVICE_STATUS_STYLE: Record<string, Style> = {
  received: S("bg-blue-50 text-blue-700 border-blue-200", "bg-blue-500"),
  acknowledged: S("bg-sky-50 text-sky-700 border-sky-200", "bg-sky-500"),
  engineer_assigned: S("bg-violet-50 text-violet-700 border-violet-200", "bg-violet-500"),
  in_progress: S("bg-amber-50 text-amber-800 border-amber-200", "bg-amber-500"),
  resolved: S("bg-emerald-50 text-emerald-700 border-emerald-200", "bg-emerald-500"),
};
export const serviceStatusStyle = (s: string): Style => SERVICE_STATUS_STYLE[s] ?? S("bg-paper text-ink-2 border-line-2", "bg-line-2");

export const DEAL_STAGE_STYLE: Record<string, { ring: string; dot: string; tint: string }> = {
  new: { ring: "border-blue-200", dot: "bg-blue-500", tint: "bg-blue-50/60" },
  contacted: { ring: "border-sky-200", dot: "bg-sky-500", tint: "bg-sky-50/60" },
  quote_sent: { ring: "border-violet-200", dot: "bg-violet-500", tint: "bg-violet-50/60" },
  negotiation: { ring: "border-amber-200", dot: "bg-amber-500", tint: "bg-amber-50/60" },
  won: { ring: "border-emerald-200", dot: "bg-emerald-500", tint: "bg-emerald-50/60" },
  lost: { ring: "border-red-200", dot: "bg-red-400", tint: "bg-red-50/50" },
};

export const QUOTE_STATUS_STYLE: Record<string, Style> = {
  draft: S("bg-paper text-ink-2 border-line-2", "bg-line-2"),
  sent: S("bg-blue-50 text-blue-700 border-blue-200", "bg-blue-500"),
  viewed: S("bg-sky-50 text-sky-700 border-sky-200", "bg-sky-500"),
  accepted: S("bg-emerald-50 text-emerald-700 border-emerald-200", "bg-emerald-500"),
  declined: S("bg-red-50 text-red-700 border-red-200", "bg-red-400"),
  expired: S("bg-amber-50 text-amber-800 border-amber-200", "bg-amber-500"),
};
export const quoteStatusStyle = (s: string): Style => QUOTE_STATUS_STYLE[s] ?? S("bg-paper text-ink-2 border-line-2", "bg-line-2");

/** Avatar tint for a salesperson, deterministic from their name. */
export function avatarStyle(name: string): { bg: string; initials: string } {
  const palette = ["bg-blue-600", "bg-emerald-600", "bg-violet-600", "bg-amber-600", "bg-rose-600", "bg-cyan-600"];
  const code = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return { bg: palette[code % palette.length], initials };
}
