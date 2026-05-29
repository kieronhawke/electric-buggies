"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const field = "w-full rounded-lg border border-line bg-white px-4 py-3 text-ink outline-none transition-colors placeholder:text-ink-2 focus:border-ink";

/** Debounced async autocomplete with free-text fallback (Companies House / Places). */
export function Autocomplete<T extends { label: string }>({
  value, onChange, onPick, fetcher, placeholder, label, id,
}: {
  value: string;
  onChange: (v: string) => void;
  onPick?: (item: T) => void;
  fetcher: (q: string) => Promise<T[]>;
  placeholder?: string;
  label: string;
  id: string;
}) {
  const [items, setItems] = useState<T[]>([]);
  const [open, setOpen] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (t.current) clearTimeout(t.current);
    if (value.trim().length < 2) { setItems([]); return; }
    t.current = setTimeout(async () => {
      try { setItems(await fetcher(value)); setOpen(true); } catch { setItems([]); }
    }, 280);
    return () => { if (t.current) clearTimeout(t.current); };
  }, [value, fetcher]);

  return (
    <div className="relative">
      <label htmlFor={id} className="mb-2 block text-[0.7rem] font-medium uppercase tracking-[0.14em] text-ink-2">{label}</label>
      <input id={id} className={field} value={value} placeholder={placeholder} autoComplete="off"
        onChange={(e) => onChange(e.target.value)} onFocus={() => items.length && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)} />
      {open && items.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-line bg-white shadow-lg">
          {items.map((it, i) => (
            <li key={i}>
              <button type="button" className="block w-full px-4 py-2.5 text-left text-sm hover:bg-paper"
                onMouseDown={(e) => { e.preventDefault(); onChange(it.label); onPick?.(it); setOpen(false); }}>
                {it.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const DIAL = [
  { c: "UK", d: "+44" }, { c: "US", d: "+1" }, { c: "AE", d: "+971" }, { c: "QA", d: "+974" },
  { c: "SA", d: "+966" }, { c: "CH", d: "+41" }, { c: "MC", d: "+377" }, { c: "FR", d: "+33" },
  { c: "ES", d: "+34" }, { c: "IT", d: "+39" }, { c: "PT", d: "+351" }, { c: "SG", d: "+65" },
  { c: "AU", d: "+61" }, { c: "MV", d: "+960" }, { c: "MU", d: "+230" }, { c: "BB", d: "+1" },
];

/** International phone input: country-code dropdown + number. */
export function PhoneInput({ dial, number, onDial, onNumber, label = "Phone" }: {
  dial: string; number: string; onDial: (v: string) => void; onNumber: (v: string) => void; label?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-[0.7rem] font-medium uppercase tracking-[0.14em] text-ink-2">{label}</label>
      <div className="flex gap-2">
        <select value={dial} onChange={(e) => onDial(e.target.value)} className={cn(field, "w-28 flex-none")} aria-label="Country dialling code">
          {DIAL.map((x) => <option key={x.c + x.d} value={x.d}>{x.c} {x.d}</option>)}
        </select>
        <input className={field} value={number} onChange={(e) => onNumber(e.target.value)} placeholder="7700 900000" inputMode="tel" />
      </div>
    </div>
  );
}
