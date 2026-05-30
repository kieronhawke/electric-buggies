"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { chooseDeliveryDates } from "@/lib/customer-actions";
import { cn } from "@/lib/utils";

function plus(n: number) { return new Date(Date.now() + n * 86400000).toISOString().slice(0, 10); }

export function DeliveryPicker({ orderId, chosen, slot }: { orderId: string; chosen: string[] | null; slot: string | null }) {
  const router = useRouter();
  const [dates, setDates] = useState<string[]>(chosen?.length ? chosen : [plus(7), plus(10), plus(14)]);
  const [pickSlot, setPickSlot] = useState(slot || "morning");
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const set = (i: number, v: string) => setDates((d) => d.map((x, j) => (j === i ? v : x)));

  if (chosen?.length) {
    return (
      <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-emerald-900"><Tick /> Delivery preferences received</h2>
        <p className="mt-2 text-[.92rem] text-emerald-800">Your preferred dates: {chosen.join(", ")} ({slot}). We will confirm your delivery slot shortly.</p>
      </section>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    start(async () => {
      const r = await chooseDeliveryDates(orderId, dates, pickSlot);
      if (r?.ok) router.refresh();
      else setError(r?.error || "Could not save.");
    });
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-amber-300 bg-white p-6 shadow-[0_24px_44px_-34px_rgba(0,0,0,0.4)] sm:p-7">
      <h2 className="text-xl font-semibold">Choose your delivery date</h2>
      <p className="mt-2 text-[.92rem] text-ink-2">Your vehicle is ready. Pick up to three preferred dates and a slot, and we will confirm one with you.</p>
      <span className="mt-5 block text-[.74rem] font-semibold uppercase tracking-[.12em] text-ink-2">Preferred dates</span>
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {dates.map((d, i) => <input key={i} type="date" min={plus(3)} value={d} onChange={(e) => set(i, e.target.value)} className="h-12 w-full rounded-[3px] border border-line-2 bg-white px-3 text-[.95rem] outline-none focus:border-ink" />)}
      </div>
      <span className="mt-5 block text-[.74rem] font-semibold uppercase tracking-[.12em] text-ink-2">Preferred slot</span>
      <div className="mt-2 flex gap-2">
        {[["morning", "Morning"], ["afternoon", "Afternoon"]].map(([v, l]) => (
          <button key={v} type="button" onClick={() => setPickSlot(v)} className={cn("flex-1 rounded-[3px] border px-4 py-3 text-[.85rem] font-semibold", pickSlot === v ? "border-ink bg-ink text-white" : "border-line-2 hover:border-ink")}>{l}</button>
        ))}
      </div>
      {error && <p className="mt-3 text-[.85rem] text-red-600">{error}</p>}
      <button type="submit" disabled={pending} className="mt-5 inline-flex min-h-[48px] items-center rounded-[2px] bg-ink px-7 text-[.76rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black disabled:opacity-50">{pending ? "Saving…" : "Confirm preferences"}</button>
    </form>
  );
}

function Tick() {
  return <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden><circle cx="8" cy="8" r="8" fill="currentColor" opacity="0.15" /><path d="M4.5 8.5l2.2 2.2L11.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
