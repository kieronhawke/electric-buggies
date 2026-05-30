"use client";

import { useState, useTransition } from "react";
import { addSupplier, addPurchaseOrder, receivePurchaseOrder, updateItem } from "@/lib/inventory-actions";
import { gbpFromPence, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface SupplierRow { id: string; name: string; country: string | null; contactName: string | null; contactEmail: string | null; leadTimeDays: number | null }
export interface PoRow { id: string; reference: string; status: string; quantity: number; unitCost: number; expectedAt: string | Date | null; supplierName?: string | null }

const PO_STYLE: Record<string, string> = {
  ordered: "bg-amber-50 text-amber-800 border-amber-200",
  in_production: "bg-amber-50 text-amber-800 border-amber-200",
  in_transit: "bg-blue-50 text-blue-700 border-blue-200",
  received: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

const toPounds = (pence: number) => (pence / 100).toString();
const fromPounds = (v: string) => Math.max(0, Math.round((Number(v) || 0) * 100));

export function InventorySuppliers({
  itemId, supplierId, supplier, suppliers, pos,
}: {
  itemId: string;
  supplierId: string | null;
  supplier: SupplierRow | null;
  suppliers: SupplierRow[];
  pos: PoRow[];
}) {
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  // Supplier select
  const [selSupplier, setSelSupplier] = useState(supplierId ?? "");
  // Add PO
  const [poQty, setPoQty] = useState("1");
  const [poUnit, setPoUnit] = useState("0");
  const [poSupplier, setPoSupplier] = useState(supplierId ?? "");
  const [poExpected, setPoExpected] = useState("");
  // Add supplier
  const [newSup, setNewSup] = useState({ name: "", country: "", contactName: "", contactEmail: "", leadTimeDays: "" });
  const [showAddSup, setShowAddSup] = useState(false);

  function run(fn: () => Promise<{ ok: boolean; error?: string } | null>, ok: string) {
    setMsg(""); setError("");
    start(async () => {
      const r = await fn();
      if (r?.ok) setMsg(ok);
      else setError(r?.error || "Something went wrong.");
    });
  }

  const field = "rounded-[3px] border border-line-2 bg-white px-2.5 py-1.5 text-[.85rem] outline-none focus:border-ink";
  const lbl = "mb-1 block text-[.68rem] font-semibold uppercase tracking-[.1em] text-ink-2";

  return (
    <section className="rounded-lg border border-line bg-white p-5 sm:p-6">
      <h2 className="text-[.74rem] font-semibold uppercase tracking-[.12em] text-ink-2">Supplier &amp; purchase orders</h2>
      {msg && <p className="mt-2 rounded-[4px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-[.84rem] text-emerald-800">✓ {msg}</p>}
      {error && <p className="mt-2 rounded-[4px] border border-rose-200 bg-rose-50 px-3 py-2 text-[.84rem] text-rose-700">{error}</p>}

      {/* Current supplier + selector */}
      <div className="mt-3 rounded-lg border border-line bg-paper p-4">
        <div className="text-[.7rem] font-semibold uppercase tracking-[.1em] text-ink-2">Supplier</div>
        {supplier ? (
          <div className="mt-1 text-[.9rem]">
            <span className="font-medium">{supplier.name}</span>
            {supplier.country && <span className="text-ink-2"> · {supplier.country}</span>}
            {supplier.leadTimeDays != null && <span className="text-ink-2"> · {supplier.leadTimeDays}d lead</span>}
            {supplier.contactEmail && <div className="text-[.8rem] text-ink-2">{supplier.contactName ? `${supplier.contactName} · ` : ""}{supplier.contactEmail}</div>}
          </div>
        ) : (
          <div className="mt-1 text-[.85rem] text-ink-2">No supplier assigned.</div>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <select value={selSupplier} onChange={(e) => setSelSupplier(e.target.value)} className={field}>
            <option value="">No supplier</option>
            {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <button type="button" disabled={pending} onClick={() => run(() => updateItem(itemId, { supplierId: selSupplier || null }), "Supplier updated.")} className="rounded-[2px] bg-ink px-3 py-1.5 text-[.7rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black disabled:opacity-50">Set supplier</button>
          <button type="button" onClick={() => setShowAddSup((v) => !v)} className="rounded-[3px] border border-line-2 px-3 py-1.5 text-[.72rem] font-semibold text-ink-2 hover:border-ink hover:text-ink">{showAddSup ? "Close" : "+ New supplier"}</button>
        </div>

        {showAddSup && (
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <label className="block"><span className={lbl}>Name</span><input value={newSup.name} onChange={(e) => setNewSup((s) => ({ ...s, name: e.target.value }))} className={cn(field, "w-full")} /></label>
            <label className="block"><span className={lbl}>Country</span><input value={newSup.country} onChange={(e) => setNewSup((s) => ({ ...s, country: e.target.value }))} className={cn(field, "w-full")} /></label>
            <label className="block"><span className={lbl}>Contact name</span><input value={newSup.contactName} onChange={(e) => setNewSup((s) => ({ ...s, contactName: e.target.value }))} className={cn(field, "w-full")} /></label>
            <label className="block"><span className={lbl}>Contact email</span><input value={newSup.contactEmail} onChange={(e) => setNewSup((s) => ({ ...s, contactEmail: e.target.value }))} className={cn(field, "w-full")} /></label>
            <label className="block"><span className={lbl}>Lead time (days)</span><input type="number" min={0} value={newSup.leadTimeDays} onChange={(e) => setNewSup((s) => ({ ...s, leadTimeDays: e.target.value }))} className={cn(field, "w-full tabular-nums")} /></label>
            <div className="flex items-end">
              <button type="button" disabled={pending || !newSup.name.trim()} onClick={() => run(async () => {
                const r = await addSupplier({ name: newSup.name, country: newSup.country || undefined, contactName: newSup.contactName || undefined, contactEmail: newSup.contactEmail || undefined, leadTimeDays: newSup.leadTimeDays ? Number(newSup.leadTimeDays) : undefined });
                if (r?.ok) { setNewSup({ name: "", country: "", contactName: "", contactEmail: "", leadTimeDays: "" }); setShowAddSup(false); }
                return r;
              }, "Supplier added.")} className="rounded-[2px] bg-ink px-4 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black disabled:opacity-50">Add supplier</button>
            </div>
          </div>
        )}
      </div>

      {/* PO list */}
      <div className="mt-4">
        <div className="text-[.7rem] font-semibold uppercase tracking-[.1em] text-ink-2">Purchase orders ({pos.length})</div>
        {pos.length === 0 ? (
          <p className="mt-2 text-[.82rem] text-ink-2">No purchase orders yet.</p>
        ) : (
          <div className="mt-2 overflow-x-auto rounded-lg border border-line">
            <table className="w-full min-w-[560px] border-collapse text-[.85rem]">
              <thead><tr className="border-b border-line bg-paper text-left text-[.62rem] font-semibold uppercase tracking-[.1em] text-ink-2"><th className="p-2.5">Ref</th><th className="p-2.5">Status</th><th className="p-2.5">Qty</th><th className="p-2.5">Unit cost</th><th className="p-2.5">Expected</th><th className="p-2.5"></th></tr></thead>
              <tbody>
                {pos.map((p) => (
                  <tr key={p.id} className="border-b border-line last:border-0">
                    <td className="p-2.5 font-medium tabular-nums">{p.reference}</td>
                    <td className="p-2.5"><span className={cn("rounded-full border px-2 py-0.5 text-[.6rem] font-semibold uppercase tracking-[.06em]", PO_STYLE[p.status] ?? PO_STYLE.ordered)}>{p.status.replace("_", " ")}</span></td>
                    <td className="p-2.5 tabular-nums">{p.quantity}</td>
                    <td className="p-2.5 tabular-nums">{gbpFromPence(p.unitCost)}</td>
                    <td className="p-2.5 text-ink-2">{formatDate(p.expectedAt) ?? "-"}</td>
                    <td className="p-2.5 text-right">
                      {p.status !== "received" && (
                        <button type="button" disabled={pending} onClick={() => run(() => receivePurchaseOrder(p.id), "Marked received.")} className="rounded-[3px] border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[.68rem] font-semibold uppercase tracking-[.06em] text-emerald-700 hover:bg-emerald-100 disabled:opacity-50">Mark received</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add PO */}
      <div className="mt-4 rounded-lg border border-line bg-paper p-4">
        <div className="text-[.7rem] font-semibold uppercase tracking-[.1em] text-ink-2">Add purchase order</div>
        <div className="mt-2 grid gap-2 sm:grid-cols-4">
          <label className="block"><span className={lbl}>Quantity</span><input type="number" min={1} value={poQty} onChange={(e) => setPoQty(e.target.value)} className={cn(field, "w-full tabular-nums")} /></label>
          <label className="block"><span className={lbl}>Unit cost (£)</span><input type="number" min={0} step="0.01" value={poUnit === "0" ? "" : toPounds(Number(poUnit))} onChange={(e) => setPoUnit(String(fromPounds(e.target.value)))} placeholder="0.00" className={cn(field, "w-full tabular-nums")} /></label>
          <label className="block"><span className={lbl}>Supplier</span><select value={poSupplier} onChange={(e) => setPoSupplier(e.target.value)} className={cn(field, "w-full")}><option value="">No supplier</option>{suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
          <label className="block"><span className={lbl}>Expected</span><input type="date" value={poExpected} onChange={(e) => setPoExpected(e.target.value)} className={cn(field, "w-full")} /></label>
        </div>
        <button type="button" disabled={pending} onClick={() => run(async () => {
          const r = await addPurchaseOrder({ itemId, supplierId: poSupplier || undefined, quantity: Number(poQty) || 1, unitCost: Number(poUnit) || 0, expectedAt: poExpected || undefined });
          if (r?.ok) { setPoQty("1"); setPoUnit("0"); setPoExpected(""); }
          return r;
        }, "Purchase order created.")} className="mt-3 rounded-[2px] bg-ink px-4 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black disabled:opacity-50">Add PO</button>
      </div>
    </section>
  );
}
