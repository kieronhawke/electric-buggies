"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateItem, duplicateItem, deleteItem } from "@/lib/inventory-actions";
import { cn } from "@/lib/utils";

const STATUSES = ["active", "draft", "archived"] as const;

export function InventoryStatus({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [cur, setCur] = useState(status);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function setStatus(next: string) {
    if (next === cur) return;
    setMsg(""); setError("");
    start(async () => {
      const r = await updateItem(id, { status: next });
      if (r?.ok) { setCur(next); setMsg("Status updated."); router.refresh(); }
      else setError(r?.error || "Could not update.");
    });
  }

  function duplicate() {
    setMsg(""); setError("");
    start(async () => {
      const r = await duplicateItem(id);
      if (r?.ok && r.id) router.push(`/admin/inventory/${r.id}`);
      else setError(r?.error || "Could not duplicate.");
    });
  }

  function archive() {
    if (!confirm("Archive this buggy? It will be hidden from active inventory but its history is kept.")) return;
    setMsg(""); setError("");
    start(async () => {
      const r = await deleteItem(id);
      if (r?.ok) router.push("/admin/inventory");
      else setError(r?.error || "Could not archive.");
    });
  }

  return (
    <section className="rounded-lg border border-line bg-white p-5 sm:p-6">
      <h2 className="text-[.74rem] font-semibold uppercase tracking-[.12em] text-ink-2">Status &amp; actions</h2>
      {msg && <p className="mt-2 rounded-[4px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-[.84rem] text-emerald-800">✓ {msg}</p>}
      {error && <p className="mt-2 rounded-[4px] border border-rose-200 bg-rose-50 px-3 py-2 text-[.84rem] text-rose-700">{error}</p>}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            disabled={pending}
            onClick={() => setStatus(s)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-[.74rem] font-semibold uppercase tracking-[.06em] disabled:opacity-50",
              cur === s ? "border-ink bg-ink text-white" : "border-line-2 text-ink-2 hover:border-ink hover:text-ink",
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
        <button type="button" disabled={pending} onClick={duplicate} className="rounded-[2px] border border-line-2 px-4 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em] text-ink-2 hover:border-ink hover:text-ink disabled:opacity-50">Duplicate</button>
        <button type="button" disabled={pending} onClick={archive} className="rounded-[2px] border border-rose-200 bg-rose-50 px-4 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em] text-rose-700 hover:bg-rose-100 disabled:opacity-50">Archive</button>
      </div>
    </section>
  );
}
