"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { updateItem } from "@/lib/inventory-actions";
import { cn } from "@/lib/utils";

interface Photo { url: string; primary?: boolean }

const QUICK_PICKS: { url: string; label: string }[] = [
  { url: "/img/email/two.png", label: "The Two" },
  { url: "/img/email/four.png", label: "The Four" },
  { url: "/img/email/six.png", label: "The Six" },
  { url: "/img/email/eight.png", label: "The Eight" },
  { url: "/img/email/utility.png", label: "The Utility" },
  { url: "/img/email/bespoke.png", label: "Bespoke" },
];

export function InventoryPhotos({ id, photos }: { id: string; photos: Photo[] }) {
  const [list, setList] = useState<Photo[]>(photos ?? []);
  const [custom, setCustom] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function persist(next: Photo[]) {
    setList(next);
    setMsg(""); setError("");
    start(async () => {
      const r = await updateItem(id, { photos: next });
      if (r?.ok) setMsg("Saved.");
      else setError(r?.error || "Could not save.");
    });
  }

  function add(url: string) {
    const u = url.trim();
    if (!u || list.some((p) => p.url === u)) return;
    persist([...list, { url: u, primary: list.length === 0 }]);
  }
  function remove(url: string) {
    const next = list.filter((p) => p.url !== url);
    if (next.length && !next.some((p) => p.primary)) next[0].primary = true;
    persist(next);
  }
  function setPrimary(url: string) {
    persist(list.map((p) => ({ ...p, primary: p.url === url })));
  }

  return (
    <section className="rounded-lg border border-line bg-white p-5 sm:p-6">
      <h2 className="text-[.74rem] font-semibold uppercase tracking-[.12em] text-ink-2">Photos</h2>
      {msg && <p className="mt-2 rounded-[4px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-[.84rem] text-emerald-800">✓ {msg}</p>}
      {error && <p className="mt-2 rounded-[4px] border border-rose-200 bg-rose-50 px-3 py-2 text-[.84rem] text-rose-700">{error}</p>}

      {list.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => (
            <div key={p.url} className={cn("rounded-lg border bg-paper p-2", p.primary ? "border-emerald-300 ring-1 ring-emerald-200" : "border-line")}>
              <div className="relative aspect-[16/11] overflow-hidden rounded-md bg-white">
                <Image src={p.url} alt="" fill sizes="200px" className="object-contain p-1" />
                {p.primary && <span className="absolute left-1.5 top-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[.58rem] font-semibold uppercase tracking-[.06em] text-emerald-700">Primary</span>}
              </div>
              <div className="mt-2 flex items-center gap-2">
                {!p.primary && <button type="button" onClick={() => setPrimary(p.url)} className="text-[.72rem] font-semibold text-ink-2 hover:text-ink">Set primary</button>}
                <button type="button" onClick={() => remove(p.url)} className="ml-auto text-[.72rem] font-semibold text-ink-2 hover:text-rose-600">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-[.7rem] font-semibold uppercase tracking-[.1em] text-ink-2">Quick picks</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {QUICK_PICKS.map((q) => (
          <button key={q.url} type="button" onClick={() => add(q.url)} disabled={pending || list.some((p) => p.url === q.url)} className="flex items-center gap-2 rounded-[3px] border border-line-2 px-2 py-1.5 text-[.78rem] hover:border-ink disabled:opacity-40">
            <span className="relative h-6 w-9 overflow-hidden rounded bg-paper"><Image src={q.url} alt="" fill sizes="36px" className="object-contain" /></span>
            {q.label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Custom image URL" className="min-w-0 flex-1 rounded-[3px] border border-line-2 px-2.5 py-1.5 text-[.85rem] outline-none focus:border-ink" aria-label="Custom image URL" />
        <button type="button" onClick={() => { add(custom); setCustom(""); }} disabled={pending} className="rounded-[2px] bg-ink px-4 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black disabled:opacity-50">Add</button>
      </div>
    </section>
  );
}
