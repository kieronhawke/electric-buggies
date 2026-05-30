"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { requestQuoteInAccount } from "@/lib/customer-actions";
import { models } from "@/lib/data/models";
import { vehicleImage } from "@/lib/vehicle-image";
import { cn } from "@/lib/utils";

const USE_CASES = ["Country estate", "Resort or hotel", "Golf club", "Events or festivals", "Airport or PRM", "Personal use", "Other"];
const TIMEFRAMES = ["As soon as possible", "Within 1 to 3 months", "Within 3 to 6 months", "Just exploring"];

export function AccountQuoteRequest() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [slug, setSlug] = useState("");
  const [useCase, setUseCase] = useState(USE_CASES[0]);
  const [quantity, setQuantity] = useState("1");
  const [timeframe, setTimeframe] = useState(TIMEFRAMES[0]);
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const model = models.find((m) => m.slug === slug);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!model) return setError("Please choose a model.");
    setError("");
    start(async () => {
      const r = await requestQuoteInAccount({ modelSlug: model.slug, modelName: model.name, useCase, quantity: Number(quantity) || 1, timeframe, notes });
      if (r?.ok) { setDone(r.message || "Request received."); router.refresh(); }
      else setError(r?.error || "Could not submit.");
    });
  }

  if (done) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-7 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-500 text-white"><svg width="22" height="22" viewBox="0 0 16 16" fill="none"><path d="M4 8.5l2.5 2.5L12 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
        <h2 className="mt-3 text-xl font-semibold text-emerald-900">Request received</h2>
        <p className="mt-2 text-[.95rem] text-emerald-800">{done}</p>
        <a href="/account/quotes" className="mt-4 inline-block text-[.8rem] font-semibold uppercase tracking-[.06em] text-emerald-900 underline-offset-4 hover:underline">Go to your quotes</a>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center gap-2 text-[.74rem] font-semibold uppercase tracking-[.12em] text-ink-2">
        <span className={cn(step === 1 ? "text-ink" : "")}>1. Choose a model</span><span>·</span><span className={cn(step === 2 ? "text-ink" : "")}>2. Your needs</span>
      </div>

      {step === 1 ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {models.map((m) => (
              <button key={m.slug} type="button" onClick={() => setSlug(m.slug)} className={cn("overflow-hidden rounded-lg border bg-white text-left transition-colors", slug === m.slug ? "border-ink ring-1 ring-ink" : "border-line hover:border-line-2")}>
                <div className="relative aspect-[16/11] bg-paper"><Image src={vehicleImage(m.slug)} alt={m.name} fill sizes="(max-width:1024px) 50vw, 33vw" className="object-contain p-3" /></div>
                <div className="flex items-center justify-between p-4"><span className="font-semibold">{m.name}</span>{slug === m.slug && <span className="grid h-5 w-5 place-items-center rounded-full bg-ink text-white"><svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 6l2.5 2.5L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>}</div>
              </button>
            ))}
          </div>
          <button disabled={!slug} onClick={() => setStep(2)} className="mt-6 inline-flex min-h-[48px] items-center rounded-[2px] bg-ink px-7 text-[.76rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black disabled:opacity-50">Continue</button>
        </>
      ) : (
        <form onSubmit={submit} className="max-w-[560px]">
          <div className="mb-4 flex items-center gap-3 rounded-lg border border-line bg-white p-3">
            <div className="relative h-12 w-16 flex-none overflow-hidden rounded bg-paper"><Image src={vehicleImage(slug)} alt="" fill sizes="64px" className="object-contain p-1" /></div>
            <span className="font-semibold">{model?.name}</span>
            <button type="button" onClick={() => setStep(1)} className="ml-auto text-[.74rem] font-semibold uppercase tracking-[.06em] text-ink-2 hover:text-ink">Change</button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block"><span className="mb-1 block text-[.7rem] font-semibold uppercase tracking-[.1em] text-ink-2">Use case</span><select value={useCase} onChange={(e) => setUseCase(e.target.value)} className="w-full rounded-[3px] border border-line-2 bg-white p-2.5 text-[.9rem] outline-none focus:border-ink">{USE_CASES.map((u) => <option key={u}>{u}</option>)}</select></label>
            <label className="block"><span className="mb-1 block text-[.7rem] font-semibold uppercase tracking-[.1em] text-ink-2">Quantity</span><input type="number" min="1" max="50" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full rounded-[3px] border border-line-2 bg-white p-2.5 text-[.9rem] outline-none focus:border-ink" /></label>
          </div>
          <label className="mt-3 block"><span className="mb-1 block text-[.7rem] font-semibold uppercase tracking-[.1em] text-ink-2">Timeframe</span><select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} className="w-full rounded-[3px] border border-line-2 bg-white p-2.5 text-[.9rem] outline-none focus:border-ink">{TIMEFRAMES.map((t) => <option key={t}>{t}</option>)}</select></label>
          <label className="mt-3 block"><span className="mb-1 block text-[.7rem] font-semibold uppercase tracking-[.1em] text-ink-2">Anything else?</span><textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full rounded-[3px] border border-line-2 bg-white p-2.5 text-[.9rem] outline-none focus:border-ink" placeholder="Branding, accessibility, special requirements…" /></label>
          {error && <p className="mt-2 text-[.84rem] text-red-600">{error}</p>}
          <button type="submit" disabled={pending} className="mt-4 inline-flex min-h-[48px] items-center rounded-[2px] bg-ink px-7 text-[.76rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black disabled:opacity-50">{pending ? "Sending…" : "Request quote"}</button>
        </form>
      )}
    </div>
  );
}
