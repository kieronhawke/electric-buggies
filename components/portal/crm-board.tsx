"use client";

import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { moveDeal, createDeal } from "@/lib/crm-actions";
import { gbpFromPence } from "@/lib/format";
import { vehicleImage } from "@/lib/vehicle-image";
import { DEAL_STAGE_STYLE, avatarStyle } from "@/lib/status-style";
import { cn } from "@/lib/utils";

type Deal = { id: string; name: string; email: string; company: string | null; stage: string; source: string; value: number | null; note: string | null; nextAction: string | null; modelSlug: string | null; assigneeName: string | null; orderId: string | null };

const COLUMNS = [
  { key: "new", label: "New enquiry" }, { key: "contacted", label: "Contacted" }, { key: "quote_sent", label: "Quote sent" },
  { key: "negotiation", label: "Negotiation" }, { key: "won", label: "Won" }, { key: "lost", label: "Lost" },
];

export function CrmBoard({ deals: initial }: { deals: Deal[] }) {
  const router = useRouter();
  const [deals, setDeals] = useState(initial);
  const [dragId, setDragId] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const draggedRef = useRef(false);
  const [, start] = useTransition();
  const [adding, setAdding] = useState(false);
  const [f, setF] = useState({ name: "", email: "", company: "", value: "" });

  function onDrop(stage: string) {
    setOver(null); const id = dragId; setDragId(null);
    if (!id) return;
    const d = deals.find((x) => x.id === id);
    if (!d || d.stage === stage) return;
    setDeals((ds) => ds.map((x) => (x.id === id ? { ...x, stage } : x)));
    start(async () => { await moveDeal(id, stage); router.refresh(); });
  }
  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!f.name.trim() || !f.email.trim()) return;
    start(async () => { await createDeal({ name: f.name, email: f.email, company: f.company || undefined, value: f.value ? Math.round(Number(f.value) * 100) : undefined }); setF({ name: "", email: "", company: "", value: "" }); setAdding(false); router.refresh(); });
  }

  const field = "rounded-[3px] border border-line-2 bg-white p-2 text-[.85rem] outline-none focus:border-ink";
  return (
    <div>
      <div className="mb-4">
        {adding ? (
          <form onSubmit={add} className="flex flex-wrap items-end gap-2 rounded-lg border border-line bg-white p-3">
            <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Name" className={field} required />
            <input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="Email" className={field} required />
            <input value={f.company} onChange={(e) => setF({ ...f, company: e.target.value })} placeholder="Company" className={field} />
            <input type="number" value={f.value} onChange={(e) => setF({ ...f, value: e.target.value })} placeholder="Value GBP" className={cn(field, "w-28")} />
            <button type="submit" className="rounded-[2px] bg-ink px-4 py-2 text-[.7rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black">Add deal</button>
            <button type="button" onClick={() => setAdding(false)} className="rounded-[2px] border border-line-2 px-3 py-2 text-[.7rem] font-semibold uppercase tracking-[.06em]">Cancel</button>
          </form>
        ) : <button onClick={() => setAdding(true)} className="rounded-[2px] bg-ink px-5 py-2.5 text-[.74rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black">Add deal</button>}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4" tabIndex={0} role="region" aria-label="Deal pipeline, scroll horizontally">
        {COLUMNS.map((col) => {
          const items = deals.filter((d) => d.stage === col.key);
          const style = DEAL_STAGE_STYLE[col.key];
          return (
            <div key={col.key} onDragOver={(e) => { e.preventDefault(); setOver(col.key); }} onDragLeave={() => setOver((o) => (o === col.key ? null : o))} onDrop={() => onDrop(col.key)}
              className={cn("w-[270px] flex-none rounded-lg border p-2.5 transition-colors", over === col.key ? "border-ink" : style.ring, style.tint)}>
              <div className="flex items-center justify-between px-1.5 py-1">
                <span className="flex items-center gap-1.5 text-[.7rem] font-semibold uppercase tracking-[.1em] text-ink-2"><span className={cn("h-2 w-2 rounded-full", style.dot)} />{col.label}</span>
                <span className="text-[.7rem] font-semibold text-ink-2">{items.length}</span>
              </div>
              <div className="mt-1.5 flex flex-col gap-2">
                {items.map((d) => {
                  const av = avatarStyle(d.assigneeName || "EB");
                  return (
                    <div key={d.id} draggable
                      onDragStart={() => { draggedRef.current = true; setDragId(d.id); }}
                      onDragEnd={() => { setDragId(null); setTimeout(() => { draggedRef.current = false; }, 50); }}
                      onClick={() => { if (!draggedRef.current) router.push(`/admin/crm/${d.id}`); }}
                      className="cursor-pointer rounded-[6px] border border-line bg-white p-2.5 transition-shadow hover:shadow-[0_10px_24px_-18px_rgba(0,0,0,0.4)]">
                      <div className="flex gap-2.5">
                        <div className="relative h-12 w-16 flex-none overflow-hidden rounded bg-paper"><Image src={vehicleImage(d.modelSlug)} alt="" fill sizes="64px" className="object-contain p-1" draggable={false} /></div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[.88rem] font-semibold leading-tight">{d.name}</div>
                          {d.company && <div className="truncate text-[.76rem] text-ink-2">{d.company}</div>}
                          {d.value != null && <div className="mt-0.5 text-[.82rem] font-semibold tabular-nums">{gbpFromPence(d.value)}</div>}
                        </div>
                      </div>
                      {d.nextAction && <p className="mt-1.5 truncate text-[.74rem] text-ink-2">Next: {d.nextAction}</p>}
                      <div className="mt-2 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[.7rem] text-ink-2">
                          <span className={cn("grid h-5 w-5 place-items-center rounded-full text-[.56rem] font-bold text-white", av.bg)}>{av.initials}</span>
                          {d.assigneeName || "Unassigned"}
                        </span>
                        <span className="rounded-full border border-line px-1.5 py-0.5 text-[.54rem] font-semibold uppercase tracking-[.06em] text-ink-2">{d.source}</span>
                      </div>
                    </div>
                  );
                })}
                {items.length === 0 && <p className="px-1.5 py-3 text-[.76rem] text-ink-2">Drop here</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
