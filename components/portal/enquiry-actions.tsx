"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { markEnquiryHandled } from "@/lib/marketing-actions";

export function MarkHandled({ id }: { id: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button onClick={() => start(async () => { await markEnquiryHandled(id); router.refresh(); })} disabled={pending}
      className="rounded-[2px] border border-line-2 px-3 py-1.5 text-[.68rem] font-semibold uppercase tracking-[.06em] text-ink-2 transition-colors hover:border-ink hover:text-ink disabled:opacity-50">
      {pending ? "…" : "Mark handled"}
    </button>
  );
}
