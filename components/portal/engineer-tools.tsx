"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { logServiceWork, updateServiceStatus } from "@/lib/engineer-actions";
import { cn } from "@/lib/utils";

const STATUSES: { key: "acknowledged" | "in_progress" | "resolved"; label: string }[] = [
  { key: "acknowledged", label: "Acknowledge" },
  { key: "in_progress", label: "In progress" },
  { key: "resolved", label: "Resolved" },
];

export function ServiceStatus({ serviceId, current }: { serviceId: string; current: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  function set(s: "acknowledged" | "in_progress" | "resolved") {
    start(async () => { await updateServiceStatus(serviceId, s); router.refresh(); });
  }
  return (
    <div className="flex flex-wrap gap-2">
      {STATUSES.map((s) => (
        <button key={s.key} onClick={() => set(s.key)} disabled={pending || current === s.key}
          className={cn("rounded-[2px] border px-3.5 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em] transition-colors", current === s.key ? "border-ink bg-ink text-white" : "border-line-2 hover:border-ink")}>
          {s.label}
        </button>
      ))}
    </div>
  );
}

export function ServiceLogForm({ serviceId }: { serviceId: string }) {
  const router = useRouter();
  const [f, setF] = useState({ workDone: "", diagnosis: "", parts: "", minutes: "" });
  const [visible, setVisible] = useState(true);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF((s) => ({ ...s, [k]: e.target.value }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.workDone.trim()) return;
    setError("");
    start(async () => {
      const r = await logServiceWork(serviceId, { workDone: f.workDone, diagnosis: f.diagnosis, parts: f.parts, minutes: f.minutes ? Number(f.minutes) : undefined, customerVisible: visible });
      if (r?.ok) { setF({ workDone: "", diagnosis: "", parts: "", minutes: "" }); router.refresh(); }
      else setError(r?.error || "Could not save.");
    });
  }

  const field = "w-full rounded-[3px] border border-line-2 bg-white p-2.5 text-[.9rem] outline-none focus:border-ink";
  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <label className="block"><span className="mb-1 block text-[.72rem] font-semibold uppercase tracking-[.1em] text-ink-2">Work done</span><textarea value={f.workDone} onChange={set("workDone")} rows={3} className={field} required /></label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block"><span className="mb-1 block text-[.72rem] font-semibold uppercase tracking-[.1em] text-ink-2">Diagnosis</span><input value={f.diagnosis} onChange={set("diagnosis")} className={field} /></label>
        <label className="block"><span className="mb-1 block text-[.72rem] font-semibold uppercase tracking-[.1em] text-ink-2">Parts used</span><input value={f.parts} onChange={set("parts")} className={field} /></label>
      </div>
      <label className="block max-w-[180px]"><span className="mb-1 block text-[.72rem] font-semibold uppercase tracking-[.1em] text-ink-2">Time (minutes)</span><input type="number" min="0" value={f.minutes} onChange={set("minutes")} className={field} /></label>
      <label className="flex cursor-pointer items-center gap-2 text-[.84rem] text-ink-2"><input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} className="h-4 w-4 accent-[#0a0a0b]" /> Visible to customer</label>
      {error && <p className="text-[.82rem] text-red-600">{error}</p>}
      <button type="submit" disabled={pending || !f.workDone.trim()} className="inline-flex min-h-[44px] w-auto items-center self-start rounded-[2px] bg-ink px-5 text-[.74rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black disabled:opacity-50">{pending ? "Saving…" : "Log work"}</button>
    </form>
  );
}
