"use client";

import { useState, useTransition } from "react";
import { updateItem } from "@/lib/inventory-actions";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface UnitRow { id: string; vin: string; status: string; location: string | null; createdAt: string | Date }

const UNIT_STYLE: Record<string, string> = {
  in_stock: "bg-emerald-50 text-emerald-700 border-emerald-200",
  reserved: "bg-amber-50 text-amber-800 border-amber-200",
  sold: "bg-paper text-ink-2 border-line-2",
};

export function InventoryStock({
  id, stockOnHand, stockOnOrder, stockAllocated, reorderPoint, location, units,
}: {
  id: string;
  stockOnHand: number;
  stockOnOrder: number;
  stockAllocated: number;
  reorderPoint: number;
  location: string;
  units: UnitRow[];
}) {
  const [onHand, setOnHand] = useState(stockOnHand);
  const [onOrder, setOnOrder] = useState(stockOnOrder);
  const [allocated, setAllocated] = useState(stockAllocated);
  const [reorder, setReorder] = useState(reorderPoint);
  const [loc, setLoc] = useState(location);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  const available = onHand - allocated;
  const low = available <= reorder;

  function save() {
    setMsg(""); setError("");
    start(async () => {
      const r = await updateItem(id, { stockOnHand: onHand, stockOnOrder: onOrder, stockAllocated: allocated, reorderPoint: reorder, location: loc });
      if (r?.ok) setMsg("Saved.");
      else setError(r?.error || "Could not save.");
    });
  }

  const num = "w-full rounded-[3px] border border-line-2 px-2.5 py-1.5 text-[.88rem] outline-none focus:border-ink tabular-nums";
  const lbl = "mb-1 block text-[.7rem] font-semibold uppercase tracking-[.1em] text-ink-2";

  return (
    <section className="rounded-lg border border-line bg-white p-5 sm:p-6">
      <h2 className="text-[.74rem] font-semibold uppercase tracking-[.12em] text-ink-2">Stock &amp; units</h2>
      {msg && <p className="mt-2 rounded-[4px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-[.84rem] text-emerald-800">✓ {msg}</p>}
      {error && <p className="mt-2 rounded-[4px] border border-rose-200 bg-rose-50 px-3 py-2 text-[.84rem] text-rose-700">{error}</p>}

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <label className="block"><span className={lbl}>On hand</span><input type="number" min={0} value={onHand} onChange={(e) => setOnHand(Math.max(0, Number(e.target.value) || 0))} className={num} aria-label="Stock on hand" /></label>
        <label className="block"><span className={lbl}>On order</span><input type="number" min={0} value={onOrder} onChange={(e) => setOnOrder(Math.max(0, Number(e.target.value) || 0))} className={num} aria-label="Stock on order" /></label>
        <label className="block"><span className={lbl}>Allocated</span><input type="number" min={0} value={allocated} onChange={(e) => setAllocated(Math.max(0, Number(e.target.value) || 0))} className={num} aria-label="Stock allocated" /></label>
        <label className="block"><span className={lbl}>Reorder point</span><input type="number" min={0} value={reorder} onChange={(e) => setReorder(Math.max(0, Number(e.target.value) || 0))} className={num} aria-label="Reorder point" /></label>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <label className="block"><span className={lbl}>Location</span><input value={loc} onChange={(e) => setLoc(e.target.value)} className={num} aria-label="Stock location" /></label>
        <div className={cn("rounded-lg border px-4 py-2.5 text-[.85rem]", low ? "border-amber-200 bg-amber-50 text-amber-800" : "border-emerald-200 bg-emerald-50 text-emerald-800")}>
          Available <span className="font-semibold tabular-nums">{available}</span>{low && ", low stock"}
        </div>
      </div>

      <div className="mt-3">
        <button onClick={save} disabled={pending} className="rounded-[2px] bg-ink px-4 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black disabled:opacity-50">{pending ? "Saving…" : "Save stock"}</button>
      </div>

      <div className="mt-5">
        <div className="text-[.7rem] font-semibold uppercase tracking-[.1em] text-ink-2">VIN units ({units.length})</div>
        {units.length === 0 ? (
          <p className="mt-2 text-[.82rem] text-ink-2">No tracked units yet.</p>
        ) : (
          <div className="mt-2 overflow-x-auto rounded-lg border border-line">
            <table className="w-full min-w-[480px] border-collapse text-[.85rem]">
              <thead><tr className="border-b border-line bg-paper text-left text-[.62rem] font-semibold uppercase tracking-[.1em] text-ink-2"><th className="p-2.5">VIN</th><th className="p-2.5">Status</th><th className="p-2.5">Location</th><th className="p-2.5">Added</th></tr></thead>
              <tbody>
                {units.map((u) => (
                  <tr key={u.id} className="border-b border-line last:border-0">
                    <td className="p-2.5 font-medium tabular-nums">{u.vin}</td>
                    <td className="p-2.5"><span className={cn("rounded-full border px-2 py-0.5 text-[.6rem] font-semibold uppercase tracking-[.06em]", UNIT_STYLE[u.status] ?? UNIT_STYLE.sold)}>{u.status.replace("_", " ")}</span></td>
                    <td className="p-2.5 text-ink-2">{u.location ?? "-"}</td>
                    <td className="p-2.5 text-ink-2">{formatDate(u.createdAt) ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
