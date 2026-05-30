"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createQuote } from "@/lib/quote-actions";

export function QuoteCreate() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ customerName: "", customerEmail: "", totalPounds: "", summary: "" });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF((s) => ({ ...s, [k]: e.target.value }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setMsg("");
    start(async () => {
      const r = await createQuote({ customerName: f.customerName, customerEmail: f.customerEmail, totalPounds: Number(f.totalPounds), summary: f.summary });
      if (r?.ok) { setMsg("Quote created and emailed to the customer."); setF({ customerName: "", customerEmail: "", totalPounds: "", summary: "" }); router.refresh(); }
      else setError(r?.error || "Could not create quote.");
    });
  }

  const field = "w-full rounded-[3px] border border-line-2 bg-white p-2.5 text-[.9rem] outline-none focus:border-ink";
  if (!open) return <button onClick={() => setOpen(true)} className="rounded-[2px] bg-ink px-5 py-2.5 text-[.74rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black">New quote</button>;

  return (
    <form onSubmit={submit} className="rounded-lg border border-line bg-white p-5">
      <h2 className="text-[.74rem] font-semibold uppercase tracking-[.12em] text-ink-2">New quote</h2>
      {msg && <p className="mt-2 rounded-[4px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-[.82rem] text-emerald-800">{msg}</p>}
      {error && <p className="mt-2 text-[.82rem] text-red-600">{error}</p>}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <input value={f.customerName} onChange={set("customerName")} placeholder="Customer name" className={field} required />
        <input type="email" value={f.customerEmail} onChange={set("customerEmail")} placeholder="Customer email" className={field} required />
      </div>
      <input type="number" min="1" value={f.totalPounds} onChange={set("totalPounds")} placeholder="Total (GBP)" className={`${field} mt-3`} required />
      <textarea value={f.summary} onChange={set("summary")} rows={3} placeholder="What the quote covers…" className={`${field} mt-3`} required />
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => setOpen(false)} className="rounded-[2px] border border-line-2 px-4 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em]">Close</button>
        <button type="submit" disabled={pending} className="rounded-[2px] bg-ink px-4 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black disabled:opacity-50">{pending ? "Creating…" : "Create & send"}</button>
      </div>
    </form>
  );
}
