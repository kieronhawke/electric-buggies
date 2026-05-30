"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { advanceStage } from "@/lib/admin-actions";
import { cn } from "@/lib/utils";

type Channel = "email" | "sms" | "whatsapp";

export function StageAdvance({
  orderId, fromLabel, toStage, toLabel, buttonLabel, notification, eligibleChannels,
}: {
  orderId: string;
  fromLabel: string;
  toStage: string;
  toLabel: string;
  buttonLabel: string;
  notification: { subject: string; message: string } | null;
  eligibleChannels: Channel[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notify, setNotify] = useState(true);
  const [channels, setChannels] = useState<Channel[]>(eligibleChannels);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  const toggle = (c: Channel) => setChannels((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));
  const willNotify = notify && notification && channels.length > 0;

  function confirm() {
    setError("");
    start(async () => {
      const r = await advanceStage(orderId, toStage as never, !!willNotify, willNotify ? channels : []);
      if (r?.ok) { setOpen(false); router.refresh(); }
      else setError(r?.error || "Could not update.");
    });
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="inline-flex min-h-[44px] items-center rounded-[2px] bg-ink px-5 text-[.74rem] font-semibold uppercase tracking-[.06em] text-white transition-colors hover:bg-black">
        {buttonLabel}
      </button>

      {open && (
        <div className="fixed inset-0 z-[130] flex items-end justify-center bg-black/40 p-4 sm:items-center" role="dialog" aria-modal="true">
          <div className="w-full max-w-[440px] rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold">Confirm stage change</h3>
            <p className="mt-2 text-[.92rem] text-ink-2">
              Move this order from <b className="text-ink">{fromLabel}</b> to <b className="text-ink">{toLabel}</b>.
            </p>

            {notification ? (
              <div className="mt-4 rounded-lg border border-line bg-paper p-4">
                <label className="flex cursor-pointer items-center justify-between gap-3">
                  <span className="text-[.9rem] font-medium">Notify the customer</span>
                  <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} className="h-5 w-5 accent-[#0a0a0b]" />
                </label>
                {notify && (
                  <>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(["email", "sms", "whatsapp"] as Channel[]).map((c) => {
                        const eligible = eligibleChannels.includes(c);
                        return (
                          <button key={c} type="button" disabled={!eligible} onClick={() => toggle(c)} title={eligible ? "" : "Customer has not enabled this channel"}
                            className={cn("rounded-full border px-3 py-1.5 text-[.72rem] font-semibold uppercase tracking-[.06em] transition-colors", !eligible ? "cursor-not-allowed border-line text-ink-2/40" : channels.includes(c) ? "border-ink bg-ink text-white" : "border-line-2 text-ink-2 hover:border-ink")}>
                            {c}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-3 rounded-[4px] border border-line bg-white p-3 text-[.82rem]">
                      <div className="font-semibold">{notification.subject}</div>
                      <div className="mt-1 text-ink-2">{notification.message}</div>
                    </div>
                    {channels.length === 0 && <p className="mt-2 text-[.78rem] text-amber-700">No channel selected, nothing will be sent.</p>}
                  </>
                )}
              </div>
            ) : (
              <p className="mt-4 rounded-lg border border-line bg-paper p-4 text-[.85rem] text-ink-2">No customer notification is configured for this stage.</p>
            )}

            <p className="mt-3 text-[.78rem] text-ink-2">
              {willNotify ? `Will notify by ${channels.join(", ")}.` : "No notification will be sent."}
            </p>
            {error && <p className="mt-2 text-[.82rem] text-red-600">{error}</p>}

            <div className="mt-5 flex gap-2.5">
              <button onClick={() => setOpen(false)} disabled={pending} className="flex-1 rounded-[2px] border border-line-2 py-2.5 text-[.74rem] font-semibold uppercase tracking-[.06em] hover:border-ink disabled:opacity-60">Cancel</button>
              <button onClick={confirm} disabled={pending} className="flex-1 rounded-[2px] bg-ink py-2.5 text-[.74rem] font-semibold uppercase tracking-[.06em] text-white hover:bg-black disabled:opacity-60">{pending ? "Saving…" : "Confirm"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
