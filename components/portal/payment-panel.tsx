"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { markPaymentSent } from "@/lib/customer-actions";

type Bank = { accountName: string; bank: string; sortCode: string; accountNumber: string; iban: string; swift: string };

export function PaymentPanel({
  orderId, reference, amount, status, bank,
}: { orderId: string; reference: string; amount: string; status: "pending" | "sent" | "received"; bank: Bank }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function markSent() {
    start(async () => {
      const r = await markPaymentSent(orderId);
      if (r?.ok) router.refresh();
    });
  }

  if (status === "received") return null;

  const rows = [
    ["Account name", bank.accountName],
    ["Bank", bank.bank],
    ["Sort code", bank.sortCode],
    ["Account number", bank.accountNumber],
    ...(bank.iban ? [["IBAN", bank.iban] as [string, string]] : []),
    ...(bank.swift ? [["SWIFT/BIC", bank.swift] as [string, string]] : []),
    ["Payment reference", reference],
    ["Amount", amount],
  ];

  return (
    <section className="rounded-lg border border-ink bg-white p-6 shadow-[0_24px_44px_-34px_rgba(0,0,0,0.4)] sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Complete your payment</h2>
        <button onClick={() => window.print()} className="rounded-[2px] border border-line-2 px-4 py-2 text-[.72rem] font-semibold uppercase tracking-[.06em] hover:border-ink">Download invoice</button>
      </div>
      <p className="mt-2 text-[.92rem] text-ink-2">Transfer the balance by bank transfer using the reference below, then mark it as sent. Our finance team will confirm receipt.</p>

      <dl className="mt-5 overflow-hidden rounded-lg border border-line">
        {rows.map(([k, v], i) => (
          <div key={k} className={`flex items-center justify-between gap-4 px-4 py-3 text-[.92rem] ${i % 2 ? "bg-white" : "bg-paper"}`}>
            <dt className="text-ink-2">{k}</dt>
            <dd className="text-right font-semibold tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-3 rounded-[4px] border border-amber-200 bg-amber-50 px-4 py-3 text-[.84rem] text-amber-800">
        Please include the payment reference <b>{reference}</b> so we can match your transfer.
      </p>

      {status === "sent" ? (
        <p className="mt-5 rounded-[4px] border border-line bg-paper px-4 py-3 text-[.9rem] font-medium">Payment marked as sent. Awaiting confirmation from our finance team.</p>
      ) : (
        <button onClick={markSent} disabled={pending} className="mt-5 inline-flex min-h-[48px] items-center rounded-[2px] bg-ink px-7 text-[.76rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black disabled:opacity-50">
          {pending ? "Saving…" : "I have sent the payment"}
        </button>
      )}
    </section>
  );
}
