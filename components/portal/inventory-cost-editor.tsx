"use client";

import { useMemo, useState, useTransition } from "react";
import { updateItem, type ItemPatch } from "@/lib/inventory-actions";
import {
  buildCostStack,
  computeProfit,
  effectiveRrp,
  rrpFromMargin,
  HS_CODE,
  type FeeLine,
} from "@/lib/costing";
import { LANDED_FEE_PRESETS } from "@/lib/fee-library";
import { gbpFromPence } from "@/lib/format";
import { ProfitBadge } from "@/components/portal/profit-badge";
import { cn } from "@/lib/utils";

const ESTIMATES_NOTE =
  "All cost, duty, VAT and fee figures are estimates you can edit. Confirm commodity code, duty (anti-dumping can apply) and VAT treatment with a customs broker or accountant. Not financial or tax advice.";

/** Pence <-> pounds helpers for the money inputs (admins type pounds). */
const toPounds = (pence: number) => (pence / 100).toString();
const fromPounds = (v: string) => Math.max(0, Math.round((Number(v) || 0) * 100));

export interface CostEditorItem {
  id: string;
  factoryFob: number;
  freightInsurance: number;
  dutyPct: number;
  antiDumping: boolean;
  vatPct: number;
  vatReclaimable: boolean;
  otherFees: FeeLine[];
  ukDelivery: number;
  pdi: number;
  branding: number;
  warrantyReserve: number;
  rrp: number;
  targetMarginPct: number;
  autoPrice: boolean;
}

export function InventoryCostEditor({ item }: { item: CostEditorItem }) {
  // Local editable state (all money in pence).
  const [factoryFob, setFactoryFob] = useState(item.factoryFob);
  const [freightInsurance, setFreightInsurance] = useState(item.freightInsurance);
  const [dutyPct, setDutyPct] = useState(item.dutyPct);
  const [antiDumping, setAntiDumping] = useState(item.antiDumping);
  const [vatPct, setVatPct] = useState(item.vatPct);
  const [vatReclaimable, setVatReclaimable] = useState(item.vatReclaimable);
  const [otherFees, setOtherFees] = useState<FeeLine[]>(item.otherFees ?? []);
  const [ukDelivery, setUkDelivery] = useState(item.ukDelivery);
  const [pdi, setPdi] = useState(item.pdi);
  const [branding, setBranding] = useState(item.branding);
  const [warrantyReserve, setWarrantyReserve] = useState(item.warrantyReserve);
  const [autoPrice, setAutoPrice] = useState(item.autoPrice);
  const [targetMarginPct, setTargetMarginPct] = useState(item.targetMarginPct);
  const [rrp, setRrp] = useState(item.rrp);

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  const stack = useMemo(
    () =>
      buildCostStack({
        factoryFob, freightInsurance, dutyPct, antiDumping, vatPct, vatReclaimable,
        otherFees, ukDelivery, pdi, branding, warrantyReserve,
      }),
    [factoryFob, freightInsurance, dutyPct, antiDumping, vatPct, vatReclaimable, otherFees, ukDelivery, pdi, branding, warrantyReserve],
  );

  const effRrp = useMemo(
    () => effectiveRrp({ rrp, targetMarginPct, autoPrice }, stack.totalCost),
    [rrp, targetMarginPct, autoPrice, stack.totalCost],
  );
  const profit = useMemo(() => computeProfit(stack.totalCost, effRrp), [stack.totalCost, effRrp]);
  const autoRrp = rrpFromMargin(stack.totalCost, targetMarginPct);

  function save() {
    setMsg(""); setError("");
    const patch: ItemPatch = {
      factoryFob, freightInsurance, dutyPct, antiDumping, vatPct, vatReclaimable,
      otherFees, ukDelivery, pdi, branding, warrantyReserve,
      autoPrice, targetMarginPct, rrp,
    };
    start(async () => {
      const r = await updateItem(item.id, patch);
      if (r?.ok) setMsg("Saved.");
      else setError(r?.error || "Could not save.");
    });
  }

  function addFee(label: string, amount: number) {
    if (!label) return;
    setOtherFees((f) => [...f, { label, amount }]);
  }

  return (
    <section className="rounded-lg border border-line bg-white p-5 sm:p-6">
      <h2 className="text-[.74rem] font-semibold uppercase tracking-[.12em] text-ink-2">Cost &amp; pricing</h2>
      {msg && <p className="mt-2 rounded-[4px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-[.84rem] text-emerald-800">✓ {msg}</p>}
      {error && <p className="mt-2 rounded-[4px] border border-rose-200 bg-rose-50 px-3 py-2 text-[.84rem] text-rose-700">{error}</p>}

      <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_300px]">
        {/* Stack */}
        <div className="overflow-hidden rounded-lg border border-line">
          <table className="w-full border-collapse text-[.88rem]">
            <tbody>
              <MoneyRow label="Factory price (FOB)" pence={factoryFob} onChange={setFactoryFob} />
              <MoneyRow label="Freight + insurance" pence={freightInsurance} onChange={setFreightInsurance} />
              <ComputedRow label="= Customs value (CIF)" value={stack.cif} />

              <tr className="border-b border-line">
                <td className="p-3">
                  <div>Import duty</div>
                  <div className="mt-0.5 text-[.7rem] text-ink-2">HS {HS_CODE}</div>
                  <label className="mt-1 flex items-center gap-1.5 text-[.72rem] text-ink-2">
                    <input type="checkbox" checked={antiDumping} onChange={(e) => setAntiDumping(e.target.checked)} />
                    Anti-dumping may apply
                  </label>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <input type="number" min={0} max={100} value={dutyPct} onChange={(e) => setDutyPct(Math.max(0, Math.min(100, Number(e.target.value) || 0)))} className="w-16 rounded-[3px] border border-line-2 px-2 py-1 text-right text-[.85rem] outline-none focus:border-ink tabular-nums" aria-label="Import duty percent" />
                    <span className="text-ink-2">%</span>
                  </div>
                  <div className="mt-1 text-[.78rem] text-ink-2 tabular-nums">{gbpFromPence(stack.dutyAmount)}</div>
                </td>
              </tr>

              <tr className="border-b border-line">
                <td className="p-3">
                  <div>Import VAT</div>
                  <label className="mt-1 flex items-center gap-1.5 text-[.72rem] text-ink-2">
                    <input type="checkbox" checked={vatReclaimable} onChange={(e) => setVatReclaimable(e.target.checked)} />
                    Reclaimable (excluded from cost)
                  </label>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <input type="number" min={0} max={100} value={vatPct} onChange={(e) => setVatPct(Math.max(0, Math.min(100, Number(e.target.value) || 0)))} className="w-16 rounded-[3px] border border-line-2 px-2 py-1 text-right text-[.85rem] outline-none focus:border-ink tabular-nums" aria-label="Import VAT percent" />
                    <span className="text-ink-2">%</span>
                  </div>
                  <div className="mt-1 text-[.78rem] text-ink-2 tabular-nums">{gbpFromPence(stack.vatAmount)}{vatReclaimable ? " (reclaimed)" : " in cost"}</div>
                </td>
              </tr>

              {/* Other fees */}
              <tr className="border-b border-line">
                <td colSpan={2} className="p-3">
                  <div className="text-[.7rem] font-semibold uppercase tracking-[.1em] text-ink-2">Other fees</div>
                  <div className="mt-2 flex flex-col gap-2">
                    {otherFees.length === 0 && <div className="text-[.78rem] text-ink-2">No other fees.</div>}
                    {otherFees.map((f, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          value={f.label}
                          onChange={(e) => setOtherFees((arr) => arr.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
                          placeholder="Fee label"
                          className="min-w-0 flex-1 rounded-[3px] border border-line-2 px-2 py-1 text-[.82rem] outline-none focus:border-ink"
                          aria-label="Other fee label"
                        />
                        <div className="flex items-center gap-1">
                          <span className="text-ink-2">£</span>
                          <input
                            type="number" min={0} step="0.01"
                            value={toPounds(f.amount)}
                            onChange={(e) => setOtherFees((arr) => arr.map((x, j) => (j === i ? { ...x, amount: fromPounds(e.target.value) } : x)))}
                            className="w-24 rounded-[3px] border border-line-2 px-2 py-1 text-right text-[.82rem] outline-none focus:border-ink tabular-nums"
                            aria-label="Other fee amount in pounds"
                          />
                        </div>
                        <button type="button" onClick={() => setOtherFees((arr) => arr.filter((_, j) => j !== i))} className="rounded-[3px] border border-line-2 px-2 py-1 text-[.72rem] text-ink-2 hover:border-rose-300 hover:text-rose-600" aria-label="Remove fee">Remove</button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <select
                      value=""
                      onChange={(e) => {
                        const preset = LANDED_FEE_PRESETS.find((p) => p.label === e.target.value);
                        if (preset) addFee(preset.label, preset.amount);
                      }}
                      className="rounded-[3px] border border-line-2 bg-white px-2 py-1.5 text-[.8rem] outline-none focus:border-ink"
                      aria-label="Add preset fee"
                    >
                      <option value="">Add preset fee…</option>
                      {LANDED_FEE_PRESETS.map((p) => (
                        <option key={p.label} value={p.label}>{p.label} ({gbpFromPence(p.amount)})</option>
                      ))}
                    </select>
                    <button type="button" onClick={() => addFee("Custom fee", 0)} className="rounded-[3px] border border-line-2 px-2.5 py-1.5 text-[.78rem] font-semibold text-ink-2 hover:border-ink hover:text-ink">+ Custom fee</button>
                  </div>
                </td>
              </tr>

              <MoneyRow label="UK delivery" pence={ukDelivery} onChange={setUkDelivery} />
              <MoneyRow label="PDI" pence={pdi} onChange={setPdi} />
              <MoneyRow label="Branding" pence={branding} onChange={setBranding} />
              <MoneyRow label="Warranty reserve" pence={warrantyReserve} onChange={setWarrantyReserve} />
              <tr className="bg-paper">
                <td className="p-3 text-[.92rem] font-semibold">= Total cost to us</td>
                <td className="p-3 text-right text-[.95rem] font-semibold tabular-nums">{gbpFromPence(stack.totalCost)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pricing + live profit */}
        <div className="flex flex-col gap-4">
          <ProfitBadge profit={profit.profit} marginPct={profit.marginPct} band={profit.band} variant="standout" />

          <div className="rounded-lg border border-line bg-white p-4">
            <div className="text-[.7rem] font-semibold uppercase tracking-[.1em] text-ink-2">Retail price (RRP)</div>
            <label className="mt-2 flex items-center gap-2 text-[.82rem]">
              <input type="checkbox" checked={autoPrice} onChange={(e) => setAutoPrice(e.target.checked)} />
              Auto from target margin
            </label>

            {autoPrice ? (
              <div className="mt-3">
                <div className="flex items-center gap-1">
                  <input
                    type="number" min={0} max={95} value={targetMarginPct}
                    onChange={(e) => setTargetMarginPct(Math.max(0, Math.min(95, Number(e.target.value) || 0)))}
                    className="w-20 rounded-[3px] border border-line-2 px-2 py-1.5 text-right text-[.88rem] outline-none focus:border-ink tabular-nums"
                    aria-label="Target margin percent"
                  />
                  <span className="text-ink-2">% target margin</span>
                </div>
                <div className="mt-2 text-[.85rem] text-ink-2">Computed RRP <span className="font-semibold text-ink tabular-nums">{gbpFromPence(autoRrp)}</span></div>
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-1">
                <span className="text-ink-2">£</span>
                <input
                  type="number" min={0} step="0.01" value={toPounds(rrp)}
                  onChange={(e) => setRrp(fromPounds(e.target.value))}
                  className="w-32 rounded-[3px] border border-line-2 px-2 py-1.5 text-right text-[.88rem] outline-none focus:border-ink tabular-nums"
                  aria-label="Retail price in pounds"
                />
              </div>
            )}
            <div className="mt-3 border-t border-line pt-2 text-[.8rem] text-ink-2">
              Selling at <span className="font-semibold text-ink tabular-nums">{gbpFromPence(effRrp)}</span>
            </div>
          </div>

          <button onClick={save} disabled={pending} className="rounded-[2px] bg-ink px-5 py-2.5 text-[.74rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black disabled:opacity-50">
            {pending ? "Saving…" : "Save cost & pricing"}
          </button>
        </div>
      </div>

      <p className="mt-4 rounded-[4px] border border-line bg-paper px-3.5 py-2.5 text-[.76rem] leading-relaxed text-ink-2">{ESTIMATES_NOTE}</p>
    </section>
  );
}

function MoneyRow({ label, pence, onChange }: { label: string; pence: number; onChange: (n: number) => void }) {
  return (
    <tr className="border-b border-line">
      <td className="p-3">{label}</td>
      <td className="p-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <span className="text-ink-2">£</span>
          <input
            type="number" min={0} step="0.01"
            value={(pence / 100).toString()}
            onChange={(e) => onChange(Math.max(0, Math.round((Number(e.target.value) || 0) * 100)))}
            className="w-28 rounded-[3px] border border-line-2 px-2 py-1 text-right text-[.85rem] outline-none focus:border-ink tabular-nums"
            aria-label={`${label} in pounds`}
          />
        </div>
      </td>
    </tr>
  );
}

function ComputedRow({ label, value }: { label: string; value: number }) {
  return (
    <tr className="border-b border-line bg-paper/60">
      <td className="p-3 font-medium">{label}</td>
      <td className="p-3 text-right font-medium tabular-nums">{gbpFromPence(value)}</td>
    </tr>
  );
}
