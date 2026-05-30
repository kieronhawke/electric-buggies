"use client";

import { useState, useTransition } from "react";
import { signOffTask } from "@/lib/task-actions";
import { cn } from "@/lib/utils";

/**
 * Compact "Sign off" button for a follow-up task. Calls the signOffTask server
 * action with a pending state and shows a tick on success (the row is removed
 * on revalidation, so the tick is a brief confirmation).
 */
export function TaskSignoff({ taskId }: { taskId: string }) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (done) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[.72rem] font-semibold text-emerald-700">
        <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
          <path d="M3 8.5l3.2 3.2L13 4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Signed off
      </span>
    );
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          setError(null);
          const res = await signOffTask(taskId);
          if (res?.ok) setDone(true);
          else setError(res?.error ?? "Could not sign off.");
        })
      }
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-line bg-white px-2.5 py-1 text-[.72rem] font-semibold transition-colors hover:border-line-2 hover:bg-paper",
        pending && "opacity-60",
      )}
      title={error ?? "Mark this task as done"}
    >
      {pending ? "Saving…" : "Sign off"}
    </button>
  );
}
