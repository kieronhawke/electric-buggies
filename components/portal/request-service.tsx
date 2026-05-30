"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createServiceRequest } from "@/lib/customer-actions";
import { cn } from "@/lib/utils";

const TIERS = [
  { v: "Interim service", d: "Every 6 months / light use" },
  { v: "Full service", d: "Annual, comprehensive" },
  { v: "Major service", d: "Every 2 years / heavy use" },
];
const FAULTS = ["Battery not holding charge", "Will not start / no power", "Charging fault", "Brakes", "Motor noise or vibration", "Steering", "Lights or electrical", "Flat or damaged tyre", "Controller fault", "Other"];
const SEVERITY = [["low", "Low"], ["medium", "Medium"], ["high", "High, vehicle unusable"]];

function in7(n: number) { const d = new Date(Date.now() + n * 86400000); return d.toISOString().slice(0, 10); }
const today = new Date().toISOString().slice(0, 10);

export function RequestService({ vehicleId, modelName }: { vehicleId: string; modelName: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"service" | "fault" | "inspection">("service");
  const [tier, setTier] = useState(TIERS[1].v);
  const [faultType, setFaultType] = useState(FAULTS[0]);
  const [severity, setSeverity] = useState("medium");
  const [dates, setDates] = useState<string[]>([in7(3), in7(6), in7(9)]);
  const [description, setDescription] = useState("");
  const [done, setDone] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const setDate = (i: number, v: string) => setDates((d) => d.map((x, j) => (j === i ? v : x)));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) return setError("Please add a short description.");
    setError("");
    start(async () => {
      const r = await createServiceRequest({ vehicleId, type, description, tier: type === "service" ? tier : undefined, faultType: type === "fault" ? faultType : undefined, severity: type === "fault" ? severity : undefined, preferredDates: dates });
      if (r?.ok) { setDone(r.message || "Request received."); router.refresh(); }
      else setError(r?.error || "Could not submit.");
    });
  }

  if (done) return <p className="mt-3 flex items-center gap-2 rounded-[4px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-[.86rem] text-emerald-800"><Tick /> {done}</p>;
  if (!open) return <button onClick={() => setOpen(true)} className="mt-3 rounded-[2px] border border-ink px-4 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em] transition-colors hover:bg-ink hover:text-white">Request a service</button>;

  const field = "w-full rounded-[3px] border border-line-2 bg-white p-2.5 text-[.9rem] outline-none focus:border-ink";
  return (
    <form onSubmit={submit} className="mt-3 rounded-lg border border-line bg-paper p-4">
      <p className="text-[.8rem] font-semibold">Request a service for {modelName}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {(["service", "fault", "inspection"] as const).map((v) => (
          <button key={v} type="button" onClick={() => setType(v)} className={cn("rounded-full border px-3 py-1.5 text-[.7rem] font-semibold uppercase tracking-[.06em]", type === v ? "border-ink bg-ink text-white" : "border-line-2 text-ink-2 hover:border-ink")}>{v === "fault" ? "Report a fault" : v}</button>
        ))}
      </div>

      {type === "service" && (
        <label className="mt-3 block"><span className="mb-1 block text-[.7rem] font-semibold uppercase tracking-[.1em] text-ink-2">Service tier</span>
          <select value={tier} onChange={(e) => setTier(e.target.value)} className={field}>{TIERS.map((t) => <option key={t.v} value={t.v}>{t.v} ({t.d})</option>)}</select>
        </label>
      )}
      {type === "fault" && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="block"><span className="mb-1 block text-[.7rem] font-semibold uppercase tracking-[.1em] text-ink-2">Fault</span><select value={faultType} onChange={(e) => setFaultType(e.target.value)} className={field}>{FAULTS.map((f) => <option key={f}>{f}</option>)}</select></label>
          <label className="block"><span className="mb-1 block text-[.7rem] font-semibold uppercase tracking-[.1em] text-ink-2">Severity</span><select value={severity} onChange={(e) => setSeverity(e.target.value)} className={field}>{SEVERITY.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
        </div>
      )}

      <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder={type === "inspection" ? "Reason for inspection…" : "Describe what you need…"} className={`${field} mt-3`} required />

      <span className="mt-3 block text-[.7rem] font-semibold uppercase tracking-[.1em] text-ink-2">Preferred technician dates</span>
      <div className="mt-1.5 grid grid-cols-3 gap-2">
        {dates.map((d, i) => <input key={i} type="date" min={today} value={d} onChange={(e) => setDate(i, e.target.value)} className={field} />)}
      </div>

      {error && <p className="mt-2 text-[.8rem] text-red-600">{error}</p>}
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => setOpen(false)} className="rounded-[2px] border border-line-2 px-4 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em]">Cancel</button>
        <button type="submit" disabled={pending} className="rounded-[2px] bg-ink px-4 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black disabled:opacity-50">{pending ? "Sending…" : "Submit request"}</button>
      </div>
    </form>
  );
}

function Tick() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden><circle cx="8" cy="8" r="8" fill="currentColor" opacity="0.15" /><path d="M4.5 8.5l2.2 2.2L11.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
