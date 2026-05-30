"use client";

import { useState, useTransition } from "react";
import { updateItem } from "@/lib/inventory-actions";
import { cn } from "@/lib/utils";

interface Row { key: string; value: string }

export function InventorySpecs({ id, specs }: { id: string; specs: Record<string, string> }) {
  const [rows, setRows] = useState<Row[]>(Object.entries(specs ?? {}).map(([key, value]) => ({ key, value: String(value) })));
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function save() {
    setMsg(""); setError("");
    const out: Record<string, string> = {};
    for (const r of rows) {
      const k = r.key.trim();
      if (k) out[k] = r.value.trim();
    }
    start(async () => {
      const r = await updateItem(id, { specs: out });
      if (r?.ok) setMsg("Saved.");
      else setError(r?.error || "Could not save.");
    });
  }

  const field = "rounded-[3px] border border-line-2 px-2.5 py-1.5 text-[.85rem] outline-none focus:border-ink";

  return (
    <section className="rounded-lg border border-line bg-white p-5 sm:p-6">
      <h2 className="text-[.74rem] font-semibold uppercase tracking-[.12em] text-ink-2">Specifications</h2>
      {msg && <p className="mt-2 rounded-[4px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-[.84rem] text-emerald-800">✓ {msg}</p>}
      {error && <p className="mt-2 rounded-[4px] border border-rose-200 bg-rose-50 px-3 py-2 text-[.84rem] text-rose-700">{error}</p>}

      <div className="mt-3 flex flex-col gap-2">
        {rows.length === 0 && <p className="text-[.82rem] text-ink-2">No specs yet. Add a row below.</p>}
        {rows.map((r, i) => (
          <div key={i} className="flex items-center gap-2">
            <input value={r.key} onChange={(e) => setRows((a) => a.map((x, j) => (j === i ? { ...x, key: e.target.value } : x)))} placeholder="Spec (e.g. Range)" className={cn(field, "w-[40%]")} aria-label="Spec name" />
            <input value={r.value} onChange={(e) => setRows((a) => a.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} placeholder="Value (e.g. 60 miles)" className={cn(field, "flex-1")} aria-label="Spec value" />
            <button type="button" onClick={() => setRows((a) => a.filter((_, j) => j !== i))} className="rounded-[3px] border border-line-2 px-2 py-1.5 text-[.72rem] text-ink-2 hover:border-rose-300 hover:text-rose-600">Remove</button>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setRows((a) => [...a, { key: "", value: "" }])} className="rounded-[3px] border border-line-2 px-3 py-1.5 text-[.78rem] font-semibold text-ink-2 hover:border-ink hover:text-ink">+ Add spec</button>
        <button onClick={save} disabled={pending} className="rounded-[2px] bg-ink px-4 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black disabled:opacity-50">{pending ? "Saving…" : "Save specs"}</button>
      </div>
    </section>
  );
}
