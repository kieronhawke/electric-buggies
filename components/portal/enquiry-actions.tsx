"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { markEnquiryHandled } from "@/lib/marketing-actions";

export function MarkHandled({ id }: { id: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [err, setErr] = useState("");
  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={() => { setErr(""); start(async () => { const r = await markEnquiryHandled(id); if (r?.ok) router.refresh(); else setErr(r?.error || "Could not update."); }); }}
        disabled={pending}
        className="rounded-[2px] border border-line-2 px-3 py-1.5 text-[.68rem] font-semibold uppercase tracking-[.06em] text-ink-2 transition-colors hover:border-ink hover:text-ink disabled:opacity-50">
        {pending ? "…" : "Mark handled"}
      </button>
      {err && <span className="text-[.72rem] text-rose-600">{err}</span>}
    </div>
  );
}
