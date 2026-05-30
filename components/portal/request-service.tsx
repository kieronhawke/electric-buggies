"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createServiceRequest } from "@/lib/customer-actions";

export function RequestService({ vehicleId, modelName }: { vehicleId: string; modelName: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("service");
  const [description, setDescription] = useState("");
  const [done, setDone] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) return;
    setError("");
    start(async () => {
      const r = await createServiceRequest(vehicleId, type, description);
      if (r?.ok) { setDone(r.message || "Request received."); setDescription(""); router.refresh(); }
      else setError(r?.error || "Could not submit.");
    });
  }

  if (done) return <p className="mt-3 rounded-[4px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-[.86rem] text-emerald-800">{done}</p>;

  if (!open) {
    return <button onClick={() => setOpen(true)} className="mt-3 rounded-[2px] border border-ink px-4 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em] transition-colors hover:bg-ink hover:text-white">Request a service</button>;
  }

  return (
    <form onSubmit={submit} className="mt-3 rounded-lg border border-line bg-paper p-4">
      <p className="text-[.8rem] font-semibold">Request a service for {modelName}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {[["service", "Service"], ["fault", "Report a fault"], ["inspection", "Inspection"]].map(([v, l]) => (
          <button key={v} type="button" onClick={() => setType(v)} className={`rounded-full border px-3 py-1.5 text-[.7rem] font-semibold uppercase tracking-[.06em] ${type === v ? "border-ink bg-ink text-white" : "border-line-2 text-ink-2 hover:border-ink"}`}>{l}</button>
        ))}
      </div>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Tell us what you need…" className="mt-3 w-full rounded-[3px] border border-line-2 bg-white p-2.5 text-[.9rem] outline-none focus:border-ink" required />
      {error && <p className="mt-1 text-[.8rem] text-red-600">{error}</p>}
      <div className="mt-2 flex gap-2">
        <button type="button" onClick={() => setOpen(false)} className="rounded-[2px] border border-line-2 px-4 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em]">Cancel</button>
        <button type="submit" disabled={pending} className="rounded-[2px] bg-ink px-4 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black disabled:opacity-50">{pending ? "Sending…" : "Submit request"}</button>
      </div>
    </form>
  );
}
