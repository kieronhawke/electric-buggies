"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { assignDeal } from "@/lib/crm-actions";
import { SALES_TEAM } from "@/lib/crm-constants";
import { avatarStyle } from "@/lib/status-style";
import { cn } from "@/lib/utils";

export function AssignDeal({ dealId, current }: { dealId: string; current: string | null }) {
  const router = useRouter();
  const [value, setValue] = useState(current ?? "");
  const [msg, setMsg] = useState(""); const [err, setErr] = useState("");
  const [pending, start] = useTransition();
  const av = avatarStyle(value || current || "EB");

  function onChange(next: string) {
    setValue(next); setErr(""); setMsg("");
    if (!next || next === current) return;
    start(async () => {
      const r = await assignDeal(dealId, next);
      if (r?.ok) { setMsg("Reassigned."); router.refresh(); }
      else { setErr(r?.error || "Could not reassign."); setValue(current ?? ""); }
    });
  }

  return (
    <div className="rounded-lg border border-line bg-white p-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className={cn("grid h-8 w-8 flex-none place-items-center rounded-full text-[.7rem] font-bold text-white", av.bg)}>{av.initials}</span>
        <span className="text-[.9rem]">Owned by <b>{value || "Unassigned"}</b></span>
        <label className="ml-auto flex items-center gap-2">
          <span className="text-[.68rem] font-semibold uppercase tracking-[.1em] text-ink-2">Assign</span>
          <select value={value} onChange={(e) => onChange(e.target.value)} disabled={pending}
            className="rounded-[3px] border border-line-2 bg-white p-2 text-[.85rem] outline-none focus:border-ink disabled:opacity-50">
            <option value="">Unassigned</option>
            {SALES_TEAM.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
      </div>
      {pending && <p className="mt-2 text-[.8rem] text-ink-2">Saving…</p>}
      {msg && <p className="mt-2 text-[.8rem] text-emerald-700">{msg}</p>}
      {err && <p className="mt-2 rounded-[4px] border border-rose-200 bg-rose-50 px-3 py-2 text-[.8rem] text-rose-700">{err}</p>}
    </div>
  );
}
