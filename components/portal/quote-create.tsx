"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createQuote } from "@/lib/quote-actions";
import { models } from "@/lib/data/models";
import { vehicleImage } from "@/lib/vehicle-image";
import { cn } from "@/lib/utils";

const INCLUSIONS = [
  "2-year extended warranty",
  "5-year extended warranty",
  "6-month complimentary service plan",
  "Free UK delivery",
  "Free worldwide delivery",
  "Extendable warranty",
];

const gbp = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

export function QuoteCreate({ prefill }: { prefill?: { name?: string; email?: string; modelSlug?: string; basePounds?: number; dealId?: string } }) {
  const router = useRouter();
  const [open, setOpen] = useState(!!prefill);
  const [name, setName] = useState(prefill?.name ?? "");
  const [email, setEmail] = useState(prefill?.email ?? "");
  const [slug, setSlug] = useState(prefill?.modelSlug ?? models[1].slug);
  const model = models.find((m) => m.slug === slug) ?? models[1];
  const [base, setBase] = useState(String(prefill?.basePounds ?? (model.basePrice || 15000)));
  const [discount, setDiscount] = useState("0");
  const [estDelivery, setEstDelivery] = useState("");
  const [valid, setValid] = useState("30");
  const [inc, setInc] = useState<string[]>(["Free UK delivery"]);
  const [msg, setMsg] = useState(""); const [error, setError] = useState("");
  const [pending, start] = useTransition();

  const basePounds = Number(base) || 0;
  const pct = Math.min(90, Math.max(0, Number(discount) || 0));
  const final = Math.round(basePounds * (1 - pct / 100));
  const savings = basePounds - final;
  const toggleInc = (i: string) => setInc((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));

  function pickModel(s: string) { setSlug(s); const m = models.find((x) => x.slug === s); if (m?.basePrice) setBase(String(m.basePrice)); }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setMsg("");
    start(async () => {
      const r = await createQuote({ customerName: name, customerEmail: email, modelSlug: slug, modelName: model.name, basePounds, discountPct: pct, inclusions: inc, estDelivery: estDelivery || undefined, validDays: Number(valid) || 30, dealId: prefill?.dealId });
      if (r?.ok) { setMsg("Quote created and emailed to the customer."); router.refresh(); if (!prefill) { setName(""); setEmail(""); setDiscount("0"); } }
      else setError(r?.error || "Could not create quote.");
    });
  }

  const field = "w-full rounded-[3px] border border-line-2 bg-white p-2.5 text-[.9rem] outline-none focus:border-ink";
  if (!open) return <button onClick={() => setOpen(true)} className="rounded-[2px] bg-ink px-5 py-2.5 text-[.74rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black">New quote</button>;

  return (
    <form onSubmit={submit} className="rounded-lg border border-line bg-white p-5 sm:p-6">
      <h2 className="text-[.74rem] font-semibold uppercase tracking-[.12em] text-ink-2">Create a quote</h2>
      {msg && <p className="mt-2 flex items-center gap-2 rounded-[4px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-[.84rem] text-emerald-800">✓ {msg}</p>}
      {error && <p className="mt-2 text-[.84rem] text-red-600">{error}</p>}

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_220px]">
        <div className="flex flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Customer name" className={field} required />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Customer email" className={field} required />
          </div>
          <label className="block"><span className="mb-1 block text-[.7rem] font-semibold uppercase tracking-[.1em] text-ink-2">Model</span>
            <select value={slug} onChange={(e) => pickModel(e.target.value)} className={field}>{models.map((m) => <option key={m.slug} value={m.slug}>{m.name}{m.basePrice ? ` (from ${gbp(m.basePrice)})` : ""}</option>)}</select>
          </label>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block"><span className="mb-1 block text-[.7rem] font-semibold uppercase tracking-[.1em] text-ink-2">Price (GBP)</span><input type="number" min="1" value={base} onChange={(e) => setBase(e.target.value)} className={field} required /></label>
            <label className="block"><span className="mb-1 block text-[.7rem] font-semibold uppercase tracking-[.1em] text-ink-2">Discount %</span><input type="number" min="0" max="90" value={discount} onChange={(e) => setDiscount(e.target.value)} className={field} /></label>
            <label className="block"><span className="mb-1 block text-[.7rem] font-semibold uppercase tracking-[.1em] text-ink-2">Valid (days)</span><input type="number" min="1" value={valid} onChange={(e) => setValid(e.target.value)} className={field} /></label>
          </div>
          <label className="block"><span className="mb-1 block text-[.7rem] font-semibold uppercase tracking-[.1em] text-ink-2">Estimated delivery</span><input type="date" value={estDelivery} onChange={(e) => setEstDelivery(e.target.value)} className={field} /></label>
        </div>

        <div className="rounded-lg border border-line bg-paper p-4">
          <div className="relative aspect-[16/11] overflow-hidden rounded-md bg-white"><Image src={vehicleImage(slug)} alt={model.name} fill sizes="220px" className="object-contain p-2" /></div>
          <div className="mt-3 text-[.95rem] font-semibold">{model.name}</div>
          {pct > 0 ? (
            <div className="mt-1 text-[.9rem]"><s className="text-ink-2">{gbp(basePounds)}</s><div className="text-lg font-semibold">{gbp(final)}</div><div className="text-[.82rem] font-semibold text-emerald-700">Save {gbp(savings)} ({pct}% off)</div></div>
          ) : <div className="mt-1 text-lg font-semibold">{gbp(final)}</div>}
        </div>
      </div>

      <span className="mt-4 block text-[.7rem] font-semibold uppercase tracking-[.1em] text-ink-2">Inclusions</span>
      <div className="mt-2 flex flex-wrap gap-2">
        {INCLUSIONS.map((i) => (
          <button key={i} type="button" onClick={() => toggleInc(i)} className={cn("rounded-full border px-3 py-1.5 text-[.74rem] font-medium transition-colors", inc.includes(i) ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-line-2 text-ink-2 hover:border-ink")}>
            {inc.includes(i) ? "✓ " : ""}{i}
          </button>
        ))}
      </div>

      <div className="mt-5 flex gap-2">
        {!prefill && <button type="button" onClick={() => setOpen(false)} className="rounded-[2px] border border-line-2 px-4 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em]">Close</button>}
        <button type="submit" disabled={pending} className="rounded-[2px] bg-ink px-5 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black disabled:opacity-50">{pending ? "Creating…" : "Create & send quote"}</button>
      </div>
    </form>
  );
}
