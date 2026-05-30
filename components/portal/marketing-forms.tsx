"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCampaign, logEnquiry, updateCampaignMetrics } from "@/lib/marketing-actions";

const field = "w-full rounded-[3px] border border-line-2 bg-white p-2.5 text-[.9rem] outline-none focus:border-ink";

export function CampaignForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: "", channel: "google_ads", budgetPounds: "", startDate: "", endDate: "", note: "" });
  const [error, setError] = useState(""); const [pending, start] = useTransition();
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF((s) => ({ ...s, [k]: e.target.value }));
  function submit(e: React.FormEvent) {
    e.preventDefault(); setError("");
    start(async () => {
      const r = await createCampaign({ name: f.name, channel: f.channel, budgetPounds: Number(f.budgetPounds) || 0, startDate: f.startDate || undefined, endDate: f.endDate || undefined, note: f.note });
      if (r?.ok) { setF({ name: "", channel: "google_ads", budgetPounds: "", startDate: "", endDate: "", note: "" }); setOpen(false); router.refresh(); }
      else setError(r?.error || "Could not save.");
    });
  }
  if (!open) return <button onClick={() => setOpen(true)} className="rounded-[2px] bg-ink px-5 py-2.5 text-[.74rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black">Add campaign</button>;
  return (
    <form onSubmit={submit} className="rounded-lg border border-line bg-white p-5">
      <h2 className="text-[.74rem] font-semibold uppercase tracking-[.12em] text-ink-2">New campaign</h2>
      {error && <p className="mt-2 text-[.82rem] text-red-600">{error}</p>}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <input value={f.name} onChange={set("name")} placeholder="Campaign name" className={field} required />
        <select value={f.channel} onChange={set("channel")} className={field}><option value="email">Email</option><option value="google_ads">Google Ads</option><option value="social">Social</option><option value="other">Other</option></select>
        <input type="number" min="0" value={f.budgetPounds} onChange={set("budgetPounds")} placeholder="Budget (GBP)" className={field} />
        <div className="grid grid-cols-2 gap-2"><input type="date" value={f.startDate} onChange={set("startDate")} className={field} /><input type="date" value={f.endDate} onChange={set("endDate")} className={field} /></div>
      </div>
      <textarea value={f.note} onChange={set("note")} rows={2} placeholder="Notes…" className={`${field} mt-3`} />
      <div className="mt-3 flex gap-2"><button type="button" onClick={() => setOpen(false)} className="rounded-[2px] border border-line-2 px-4 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em]">Close</button><button type="submit" disabled={pending} className="rounded-[2px] bg-ink px-4 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black disabled:opacity-50">{pending ? "Saving…" : "Add"}</button></div>
    </form>
  );
}

export function CampaignMetrics({ id, spentPounds, leads, conversions }: { id: string; spentPounds: number; leads: number; conversions: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ spent: String(spentPounds), leads: String(leads), conversions: String(conversions) });
  const [msg, setMsg] = useState(""); const [error, setError] = useState(""); const [pending, start] = useTransition();
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF((s) => ({ ...s, [k]: e.target.value }));
  function submit(e: React.FormEvent) {
    e.preventDefault(); setError(""); setMsg("");
    start(async () => {
      const r = await updateCampaignMetrics(id, Number(f.spent) || 0, Number(f.leads) || 0, Number(f.conversions) || 0);
      if (r?.ok) { setMsg("Saved."); setOpen(false); router.refresh(); }
      else setError(r?.error || "Could not save.");
    });
  }
  if (!open) return <button onClick={() => setOpen(true)} className="rounded-[2px] border border-line-2 px-2.5 py-1 text-[.62rem] font-semibold uppercase tracking-[.06em] text-ink-2 transition-colors hover:border-ink hover:text-ink">Update results</button>;
  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-2 rounded-[6px] border border-line bg-paper p-2.5">
      <label className="block"><span className="mb-1 block text-[.6rem] font-semibold uppercase tracking-[.08em] text-ink-2">Spent £</span><input type="number" min="0" value={f.spent} onChange={set("spent")} className={`${field} w-24`} /></label>
      <label className="block"><span className="mb-1 block text-[.6rem] font-semibold uppercase tracking-[.08em] text-ink-2">Leads</span><input type="number" min="0" value={f.leads} onChange={set("leads")} className={`${field} w-20`} /></label>
      <label className="block"><span className="mb-1 block text-[.6rem] font-semibold uppercase tracking-[.08em] text-ink-2">Conv.</span><input type="number" min="0" value={f.conversions} onChange={set("conversions")} className={`${field} w-20`} /></label>
      <button type="submit" disabled={pending} className="rounded-[2px] bg-ink px-3 py-2 text-[.62rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black disabled:opacity-50">{pending ? "Saving…" : "Save"}</button>
      <button type="button" onClick={() => { setOpen(false); setError(""); }} className="rounded-[2px] border border-line-2 px-3 py-2 text-[.62rem] font-semibold uppercase tracking-[.06em]">Cancel</button>
      {error && <p className="w-full text-[.78rem] text-rose-600">{error}</p>}
      {msg && <p className="w-full text-[.78rem] text-emerald-700">{msg}</p>}
    </form>
  );
}

export function EnquiryForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: "", email: "", source: "phone", subject: "", message: "" });
  const [error, setError] = useState(""); const [pending, start] = useTransition();
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF((s) => ({ ...s, [k]: e.target.value }));
  function submit(e: React.FormEvent) {
    e.preventDefault(); setError("");
    start(async () => {
      const r = await logEnquiry({ name: f.name, email: f.email, source: f.source, subject: f.subject || undefined, message: f.message });
      if (r?.ok) { setF({ name: "", email: "", source: "phone", subject: "", message: "" }); setOpen(false); router.refresh(); }
      else setError(r?.error || "Could not save.");
    });
  }
  if (!open) return <button onClick={() => setOpen(true)} className="rounded-[2px] bg-ink px-5 py-2.5 text-[.74rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black">Log enquiry</button>;
  return (
    <form onSubmit={submit} className="rounded-lg border border-line bg-white p-5">
      <h2 className="text-[.74rem] font-semibold uppercase tracking-[.12em] text-ink-2">Log an enquiry</h2>
      {error && <p className="mt-2 text-[.82rem] text-red-600">{error}</p>}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <input value={f.name} onChange={set("name")} placeholder="Name" className={field} required />
        <input type="email" value={f.email} onChange={set("email")} placeholder="Email" className={field} required />
        <select value={f.source} onChange={set("source")} className={field}><option value="phone">Phone</option><option value="email">Email</option><option value="web">Web</option><option value="event">Event</option></select>
        <input value={f.subject} onChange={set("subject")} placeholder="Subject" className={field} />
      </div>
      <textarea value={f.message} onChange={set("message")} rows={2} placeholder="What did they ask about?" className={`${field} mt-3`} required />
      <div className="mt-3 flex gap-2"><button type="button" onClick={() => setOpen(false)} className="rounded-[2px] border border-line-2 px-4 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em]">Close</button><button type="submit" disabled={pending} className="rounded-[2px] bg-ink px-4 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black disabled:opacity-50">{pending ? "Saving…" : "Log"}</button></div>
    </form>
  );
}
