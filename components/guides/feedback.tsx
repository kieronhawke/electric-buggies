"use client";

import { useState } from "react";

/** "Was this helpful?" Aggregates yes/no per article (one per visitor). */
export function Feedback({ slug }: { slug: string }) {
  const [done, setDone] = useState<{ yes: number; total: number } | null>(null);
  const [busy, setBusy] = useState(false);

  async function send(helpful: boolean) {
    if (busy || done) return;
    setBusy(true);
    try {
      const r = await fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, helpful }) });
      const d = await r.json();
      setDone({ yes: d.yes ?? 0, total: d.total ?? 0 });
    } catch {
      setDone({ yes: 0, total: 0 });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-12 flex flex-wrap items-center gap-4 rounded-lg border border-line bg-paper px-6 py-5">
      {done ? (
        <p className="text-[.92rem] text-ink-2">
          Thanks for the feedback.{done.total > 0 && ` ${Math.round((done.yes / done.total) * 100)}% of readers found this helpful.`}
        </p>
      ) : (
        <>
          <span className="text-[.92rem] font-medium">Was this helpful?</span>
          <div className="flex gap-2">
            <button onClick={() => send(true)} disabled={busy} className="rounded-[2px] border border-line-2 px-4 py-2 text-[.8rem] font-semibold transition-colors hover:border-ink disabled:opacity-60">Yes</button>
            <button onClick={() => send(false)} disabled={busy} className="rounded-[2px] border border-line-2 px-4 py-2 text-[.8rem] font-semibold transition-colors hover:border-ink disabled:opacity-60">No</button>
          </div>
        </>
      )}
    </div>
  );
}
