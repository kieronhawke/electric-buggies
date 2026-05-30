"use client";

import { useActionState } from "react";
import { updateNotifications, type ActionState } from "@/lib/account-actions";
import { FormBanner, SubmitButton } from "./ui";

const CHANNELS = [
  { key: "notifyEmail", label: "Email", note: "Order updates and receipts" },
  { key: "notifySms", label: "SMS", note: "Time-sensitive alerts" },
  { key: "notifyWhatsapp", label: "WhatsApp", note: "Conversational updates" },
];

const EVENTS = [
  { key: "event_orderUpdates", label: "Order progress", note: "Each time your order advances a stage" },
  { key: "event_contract", label: "Contracts", note: "When a contract is ready to sign" },
  { key: "event_payment", label: "Payments", note: "Payment requests and confirmations" },
  { key: "event_service", label: "Service & maintenance", note: "Service request and visit updates" },
  { key: "event_marketing", label: "News & offers", note: "Occasional product news (optional)" },
];

export function NotificationsForm({ defaults }: { defaults: { notifyEmail: boolean; notifySms: boolean; notifyWhatsapp: boolean; events: Record<string, boolean> } }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(updateNotifications, null);
  const channelDefaults: Record<string, boolean> = {
    notifyEmail: defaults.notifyEmail,
    notifySms: defaults.notifySms,
    notifyWhatsapp: defaults.notifyWhatsapp,
  };
  return (
    <form action={action} className="flex flex-col gap-7">
      {state?.ok && <FormBanner kind="success">Your preferences have been saved.</FormBanner>}
      {state?.error && <FormBanner kind="error">{state.error}</FormBanner>}

      <fieldset>
        <legend className="text-[.74rem] font-semibold uppercase tracking-[.14em] text-ink-2">Channels</legend>
        <div className="mt-3 flex flex-col divide-y divide-line rounded-lg border border-line">
          {CHANNELS.map((c) => (
            <Toggle key={c.key} name={c.key} label={c.label} note={c.note} defaultChecked={Boolean(channelDefaults[c.key])} />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-[.74rem] font-semibold uppercase tracking-[.14em] text-ink-2">What to notify me about</legend>
        <div className="mt-3 flex flex-col divide-y divide-line rounded-lg border border-line">
          {EVENTS.map((e) => (
            <Toggle key={e.key} name={e.key} label={e.label} note={e.note} defaultChecked={Boolean(defaults.events[e.key.replace("event_", "")])} />
          ))}
        </div>
      </fieldset>

      <SubmitButton loading={pending} className="w-auto self-start px-8">Save preferences</SubmitButton>
    </form>
  );
}

function Toggle({ name, label, note, defaultChecked }: { name: string; label: string; note: string; defaultChecked?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 px-4 py-3.5">
      <span>
        <span className="block text-[.95rem] font-medium">{label}</span>
        <span className="block text-[.8rem] text-ink-2">{note}</span>
      </span>
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
      <span aria-hidden className="relative h-6 w-11 flex-none rounded-full bg-line-2 transition-colors peer-checked:bg-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" />
    </label>
  );
}
