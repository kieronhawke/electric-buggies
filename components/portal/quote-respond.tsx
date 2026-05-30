"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { respondQuote } from "@/lib/quote-actions";

export function QuoteRespond({ token }: { token: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  function respond(accept: boolean) {
    setError("");
    start(async () => {
      const r = await respondQuote(token, accept);
      if (r?.ok) router.refresh();
      else setError(r?.error || "Could not record your response.");
    });
  }
  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <button onClick={() => respond(true)} disabled={pending} className="inline-flex min-h-[48px] items-center rounded-[2px] bg-ink px-7 text-[.76rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black disabled:opacity-50">Accept quote</button>
        <button onClick={() => respond(false)} disabled={pending} className="inline-flex min-h-[48px] items-center rounded-[2px] border border-ink px-7 text-[.76rem] font-semibold uppercase tracking-[.06em] hover:bg-ink hover:text-white disabled:opacity-50">Decline</button>
      </div>
      {error && <p className="mt-2 text-[.84rem] text-red-600">{error}</p>}
    </div>
  );
}
