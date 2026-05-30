"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Tally = { option: string; count: number };

/** Reader poll. Votes persist server-side (one per visitor); results show as bars. */
export function Poll({ id, question, options }: { id: string; question: string; options: string[] }) {
  const [tallies, setTallies] = useState<Tally[]>([]);
  const [voted, setVoted] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(`/api/poll?pollId=${encodeURIComponent(id)}`)
      .then((r) => r.json())
      .then((d) => { if (active) { setTallies(d.tallies ?? []); setVoted(d.voted ?? null); } })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [id]);

  async function vote(option: string) {
    if (voted || busy) return;
    setBusy(true);
    setVoted(option);
    try {
      const r = await fetch("/api/poll", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pollId: id, option }) });
      const d = await r.json();
      if (d.tallies) { setTallies(d.tallies); setVoted(d.voted ?? option); }
    } catch {
      setVoted(null);
    } finally {
      setBusy(false);
    }
  }

  const countFor = (o: string) => tallies.find((t) => t.option === o)?.count ?? 0;
  const total = tallies.reduce((s, t) => s + t.count, 0);
  const showResults = !!voted;

  return (
    <figure className="my-10 rounded-xl border border-line bg-white p-6 sm:p-7">
      <figcaption className="flex items-center gap-2 text-[.68rem] font-semibold uppercase tracking-[.16em] text-ink-2">
        <span aria-hidden>◆</span> Reader poll
      </figcaption>
      <p className="mt-2 text-[1.15rem] font-semibold leading-snug">{question}</p>
      <div className="mt-5 flex flex-col gap-2.5" aria-busy={loading}>
        {options.map((o) => {
          const count = countFor(o);
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          const mine = voted === o;
          if (showResults) {
            return (
              <div key={o} className="relative overflow-hidden rounded-[4px] border border-line">
                <div className={cn("absolute inset-y-0 left-0 transition-[width] duration-700 ease-out", mine ? "bg-ink" : "bg-paper-2")} style={{ width: `${pct}%` }} aria-hidden />
                <div className="relative flex items-center justify-between gap-3 px-4 py-3">
                  <span className={cn("text-[.92rem] font-medium", mine ? "text-white mix-blend-difference" : "text-ink")}>{o}{mine && " ✓"}</span>
                  <span className={cn("text-[.85rem] font-semibold tabular-nums", mine ? "text-white mix-blend-difference" : "text-ink-2")}>{pct}%</span>
                </div>
              </div>
            );
          }
          return (
            <button
              key={o}
              onClick={() => vote(o)}
              disabled={busy || loading}
              className="rounded-[4px] border border-line-2 px-4 py-3 text-left text-[.92rem] font-medium transition-colors hover:border-ink hover:bg-paper disabled:opacity-60"
            >
              {o}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-[.78rem] text-ink-2">
        {showResults ? `${total} ${total === 1 ? "vote" : "votes"} so far. Thanks for voting.` : "Tap an option to vote and see what others think."}
      </p>
    </figure>
  );
}
