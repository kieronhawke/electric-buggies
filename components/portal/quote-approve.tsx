"use client";

import { useState, useTransition } from "react";
import { approveQuote } from "@/lib/quote-actions";
import { cn } from "@/lib/utils";

/**
 * Approve a flagged (low-margin / high-value) quote. Admin / finance only.
 * Hidden when `canApprove` is false; the server action also enforces the role,
 * so a sales user simply sees a failure if it is ever rendered.
 */
export function QuoteApprove({
  quoteId,
  canApprove = true,
  className,
}: {
  quoteId: string;
  canApprove?: boolean;
  className?: string;
}) {
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  if (!canApprove) return null;

  function approve() {
    setError("");
    setMsg("");
    start(async () => {
      const r = await approveQuote(quoteId);
      if (r?.ok) setMsg("Approved");
      else setError(r?.error || "Could not approve.");
    });
  }

  if (msg) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[.7rem] font-semibold uppercase tracking-[.06em] text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        {msg}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex flex-col items-start gap-1", className)}>
      <button
        type="button"
        onClick={approve}
        disabled={pending}
        className="rounded-[2px] bg-ink px-3 py-1.5 text-[.66rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black disabled:opacity-50"
      >
        {pending ? "Approving…" : "Approve"}
      </button>
      {error && <span className="text-[.72rem] text-rose-600">{error}</span>}
    </span>
  );
}
