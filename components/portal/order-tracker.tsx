import { TRACKER_STEPS, trackerIndexFor, STAGE_LABEL, formatDate, type OrderStage } from "@/lib/orders";
import { orderStageStyle } from "@/lib/status-style";
import { cn } from "@/lib/utils";

/** Horizontal progress tracker. Green for done, the stage accent for current. */
export function OrderTracker({ stage }: { stage: OrderStage }) {
  const current = trackerIndexFor(stage);
  const accent = orderStageStyle(stage).dot; // e.g. bg-amber-500
  return (
    <ol className="flex items-start">
      {TRACKER_STEPS.map((step, i) => {
        const done = i < current;
        const isCurrent = i === current;
        return (
          <li key={step.key} className="relative flex flex-1 flex-col items-center">
            {i > 0 && (
              <span aria-hidden className={cn("absolute right-1/2 top-[11px] h-[2px] w-full", i <= current ? "bg-emerald-400" : "bg-line-2")} />
            )}
            <span
              aria-hidden
              className={cn(
                "relative z-10 grid h-[22px] w-[22px] place-items-center rounded-full border-2 transition-colors",
                done && "border-emerald-500 bg-emerald-500 text-white",
                isCurrent && cn("border-transparent text-white", accent),
                !done && !isCurrent && "border-line-2 bg-white",
              )}
            >
              {done ? (
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden><path d="M2 6l2.5 2.5L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              ) : (
                <span className={cn("h-[7px] w-[7px] rounded-full", isCurrent ? "bg-white" : "bg-line-2")} />
              )}
            </span>
            <span className={cn("mt-2 w-full truncate px-0.5 text-center text-[.5rem] font-semibold uppercase leading-tight tracking-[.01em] sm:text-[.68rem] sm:tracking-[.04em]", i < current ? "text-emerald-700" : isCurrent ? "text-ink" : "text-ink-2")}>
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/** Status pill coloured by the order stage. */
export function StageBadge({ stage }: { stage: OrderStage }) {
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[.64rem] font-semibold uppercase tracking-[.08em]", orderStageStyle(stage).badge)}>
    <span className={cn("h-1.5 w-1.5 rounded-full", orderStageStyle(stage).dot)} />{STAGE_LABEL[stage]}
  </span>;
}

/** Vertical timeline of real events with dates. */
export function OrderTimeline({ events }: { events: { id: string; stage: OrderStage; title: string; detail: string | null; occurredAt: Date | string }[] }) {
  return (
    <ol className="relative ml-1">
      {events.map((e, i) => {
        const last = i === events.length - 1;
        return (
          <li key={e.id} className="relative flex gap-4 pb-6 last:pb-0">
            {!last && <span aria-hidden className="absolute left-[6px] top-4 h-full w-px bg-line-2" />}
            <span aria-hidden className={cn("relative z-10 mt-1.5 h-[13px] w-[13px] flex-none rounded-full border-2 border-white shadow-sm", orderStageStyle(e.stage).dot)} />
            <div className="flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h3 className="text-[.98rem] font-semibold">{e.title}</h3>
                <time className="text-[.78rem] text-ink-2">{formatDate(e.occurredAt)}</time>
              </div>
              {e.detail && <p className="mt-0.5 text-[.88rem] leading-relaxed text-ink-2">{e.detail}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export { STAGE_LABEL };
