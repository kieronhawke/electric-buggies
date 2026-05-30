"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { moveDeal, convertDealToOrder } from "@/lib/crm-actions";
import { gbpFromPence } from "@/lib/format";
import { cn } from "@/lib/utils";

type Deal = { id: string; name: string; email: string; company: string | null; stage: string; source: string; value: number | null; note: string | null; orderId: string | null };

const COLUMNS: { key: string; label: string }[] = [
  { key: "new", label: "New enquiry" },
  { key: "contacted", label: "Contacted" },
  { key: "quote_sent", label: "Quote sent" },
  { key: "negotiation", label: "Negotiation" },
  { key: "won", label: "Won" },
  { key: "lost", label: "Lost" },
];

export function CrmBoard({ deals: initial }: { deals: Deal[] }) {
  const router = useRouter();
  const [deals, setDeals] = useState(initial);
  const [dragId, setDragId] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const [, start] = useTransition();
  const [msg, setMsg] = useState("");

  function onDrop(stage: string) {
    setOver(null);
    const id = dragId;
    setDragId(null);
    if (!id) return;
    const deal = deals.find((d) => d.id === id);
    if (!deal || deal.stage === stage) return;
    setDeals((ds) => ds.map((d) => (d.id === id ? { ...d, stage } : d))); // optimistic
    start(async () => { await moveDeal(id, stage); router.refresh(); });
  }

  function convert(id: string) {
    start(async () => {
      const r = await convertDealToOrder(id);
      if (r?.ok) { setMsg(`Converted to order ${r.ref}.`); router.refresh(); }
      else setMsg(r?.error || "Could not convert.");
    });
  }

  return (
    <div>
      {msg && <p className="mb-3 rounded-[4px] border border-line bg-paper px-4 py-2 text-[.85rem]">{msg}</p>}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const items = deals.filter((d) => d.stage === col.key);
          return (
            <div
              key={col.key}
              onDragOver={(e) => { e.preventDefault(); setOver(col.key); }}
              onDragLeave={() => setOver((o) => (o === col.key ? null : o))}
              onDrop={() => onDrop(col.key)}
              className={cn("w-[260px] flex-none rounded-lg border bg-paper p-2.5 transition-colors", over === col.key ? "border-ink bg-paper-2" : "border-line")}
            >
              <div className="flex items-center justify-between px-1.5 py-1">
                <span className="text-[.7rem] font-semibold uppercase tracking-[.1em] text-ink-2">{col.label}</span>
                <span className="text-[.7rem] font-semibold text-ink-2">{items.length}</span>
              </div>
              <div className="mt-1.5 flex flex-col gap-2">
                {items.map((d) => (
                  <div
                    key={d.id}
                    draggable
                    onDragStart={() => setDragId(d.id)}
                    onDragEnd={() => setDragId(null)}
                    className="cursor-grab rounded-[5px] border border-line bg-white p-3 active:cursor-grabbing"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[.9rem] font-semibold leading-tight">{d.name}</span>
                      <span className="rounded-full border border-line-2 px-1.5 py-0.5 text-[.56rem] font-semibold uppercase tracking-[.06em] text-ink-2">{d.source}</span>
                    </div>
                    {d.company && <div className="mt-0.5 text-[.8rem] text-ink-2">{d.company}</div>}
                    {d.value != null && <div className="mt-1 text-[.8rem] font-semibold tabular-nums">{gbpFromPence(d.value)}</div>}
                    {d.note && <p className="mt-1.5 line-clamp-2 text-[.78rem] text-ink-2">{d.note}</p>}
                    {col.key === "won" && !d.orderId && (
                      <button onClick={() => convert(d.id)} className="mt-2 w-full rounded-[2px] bg-ink py-1.5 text-[.64rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black">Convert to order</button>
                    )}
                    {d.orderId && <div className="mt-2 text-[.68rem] font-semibold uppercase tracking-[.06em] text-ink-2">Order created</div>}
                  </div>
                ))}
                {items.length === 0 && <p className="px-1.5 py-3 text-[.78rem] text-ink-2/70">Drop here</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
