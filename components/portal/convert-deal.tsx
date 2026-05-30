"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { convertDealToOrder } from "@/lib/crm-actions";

export function ConvertDeal({ dealId }: { dealId: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState("");
  function convert() {
    start(async () => {
      const r = await convertDealToOrder(dealId);
      if (r?.ok) { setMsg(`Converted to order ${r.ref}.`); router.refresh(); }
      else setMsg(r?.error || "Could not convert.");
    });
  }
  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
      <p className="text-[.92rem] text-emerald-900">This deal is won. Convert it to an order to begin the build journey.</p>
      <button onClick={convert} disabled={pending} className="mt-3 rounded-[2px] bg-ink px-5 py-2.5 text-[.72rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black disabled:opacity-50">{pending ? "Converting…" : "Convert to order"}</button>
      {msg && <p className="mt-2 text-[.84rem] font-medium">{msg}</p>}
    </div>
  );
}
