"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signContract } from "@/lib/customer-actions";

export function ContractSign({
  orderId, reference, model, total, tncsVersion,
}: { orderId: string; reference: string; model: string; total: string; tncsVersion: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [accept, setAccept] = useState(false);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function sign(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    start(async () => {
      const r = await signContract(orderId, name, accept);
      if (r?.ok) router.refresh();
      else setError(r?.error || "Could not sign.");
    });
  }

  return (
    <section className="rounded-lg border border-ink bg-white p-6 shadow-[0_24px_44px_-34px_rgba(0,0,0,0.4)] sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Your contract is ready to sign</h2>
        <button onClick={() => window.print()} className="rounded-[2px] border border-line-2 px-4 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em] hover:border-ink">Download / print</button>
      </div>

      <div className="mt-5 rounded-lg border border-line bg-paper p-5 text-[.9rem] leading-relaxed">
        <p className="font-semibold">Order agreement {reference}</p>
        <p className="mt-2 text-ink-2">This agreement is between Electric Buggies and the account holder for the supply of one <b className="text-ink">{model}</b> to the specification recorded on this order, at a total of <b className="text-ink">{total}</b> (indicative; final on quotation).</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-ink-2">
          <li>Build proceeds to the specification shown in your order&rsquo;s design details.</li>
          <li>Payment is by bank transfer to the details provided after signing.</li>
          <li>Delivery timescales are estimates and confirmed as the build progresses.</li>
          <li>Deposit, cancellation and warranty terms are set out in the full written terms ({tncsVersion}).</li>
        </ul>
        <p className="mt-3 text-[.8rem] text-ink-2">Full terms version {tncsVersion}. A copy of your signed agreement is saved to your account.</p>
      </div>

      <form onSubmit={sign} className="mt-5">
        <label className="block">
          <span className="mb-1.5 block text-[.74rem] font-semibold uppercase tracking-[.12em] text-ink-2">Type your full name to sign</span>
          <input value={name} onChange={(e) => setName(e.target.value)} required className="h-12 w-full rounded-[3px] border border-line-2 px-3.5 text-[1.05rem] outline-none focus:border-ink" style={{ fontFamily: "var(--font-hanken)", fontStyle: "italic" }} placeholder="Your full name" />
        </label>
        <label className="mt-3 flex cursor-pointer items-start gap-2.5 text-[.9rem]">
          <input type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} className="mt-0.5 h-5 w-5 flex-none accent-[#0a0a0b]" />
          <span>I have read and accept the order agreement and terms ({tncsVersion}).</span>
        </label>
        {error && <p className="mt-3 text-[.85rem] text-red-600">{error}</p>}
        <button type="submit" disabled={pending || !name.trim() || !accept} className="mt-4 inline-flex min-h-[48px] items-center rounded-[2px] bg-ink px-7 text-[.76rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black disabled:opacity-50">
          {pending ? "Signing…" : "Sign and accept"}
        </button>
      </form>
    </section>
  );
}
