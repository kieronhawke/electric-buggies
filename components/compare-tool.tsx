"use client";

import { useState } from "react";
import Link from "next/link";
import { VehicleRender } from "./vehicle-render";
import { Button, Arrow } from "./ui/button";
import { gbp, cn } from "@/lib/utils";
import type { Model } from "@/lib/data/models";

const SPEC_ROWS: { key: keyof Model["specs"]; label: string }[] = [
  { key: "seats", label: "Seats" },
  { key: "range", label: "Range" },
  { key: "battery", label: "Battery" },
  { key: "topSpeed", label: "Top speed" },
  { key: "dimensions", label: "Dimensions (L×W×H)" },
  { key: "charge", label: "Charge time" },
];

/** Model comparison — pick up to 3, compare specs/price side by side (§7). */
export function CompareTool({ models, initial }: { models: Model[]; initial: string[] }) {
  const selectable = models.filter((m) => m.basePrice > 0);
  const [selected, setSelected] = useState<string[]>(
    initial.length ? initial.slice(0, 3) : selectable.slice(0, 3).map((m) => m.slug),
  );

  const toggle = (slug: string) =>
    setSelected((s) =>
      s.includes(slug) ? s.filter((x) => x !== slug) : s.length < 3 ? [...s, slug] : s,
    );

  const chosen = selected.map((s) => models.find((m) => m.slug === s)).filter((m): m is Model => !!m);

  return (
    <div>
      {/* Selector */}
      <div className="flex flex-wrap gap-2">
        {selectable.map((m) => {
          const on = selected.includes(m.slug);
          const full = !on && selected.length >= 3;
          return (
            <button
              key={m.slug}
              onClick={() => toggle(m.slug)}
              disabled={full}
              aria-pressed={on}
              className={cn(
                "rounded-full border px-5 py-2 text-[.72rem] font-semibold uppercase tracking-[.12em] transition-all",
                on ? "border-ink bg-ink text-white" : "border-line-2 text-ink-2 hover:border-ink hover:text-ink",
                full && "cursor-not-allowed opacity-40",
              )}
            >
              {m.name}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-[.8rem] text-ink-2">Select up to three models to compare.</p>

      {/* Comparison table */}
      {chosen.length === 0 ? (
        <p className="mt-12 text-ink-2">Choose a model above to begin.</p>
      ) : (
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr>
                <th className="w-40 p-4 text-left align-bottom" />
                {chosen.map((m) => (
                  <th key={m.slug} className="border-b border-line p-4 text-left align-bottom">
                    <div className="mb-3 flex aspect-[16/11] items-center justify-center rounded-lg ph">
                      <VehicleRender colour={m.plate} className="max-h-[80%]" title={m.name} />
                    </div>
                    <div className="text-[.62rem] font-semibold uppercase tracking-[.2em] text-ink-2">{m.categoryLabel}</div>
                    <div className="text-xl">{m.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" className="p-4 text-left text-[.7rem] font-semibold uppercase tracking-[.12em] text-ink-2">From</th>
                {chosen.map((m) => (
                  <td key={m.slug} className="border-b border-line p-4 font-semibold">{gbp(m.basePrice)}</td>
                ))}
              </tr>
              {SPEC_ROWS.map((row) => (
                <tr key={row.key}>
                  <th scope="row" className="p-4 text-left text-[.7rem] font-semibold uppercase tracking-[.12em] text-ink-2">{row.label}</th>
                  {chosen.map((m) => (
                    <td key={m.slug} className="border-b border-line p-4 text-ink">{m.specs[row.key]}</td>
                  ))}
                </tr>
              ))}
              <tr>
                <th scope="row" className="p-4" />
                {chosen.map((m) => (
                  <td key={m.slug} className="p-4">
                    <div className="flex flex-col gap-2">
                      <Button href={`/configure/${m.slug}`} size="md">Configure <Arrow /></Button>
                      <Link href={`/range/${m.slug}`} className="text-center text-[.72rem] font-semibold uppercase tracking-[.12em] text-ink-2 hover:text-ink">View model</Link>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
