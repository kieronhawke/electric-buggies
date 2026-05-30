import { gbpFromPence } from "@/lib/format";
import { labelForBand, type ProfitBand } from "@/lib/costing";
import { cn } from "@/lib/utils";

/**
 * Reusable colour-coded profit display. Emerald = healthy, amber = thin,
 * rose = loss / below target. Two variants: a large `standout` for the item
 * header and a compact `cell` for the list. Designed to be impossible to miss.
 */

const BAND_STANDOUT: Record<ProfitBand, string> = {
  green: "border-emerald-200 bg-emerald-50 text-emerald-900",
  amber: "border-amber-200 bg-amber-50 text-amber-900",
  red: "border-rose-200 bg-rose-50 text-rose-900",
};

const BAND_CELL: Record<ProfitBand, string> = {
  green: "border-emerald-200 bg-emerald-50 text-emerald-900",
  amber: "border-amber-200 bg-amber-50 text-amber-900",
  red: "border-rose-200 bg-rose-50 text-rose-900",
};

const BAND_DOT: Record<ProfitBand, string> = {
  green: "bg-emerald-500",
  amber: "bg-amber-500",
  red: "bg-rose-500",
};

export function ProfitBadge({
  profit,
  marginPct,
  band,
  variant = "cell",
  className,
}: {
  profit: number;
  marginPct: number;
  band: ProfitBand;
  variant?: "standout" | "cell";
  className?: string;
}) {
  const sign = profit < 0 ? "-" : "";
  const money = `${sign}${gbpFromPence(Math.abs(profit))}`;
  const pct = `${marginPct >= 0 ? "" : "-"}${Math.abs(Math.round(marginPct))}%`;

  if (variant === "standout") {
    return (
      <div className={cn("rounded-lg border p-5", BAND_STANDOUT[band], className)}>
        <div className="flex items-center gap-2 text-[.66rem] font-semibold uppercase tracking-[.12em] opacity-80">
          <span className={cn("inline-block h-2 w-2 rounded-full", BAND_DOT[band])} />
          Profit per unit
        </div>
        <div className="mt-1.5 flex flex-wrap items-baseline gap-3">
          <span className="text-[2.2rem] font-semibold leading-none tracking-[-0.02em] tabular-nums">{money}</span>
          <span className="text-[1.1rem] font-semibold tabular-nums">{pct} margin</span>
        </div>
        <div className="mt-1 text-[.82rem] font-medium opacity-90">{labelForBand[band]}</div>
      </div>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[.78rem] font-semibold tabular-nums",
        BAND_CELL[band],
        className,
      )}
      title={labelForBand[band]}
    >
      <span className={cn("inline-block h-1.5 w-1.5 rounded-full", BAND_DOT[band])} />
      {money}
      <span className="opacity-70">{pct}</span>
    </span>
  );
}
