"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { generateQuote, type GenerateQuoteForm } from "@/lib/quote-actions";
import {
  applyMarkup,
  applyDiscountPct,
  computeProfit,
  MARGIN_THIN,
} from "@/lib/costing";
import { QUOTE_FEE_LIBRARY, INCLUSIONS_LIBRARY } from "@/lib/fee-library";
import { ProfitBadge } from "@/components/portal/profit-badge";
import { gbpFromPence } from "@/lib/format";
import { vehicleImage } from "@/lib/vehicle-image";
import { cn } from "@/lib/utils";

/** Inventory rows mapped in the page to a serialisable picker shape. */
export interface PickerItem {
  id: string;
  name: string;
  sku: string;
  modelSlug: string | null;
  unitCostPence: number;
  rrpPence: number;
  available: number;
  status: string;
}

export interface QuotePrefill {
  customerName?: string;
  customerEmail?: string;
  dealId?: string;
  modelSlug?: string;
}

const HIGH_VALUE_PENCE = 5_000_000; // £50k flags a second sign-off

const field =
  "w-full rounded-[3px] border border-line-2 bg-white p-2.5 text-[.9rem] outline-none focus:border-ink";
const labelCls =
  "mb-1 block text-[.7rem] font-semibold uppercase tracking-[.1em] text-ink-2";
const sectionTitle =
  "text-[.74rem] font-semibold uppercase tracking-[.12em] text-ink-2";

const poundsToPence = (p: number | string) => Math.round((Number(p) || 0) * 100);

export function QuoteGenerator({
  items,
  prefill,
}: {
  items: PickerItem[];
  prefill?: QuotePrefill;
}) {
  const [name, setName] = useState(prefill?.customerName ?? "");
  const [email, setEmail] = useState(prefill?.customerEmail ?? "");

  const [search, setSearch] = useState("");
  const [pickedId, setPickedId] = useState<string | null>(null);
  const picked = items.find((i) => i.id === pickedId) ?? null;
  const unitCostPence = picked?.unitCostPence ?? 0;

  const [showCost, setShowCost] = useState(false);
  const [base, setBase] = useState(""); // pounds, editable
  const [discount, setDiscount] = useState("0");
  const [qty, setQty] = useState("1");

  const [fees, setFees] = useState<{ label: string; amount: number }[]>([]); // pence
  const [feePick, setFeePick] = useState("");
  const [customFeeLabel, setCustomFeeLabel] = useState("");
  const [customFeeAmount, setCustomFeeAmount] = useState("");

  const [inclusions, setInclusions] = useState<string[]>([]);
  const [estDelivery, setEstDelivery] = useState("");
  const [valid, setValid] = useState("30");

  const [showPreview, setShowPreview] = useState(false);
  const [belowCostConfirm, setBelowCostConfirm] = useState(false);
  const [done, setDone] = useState<{ token: string } | null>(null);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  // ── Derived pricing (client estimate; server recomputes authoritatively) ──
  const basePence = poundsToPence(base);
  const quantity = Math.max(1, Math.round(Number(qty) || 1));
  const discountPct = Math.min(95, Math.max(0, Number(discount) || 0));
  const { was, now, saving } = applyDiscountPct(basePence, discountPct);
  const feesTotal = fees.reduce((s, f) => s + f.amount, 0);
  const total = now * quantity + feesTotal;
  const originalTotal = was * quantity + feesTotal;
  const profit = computeProfit(unitCostPence * quantity, total);
  const belowCostUnit = unitCostPence > 0 && now < unitCostPence;
  const needsSignOff =
    (unitCostPence > 0 && profit.marginPct < MARGIN_THIN) ||
    total >= HIGH_VALUE_PENCE;

  const groupedFees = useMemo(() => {
    const groups = new Map<string, typeof QUOTE_FEE_LIBRARY>();
    for (const f of QUOTE_FEE_LIBRARY) {
      const g = groups.get(f.group) ?? [];
      g.push(f);
      groups.set(f.group, g);
    }
    return [...groups.entries()];
  }, []);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q),
    );
  }, [items, search]);

  function pickItem(it: PickerItem) {
    setPickedId(it.id);
    setBase(String(it.rrpPence / 100));
    setError("");
  }

  function applyMarkupPct(pct: number) {
    setBase(String(Math.round(applyMarkup(basePence, pct)) / 100));
  }

  function resetBase() {
    if (picked) setBase(String(picked.rrpPence / 100));
    else setBase("");
  }

  function toggleInclusion(i: string) {
    setInclusions((s) =>
      s.includes(i) ? s.filter((x) => x !== i) : [...s, i],
    );
  }

  function addLibraryFee() {
    if (!feePick) return;
    const f = QUOTE_FEE_LIBRARY.find((x) => x.label === feePick);
    if (!f) return;
    setFees((s) => [...s, { label: f.label, amount: f.amount }]);
    setFeePick("");
  }

  function addCustomFee() {
    const label = customFeeLabel.trim();
    if (!label) return;
    setFees((s) => [
      ...s,
      { label, amount: poundsToPence(Number(customFeeAmount)) },
    ]);
    setCustomFeeLabel("");
    setCustomFeeAmount("");
  }

  function removeFee(idx: number) {
    setFees((s) => s.filter((_, i) => i !== idx));
  }

  const canPreview = !!name.trim() && !!email.trim() && basePence > 0;

  function buildForm(confirmedBelowCost: boolean): GenerateQuoteForm {
    return {
      itemId: picked?.id,
      modelSlug: picked?.modelSlug ?? prefill?.modelSlug ?? undefined,
      modelName: picked?.name,
      customerName: name.trim(),
      customerEmail: email.trim(),
      dealId: prefill?.dealId,
      unitBasePounds: Number(base) || 0, // POUNDS to the action
      markupPct: 0, // markup already baked into the edited base price
      discountPct,
      fees, // PENCE
      inclusions,
      estDelivery: estDelivery || undefined,
      validDays: Math.max(1, Math.round(Number(valid) || 30)),
      quantity,
      confirmedBelowCost,
    };
  }

  function submit(confirmedBelowCost = false) {
    setError("");
    start(async () => {
      const r = await generateQuote(buildForm(confirmedBelowCost));
      if (r?.ok && r.token) {
        setDone({ token: r.token });
        setShowPreview(false);
        setBelowCostConfirm(false);
      } else if (r?.warnBelowCost) {
        setBelowCostConfirm(true);
        setError(r.error || "");
      } else {
        setError(r?.error || "Could not generate the quote.");
      }
    });
  }

  function reset() {
    setName(prefill?.customerName ?? "");
    setEmail(prefill?.customerEmail ?? "");
    setSearch("");
    setPickedId(null);
    setShowCost(false);
    setBase("");
    setDiscount("0");
    setQty("1");
    setFees([]);
    setFeePick("");
    setCustomFeeLabel("");
    setCustomFeeAmount("");
    setInclusions([]);
    setEstDelivery("");
    setValid("30");
    setShowPreview(false);
    setBelowCostConfirm(false);
    setDone(null);
    setError("");
  }

  // ── Success panel ──────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
        <div className="flex items-center gap-2 text-[.74rem] font-semibold uppercase tracking-[.12em] text-emerald-800">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
          Quote sent
        </div>
        <p className="mt-2 text-[.95rem] text-emerald-900">
          The quote has been generated and emailed to {email}.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/q/${done.token}`}
            target="_blank"
            className="rounded-[2px] bg-ink px-5 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black"
          >
            View quote
          </Link>
          <button
            onClick={reset}
            className="rounded-[2px] border border-line-2 bg-white px-5 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em] hover:border-ink"
          >
            New quote
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-line bg-white p-5 sm:p-6">
      <h2 className={sectionTitle}>Build a quote</h2>
      {error && !showPreview && (
        <p className="mt-2 text-[.84rem] text-rose-600">{error}</p>
      )}

      {/* Customer */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className={labelCls}>Customer name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Customer name"
            className={field}
          />
        </label>
        <label className="block">
          <span className={labelCls}>Customer email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className={field}
          />
        </label>
      </div>

      {/* Buggy picker */}
      <div className="mt-5">
        <span className={labelCls}>Buggy</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or SKU"
          className={field}
        />
        <div className="mt-2 max-h-64 overflow-y-auto rounded-[4px] border border-line">
          {filteredItems.length === 0 && (
            <p className="p-3 text-[.84rem] text-ink-2">No matching stock.</p>
          )}
          {filteredItems.map((it) => {
            const active = it.id === pickedId;
            return (
              <button
                key={it.id}
                type="button"
                onClick={() => pickItem(it)}
                className={cn(
                  "flex w-full items-center gap-3 border-b border-line p-2.5 text-left transition-colors last:border-0",
                  active ? "bg-emerald-50" : "hover:bg-paper",
                )}
              >
                <span className="relative h-9 w-12 flex-none overflow-hidden rounded bg-paper">
                  <Image
                    src={vehicleImage(it.modelSlug)}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-contain p-0.5"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[.9rem] font-medium">
                    {it.name}
                  </span>
                  <span className="block truncate text-[.76rem] text-ink-2">
                    {it.sku} · {it.available} available
                  </span>
                </span>
                <span className="flex-none text-[.84rem] font-semibold tabular-nums">
                  {gbpFromPence(it.rrpPence)}
                </span>
                {active && (
                  <span className="flex-none text-[.7rem] font-semibold uppercase tracking-[.08em] text-emerald-700">
                    Picked
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cost & margin (internal) */}
      {picked && (
        <div className="mt-4 rounded-[4px] border border-line-2 bg-paper">
          <button
            type="button"
            onClick={() => setShowCost((s) => !s)}
            className="flex w-full items-center justify-between p-3 text-left"
          >
            <span className="text-[.7rem] font-semibold uppercase tracking-[.1em] text-ink-2">
              Cost &amp; margin · internal
            </span>
            <span className="text-[.78rem] text-ink-2">
              {showCost ? "Hide" : "Show"}
            </span>
          </button>
          {showCost && (
            <div className="border-t border-line-2 p-3 text-[.86rem]">
              <div className="flex justify-between">
                <span className="text-ink-2">Unit landed cost</span>
                <span className="font-semibold tabular-nums">
                  {gbpFromPence(unitCostPence)}
                </span>
              </div>
              <div className="mt-1 flex justify-between">
                <span className="text-ink-2">Cost x {quantity}</span>
                <span className="font-semibold tabular-nums">
                  {gbpFromPence(unitCostPence * quantity)}
                </span>
              </div>
              <p className="mt-2 text-[.74rem] text-ink-2">
                Internal only. Never shown to the customer. The server recomputes
                profit authoritatively from the inventory item.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Base price + markup */}
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <label className="block">
          <span className={labelCls}>Base price (GBP)</span>
          <input
            type="number"
            min="0"
            value={base}
            onChange={(e) => setBase(e.target.value)}
            placeholder="0"
            className={field}
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[10, 20, 50].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => applyMarkupPct(p)}
                className="rounded-[2px] border border-line-2 px-2.5 py-1 text-[.72rem] font-semibold hover:border-ink"
              >
                +{p}%
              </button>
            ))}
            <button
              type="button"
              onClick={resetBase}
              className="rounded-[2px] border border-line-2 px-2.5 py-1 text-[.72rem] font-semibold text-ink-2 hover:border-ink"
            >
              Reset
            </button>
          </div>
        </label>

        <label className="block">
          <span className={labelCls}>Discount %</span>
          <input
            type="number"
            min="0"
            max="95"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className={field}
          />
          {discountPct > 0 && basePence > 0 && (
            <div className="mt-2 text-[.82rem]">
              <s className="text-ink-2">{gbpFromPence(was)}</s>{" "}
              <span className="font-semibold">{gbpFromPence(now)}</span>
              <span className="ml-1 font-semibold text-emerald-700">
                save {gbpFromPence(saving)}
              </span>
            </div>
          )}
        </label>

        <label className="block">
          <span className={labelCls}>Quantity</span>
          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className={field}
          />
        </label>
      </div>

      {/* Fees */}
      <div className="mt-5">
        <span className={labelCls}>Fees</span>
        <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
          <select
            value={feePick}
            onChange={(e) => setFeePick(e.target.value)}
            className={field}
          >
            <option value="">Add a named fee…</option>
            {groupedFees.map(([group, list]) => (
              <optgroup key={group} label={group}>
                {list.map((f) => (
                  <option key={f.label} value={f.label}>
                    {f.label} ({gbpFromPence(f.amount)})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <button
            type="button"
            onClick={addLibraryFee}
            disabled={!feePick}
            className="rounded-[2px] border border-line-2 px-4 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em] hover:border-ink disabled:opacity-40"
          >
            Add
          </button>
        </div>
        <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_140px_auto]">
          <input
            value={customFeeLabel}
            onChange={(e) => setCustomFeeLabel(e.target.value)}
            placeholder="Custom fee label"
            className={field}
          />
          <input
            type="number"
            min="0"
            value={customFeeAmount}
            onChange={(e) => setCustomFeeAmount(e.target.value)}
            placeholder="Amount (GBP)"
            className={field}
          />
          <button
            type="button"
            onClick={addCustomFee}
            disabled={!customFeeLabel.trim()}
            className="rounded-[2px] border border-line-2 px-4 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em] hover:border-ink disabled:opacity-40"
          >
            Add
          </button>
        </div>
        {fees.length > 0 && (
          <ul className="mt-3 divide-y divide-line rounded-[4px] border border-line">
            {fees.map((f, i) => (
              <li
                key={`${f.label}-${i}`}
                className="flex items-center justify-between p-2.5 text-[.86rem]"
              >
                <span>{f.label}</span>
                <span className="flex items-center gap-3">
                  <span className="font-semibold tabular-nums">
                    {gbpFromPence(f.amount)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFee(i)}
                    className="text-[.74rem] font-semibold text-rose-600 hover:underline"
                  >
                    Remove
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Inclusions */}
      <div className="mt-5">
        <span className={labelCls}>Inclusions</span>
        <div className="flex flex-wrap gap-2">
          {INCLUSIONS_LIBRARY.map((i) => {
            const on = inclusions.includes(i);
            return (
              <button
                key={i}
                type="button"
                onClick={() => toggleInclusion(i)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-[.74rem] font-medium transition-colors",
                  on
                    ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                    : "border-line-2 text-ink-2 hover:border-ink",
                )}
              >
                {on ? "✓ " : ""}
                {i}
              </button>
            );
          })}
        </div>
      </div>

      {/* Delivery + validity */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={labelCls}>Estimated delivery</span>
          <input
            type="date"
            value={estDelivery}
            onChange={(e) => setEstDelivery(e.target.value)}
            className={field}
          />
        </label>
        <label className="block">
          <span className={labelCls}>Valid (days)</span>
          <input
            type="number"
            min="1"
            value={valid}
            onChange={(e) => setValid(e.target.value)}
            className={field}
          />
        </label>
      </div>

      {/* Live profit standout */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <span className={labelCls}>Estimated profit (internal)</span>
          <span className="text-[.84rem] font-semibold tabular-nums">
            Total {gbpFromPence(total)}
          </span>
        </div>
        <ProfitBadge
          profit={profit.profit}
          marginPct={profit.marginPct}
          band={profit.band}
          variant="standout"
        />
        {belowCostUnit && (
          <p className="mt-2 rounded-[4px] border border-rose-200 bg-rose-50 px-3 py-2 text-[.82rem] font-medium text-rose-800">
            Below cost: the unit price {gbpFromPence(now)} is under the landed
            cost {gbpFromPence(unitCostPence)}.
          </p>
        )}
        {!belowCostUnit && needsSignOff && (
          <p className="mt-2 rounded-[4px] border border-amber-200 bg-amber-50 px-3 py-2 text-[.82rem] font-medium text-amber-800">
            Needs sign-off:{" "}
            {total >= HIGH_VALUE_PENCE
              ? "high-value quote (£50k+)."
              : "margin is below the thin-margin threshold."}{" "}
            This will be flagged for approval.
          </p>
        )}
      </div>

      {/* Preview trigger */}
      <div className="mt-6">
        <button
          type="button"
          onClick={() => {
            setError("");
            setBelowCostConfirm(false);
            setShowPreview(true);
          }}
          disabled={!canPreview}
          className="rounded-[2px] bg-ink px-5 py-2.5 text-[.72rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black disabled:opacity-50"
        >
          Preview quote
        </button>
        {!canPreview && (
          <span className="ml-3 text-[.8rem] text-ink-2">
            Add a customer name, email and base price to preview.
          </span>
        )}
      </div>

      {showPreview && (
        <PreviewModal
          name={name}
          email={email}
          modelName={picked?.name ?? prefill?.modelSlug ?? "Bespoke build"}
          modelSlug={picked?.modelSlug ?? prefill?.modelSlug ?? null}
          quantity={quantity}
          discountPct={discountPct}
          unitWas={was}
          unitNow={now}
          fees={fees}
          inclusions={inclusions}
          estDelivery={estDelivery}
          validDays={Math.max(1, Math.round(Number(valid) || 30))}
          total={total}
          originalTotal={originalTotal}
          profit={profit}
          belowCostUnit={belowCostUnit}
          unitCostPence={unitCostPence}
          needsSignOff={needsSignOff}
          belowCostConfirm={belowCostConfirm}
          error={error}
          pending={pending}
          onBack={() => {
            setShowPreview(false);
            setBelowCostConfirm(false);
            setError("");
          }}
          onConfirm={() => submit(false)}
          onSendAnyway={() => submit(true)}
        />
      )}
    </div>
  );
}

function PreviewModal(props: {
  name: string;
  email: string;
  modelName: string;
  modelSlug: string | null;
  quantity: number;
  discountPct: number;
  unitWas: number;
  unitNow: number;
  fees: { label: string; amount: number }[];
  inclusions: string[];
  estDelivery: string;
  validDays: number;
  total: number;
  originalTotal: number;
  profit: ReturnType<typeof computeProfit>;
  belowCostUnit: boolean;
  unitCostPence: number;
  needsSignOff: boolean;
  belowCostConfirm: boolean;
  error: string;
  pending: boolean;
  onBack: () => void;
  onConfirm: () => void;
  onSendAnyway: () => void;
}) {
  const {
    name,
    email,
    modelName,
    modelSlug,
    quantity,
    discountPct,
    unitWas,
    unitNow,
    fees,
    inclusions,
    estDelivery,
    validDays,
    total,
    originalTotal,
    profit,
    belowCostUnit,
    unitCostPence,
    needsSignOff,
    belowCostConfirm,
    error,
    pending,
    onBack,
    onConfirm,
    onSendAnyway,
  } = props;

  const deliveryLabel = estDelivery
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(estDelivery))
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:p-8">
      <div className="w-full max-w-2xl rounded-lg border border-line bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[.74rem] font-semibold uppercase tracking-[.12em] text-ink-2">
            Quote preview
          </h3>
          <button
            type="button"
            onClick={onBack}
            className="text-[.78rem] font-semibold text-ink-2 hover:text-ink"
          >
            Close
          </button>
        </div>

        {/* Customer-facing summary */}
        <div className="mt-4 rounded-lg border border-line bg-paper p-4">
          <div className="flex items-center gap-3">
            <span className="relative h-12 w-16 flex-none overflow-hidden rounded bg-white">
              <Image
                src={vehicleImage(modelSlug)}
                alt=""
                fill
                sizes="64px"
                className="object-contain p-1"
              />
            </span>
            <div>
              <div className="text-[.95rem] font-semibold">
                {modelName}
                {quantity > 1 ? ` x ${quantity}` : ""}
              </div>
              <div className="text-[.8rem] text-ink-2">
                For {name} · {email}
              </div>
            </div>
          </div>

          <ul className="mt-3 divide-y divide-line text-[.86rem]">
            <li className="flex justify-between py-1.5">
              <span>
                {modelName}
                {quantity > 1 ? ` x ${quantity}` : ""}
              </span>
              <span className="tabular-nums">
                {gbpFromPence(unitNow * quantity)}
              </span>
            </li>
            {fees.map((f, i) => (
              <li key={`${f.label}-${i}`} className="flex justify-between py-1.5">
                <span>{f.label}</span>
                <span className="tabular-nums">{gbpFromPence(f.amount)}</span>
              </li>
            ))}
          </ul>

          {inclusions.length > 0 && (
            <div className="mt-3">
              <div className="text-[.7rem] font-semibold uppercase tracking-[.1em] text-ink-2">
                Included
              </div>
              <ul className="mt-1 flex flex-wrap gap-1.5">
                {inclusions.map((i) => (
                  <li
                    key={i}
                    className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[.74rem] text-emerald-800"
                  >
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-3 border-t border-line pt-3">
            {discountPct > 0 ? (
              <div className="text-[.9rem]">
                <s className="text-ink-2">{gbpFromPence(originalTotal)}</s>
                <div className="text-[1.3rem] font-semibold tabular-nums">
                  {gbpFromPence(total)}
                </div>
                <div className="text-[.82rem] font-semibold text-emerald-700">
                  Save {gbpFromPence(originalTotal - total)} ({discountPct}% off)
                </div>
              </div>
            ) : (
              <div className="text-[1.3rem] font-semibold tabular-nums">
                {gbpFromPence(total)}
              </div>
            )}
            <div className="mt-1 text-[.8rem] text-ink-2">
              {deliveryLabel && `Estimated delivery ${deliveryLabel}. `}
              Valid for {validDays} days.
            </div>
          </div>
        </div>

        {/* Internal profit */}
        <div className="mt-4">
          <div className="mb-1 text-[.7rem] font-semibold uppercase tracking-[.1em] text-ink-2">
            Internal · not shown to customer
          </div>
          <ProfitBadge
            profit={profit.profit}
            marginPct={profit.marginPct}
            band={profit.band}
            variant="standout"
          />
          {unitCostPence > 0 && (
            <p className="mt-2 text-[.8rem] text-ink-2">
              Landed cost {gbpFromPence(unitCostPence * quantity)} for {quantity}{" "}
              unit{quantity > 1 ? "s" : ""}.
            </p>
          )}
          {needsSignOff && !belowCostUnit && (
            <p className="mt-2 rounded-[4px] border border-amber-200 bg-amber-50 px-3 py-2 text-[.82rem] font-medium text-amber-800">
              This quote will be flagged for a second sign-off.
            </p>
          )}
        </div>

        {/* Below-cost confirmation (returned by the server) */}
        {belowCostConfirm ? (
          <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 p-4">
            <div className="text-[.84rem] font-semibold text-rose-800">
              Below-cost price
            </div>
            <p className="mt-1 text-[.84rem] text-rose-800">
              {error || "This price is below the landed cost."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onSendAnyway}
                disabled={pending}
                className="rounded-[2px] bg-rose-600 px-5 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {pending ? "Sending…" : "Send anyway"}
              </button>
              <button
                type="button"
                onClick={onBack}
                className="rounded-[2px] border border-line-2 px-5 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em] hover:border-ink"
              >
                Back to edit
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-5 border-t border-line pt-4">
            <p className="text-[.95rem] font-medium">
              Would you like to send this quote?
            </p>
            <p className="mt-1 text-[.84rem] text-ink-2">
              {modelName}
              {quantity > 1 ? ` x ${quantity}` : ""} for {name}, total{" "}
              {gbpFromPence(total)}. The customer will receive it by email.
            </p>
            {error && (
              <p className="mt-2 text-[.84rem] text-rose-600">{error}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onConfirm}
                disabled={pending}
                className="rounded-[2px] bg-ink px-5 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black disabled:opacity-50"
              >
                {pending ? "Sending…" : "Confirm and send"}
              </button>
              <button
                type="button"
                onClick={onBack}
                className="rounded-[2px] border border-line-2 px-5 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em] hover:border-ink"
              >
                Back to edit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
