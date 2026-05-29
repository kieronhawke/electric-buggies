"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Autocomplete, PhoneInput } from "./fields";
import { cn } from "@/lib/utils";

export type Flow = "quote" | "hire" | "airport";
interface ModelLite { slug: string; name: string; categoryLabel: string; image: string | null }

const STEPS: Record<Flow, string[]> = {
  quote: ["details", "vehicles", "quantity", "branding", "timeframe", "business", "delivery", "review"],
  hire: ["details", "vehicles", "quantity", "hire-dates", "drivers", "event", "business", "delivery", "review"],
  airport: ["vehicles", "quantity", "location", "contact", "review"],
};
const TITLES: Record<string, string> = {
  details: "Your details", vehicles: "Which vehicles interest you?", quantity: "How many?",
  branding: "Custom design or branding?", timeframe: "When do you need them?",
  "hire-dates": "Hire dates", drivers: "Drivers", event: "Event type",
  business: "Personal or business?", delivery: "Delivery & contact", location: "Delivery location",
  contact: "Your details", review: "Review & submit",
};

const field = "w-full rounded-lg border border-line bg-white px-4 py-3 text-ink outline-none transition-colors placeholder:text-ink-2/60 focus:border-ink";
const labelCls = "mb-2 block text-[0.7rem] font-medium uppercase tracking-[0.14em] text-ink-2";
const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export function LeadWizard({ flow, models }: { flow: Flow; models: ModelLite[] }) {
  const steps = STEPS[flow];
  const [i, setI] = useState(0);
  const [done, setDone] = useState(false);
  const saved = useRef(false);

  const [s, setS] = useState({
    firstName: "", lastName: "", email: "", company: "", companyNumber: "",
    models: [] as string[], quantity: "", branding: "", brandingNotes: "",
    timeframe: "", hireFrom: "", hireTo: "", drivers: "", eventType: "",
    type: "personal", dial: "+44", phone: "", address: "", country: "GB",
    organisation: "", message: "", build: "",
  });
  const set = (patch: Partial<typeof s>) => setS((v) => ({ ...v, ...patch }));

  // Pre-fill an attached configurator build (?m=…).
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("m=")) {
      set({ build: window.location.search.replace(/^\?/, "") });
    }
  }, []);

  const payload = useMemo(() => ({
    firstName: s.firstName, lastName: s.lastName, phone: s.phone ? `${s.dial} ${s.phone}` : "",
    type: s.type, company: s.company, companyNumber: s.companyNumber,
    models: s.models.map((slug) => models.find((m) => m.slug === slug)?.name ?? slug),
    quantity: s.quantity, branding: [s.branding, s.brandingNotes].filter(Boolean).join(": "),
    timeframe: s.timeframe, hireFrom: s.hireFrom, hireTo: s.hireTo, drivers: s.drivers,
    eventType: s.eventType, address: s.address, country: s.country,
    message: [s.organisation && `Organisation: ${s.organisation}`, s.message].filter(Boolean).join(" — ".replace(" — ", ". ")),
    build: s.build,
  }), [s, models]);

  const save = async (action: "save" | "submit") => {
    if (!emailOk(s.email)) return;
    try {
      await fetch("/api/lead", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: s.email, flow, action, data: payload }),
      });
    } catch { /* non-blocking */ }
  };

  // Capture the moment a valid email exists (abandoned-lead).
  useEffect(() => {
    if (emailOk(s.email) && !saved.current) { saved.current = true; save("save"); }
  }, [s.email]); // eslint-disable-line react-hooks/exhaustive-deps

  const step = steps[i];
  const last = i === steps.length - 1;
  const next = async () => { await save("save"); setI((x) => Math.min(steps.length - 1, x + 1)); };
  const back = () => setI((x) => Math.max(0, x - 1));
  const submit = async () => { await save("submit"); setDone(true); };

  // Per-step "can continue" guard (light-touch).
  const blocked = (step === "details" && (!s.firstName || !emailOk(s.email)))
    || (step === "contact" && (!s.firstName || !emailOk(s.email)))
    || (step === "vehicles" && s.models.length === 0);

  if (done) {
    return (
      <div className="rounded-lg border border-line bg-white p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none"><path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <h2 className="mt-6 text-3xl">Thank you, {s.firstName || "there"}.</h2>
        <p className="mx-auto mt-3 max-w-md text-ink-2">Your enquiry is with our team and we will be in touch shortly with specification, pricing and lead time. For anything urgent, call us.</p>
      </div>
    );
  }

  return (
    <div>
      {/* progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-[.7rem] font-semibold uppercase tracking-[.14em] text-ink-2">
          <span>Step {i + 1} of {steps.length}</span><span>{TITLES[step]}</span>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-line">
          <div className="h-full bg-ink transition-all duration-300" style={{ width: `${((i + 1) / steps.length) * 100}%` }} />
        </div>
      </div>

      <div className="min-h-[18rem]">
        <h2 className="mb-6 text-2xl">{TITLES[step]}</h2>

        {(step === "details" || step === "contact") && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className={labelCls}>First name</label><input className={field} value={s.firstName} onChange={(e) => set({ firstName: e.target.value })} /></div>
            <div><label className={labelCls}>Last name</label><input className={field} value={s.lastName} onChange={(e) => set({ lastName: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className={labelCls}>Email</label><input type="email" className={field} value={s.email} onChange={(e) => set({ email: e.target.value })} />{s.email && !emailOk(s.email) && <p className="mt-1 text-sm text-red-700">Please enter a valid email.</p>}</div>
            {step === "contact" && <>
              <div><label className={labelCls}>Organisation</label><input className={field} value={s.organisation} onChange={(e) => set({ organisation: e.target.value })} /></div>
              <div><PhoneInput dial={s.dial} number={s.phone} onDial={(d) => set({ dial: d })} onNumber={(n) => set({ phone: n })} /></div>
            </>}
            <p className="sm:col-span-2 text-xs text-ink-2">We only use your details to respond to this enquiry. See our <a href="/privacy" className="underline">privacy notice</a>.</p>
          </div>
        )}

        {step === "vehicles" && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {models.map((m) => {
              const on = s.models.includes(m.slug);
              return (
                <button key={m.slug} type="button" onClick={() => set({ models: on ? s.models.filter((x) => x !== m.slug) : [...s.models, m.slug] })}
                  className={cn("overflow-hidden rounded-lg border bg-white text-left transition-all", on ? "border-ink shadow-[0_0_0_1px_var(--color-ink)]" : "border-line hover:border-line-2")}>
                  <span className="relative block aspect-[16/11]">
                    {m.image && <Image src={m.image} alt={m.name} fill sizes="33vw" className="object-contain p-3" />}
                    {on && <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-ink text-white"><svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none"><path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.5" /></svg></span>}
                  </span>
                  <span className="block px-3 pb-3"><span className="block text-sm font-semibold">{m.name}</span><span className="text-[.72rem] text-ink-2">{m.categoryLabel}</span></span>
                </button>
              );
            })}
          </div>
        )}

        {step === "quantity" && (
          <div className="flex flex-wrap gap-2">
            {["1", "2–5", "6–20", "20+"].map((q) => (
              <button key={q} type="button" onClick={() => set({ quantity: q })} className={cn("rounded-full border px-6 py-3 text-sm font-semibold", s.quantity === q ? "border-ink bg-ink text-white" : "border-line-2 hover:border-ink")}>{q}</button>
            ))}
          </div>
        )}

        {step === "branding" && (
          <div>
            <div className="flex gap-2">
              {["No", "Yes"].map((b) => <button key={b} type="button" onClick={() => set({ branding: b })} className={cn("rounded-full border px-6 py-3 text-sm font-semibold", s.branding === b ? "border-ink bg-ink text-white" : "border-line-2 hover:border-ink")}>{b}</button>)}
            </div>
            {s.branding === "Yes" && <div className="mt-4"><label className={labelCls}>What would you like? (logos, colours, roof, wheels, interior, seating, accessories)</label><textarea rows={4} className={field} value={s.brandingNotes} onChange={(e) => set({ brandingNotes: e.target.value })} /></div>}
          </div>
        )}

        {step === "timeframe" && (
          <div className="flex flex-wrap gap-2">
            {["As soon as possible", "1–3 months", "3–6 months", "Just exploring"].map((q) => (
              <button key={q} type="button" onClick={() => set({ timeframe: q })} className={cn("rounded-full border px-5 py-3 text-sm font-semibold", s.timeframe === q ? "border-ink bg-ink text-white" : "border-line-2 hover:border-ink")}>{q}</button>
            ))}
          </div>
        )}

        {step === "hire-dates" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className={labelCls}>From</label><input type="date" className={field} value={s.hireFrom} onChange={(e) => set({ hireFrom: e.target.value })} /></div>
            <div><label className={labelCls}>To</label><input type="date" className={field} value={s.hireTo} onChange={(e) => set({ hireTo: e.target.value })} /></div>
          </div>
        )}

        {step === "drivers" && (
          <div className="flex flex-wrap gap-2">
            {["We provide drivers", "We provide our own drivers"].map((d) => <button key={d} type="button" onClick={() => set({ drivers: d })} className={cn("rounded-full border px-5 py-3 text-sm font-semibold", s.drivers === d ? "border-ink bg-ink text-white" : "border-line-2 hover:border-ink")}>{d}</button>)}
          </div>
        )}

        {step === "event" && (
          <div className="flex flex-wrap gap-2">
            {["Wedding", "Festival", "Corporate", "Film / TV", "Sporting event", "Other"].map((e) => <button key={e} type="button" onClick={() => set({ eventType: e })} className={cn("rounded-full border px-5 py-3 text-sm font-semibold", s.eventType === e ? "border-ink bg-ink text-white" : "border-line-2 hover:border-ink")}>{e}</button>)}
          </div>
        )}

        {step === "business" && (
          <div>
            <div className="flex gap-2">
              {["personal", "business"].map((t) => <button key={t} type="button" onClick={() => set({ type: t })} className={cn("rounded-full border px-6 py-3 text-sm font-semibold capitalize", s.type === t ? "border-ink bg-ink text-white" : "border-line-2 hover:border-ink")}>{t}</button>)}
            </div>
            {s.type === "business" && (
              <div className="mt-4">
                <Autocomplete id="company" label="Business name (UK register search)" value={s.company} placeholder="Start typing your company name"
                  onChange={(v) => set({ company: v })}
                  onPick={(it: { label: string; number?: string }) => set({ company: it.label, companyNumber: it.number ?? "" })}
                  fetcher={async (q) => {
                    const r = await fetch(`/api/companies?q=${encodeURIComponent(q)}`).then((x) => x.json());
                    return (r.items ?? []).map((c: { name: string; number: string; address: string }) => ({ label: c.name, number: c.number, address: c.address }));
                  }} />
                <p className="mt-1 text-xs text-ink-2">Not registered? Just type your business name.</p>
              </div>
            )}
          </div>
        )}

        {(step === "delivery" || step === "location") && (
          <div className="grid gap-4">
            <Autocomplete id="address" label="Delivery address" value={s.address} placeholder="Start typing an address (UK or international)"
              onChange={(v) => set({ address: v })}
              onPick={async (it: { label: string; id?: string }) => {
                set({ address: it.label });
                if (it.id) { try { const d = await fetch(`/api/places?placeId=${it.id}`).then((x) => x.json()); if (d.countryCode) set({ country: d.countryCode, address: d.address || it.label }); } catch { /* keep */ } }
              }}
              fetcher={async (q) => {
                const r = await fetch(`/api/places?q=${encodeURIComponent(q)}`).then((x) => x.json());
                return (r.items ?? []).map((p: { id: string; label: string }) => ({ label: p.label, id: p.id }));
              }} />
            {step === "delivery" && <PhoneInput dial={s.dial} number={s.phone} onDial={(d) => set({ dial: d })} onNumber={(n) => set({ phone: n })} />}
            <div><label className={labelCls}>Notes (optional)</label><textarea rows={3} className={field} value={s.message} onChange={(e) => set({ message: e.target.value })} /></div>
          </div>
        )}

        {step === "review" && (
          <div className="rounded-lg border border-line bg-paper p-6">
            <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              {Object.entries({
                Name: `${s.firstName} ${s.lastName}`.trim(), Email: s.email,
                Phone: s.phone ? `${s.dial} ${s.phone}` : "", Type: s.type,
                Company: s.company, Vehicles: payload.models.join(", "), Quantity: s.quantity,
                Branding: payload.branding, Timeframe: s.timeframe,
                Dates: [s.hireFrom, s.hireTo].filter(Boolean).join(" to "), Drivers: s.drivers,
                Event: s.eventType, Organisation: s.organisation, Address: s.address, Notes: s.message,
              }).filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 border-b border-line py-1.5"><dt className="text-ink-2">{k}</dt><dd className="text-right font-medium">{v}</dd></div>
              ))}
            </dl>
            {s.build && <p className="mt-3 text-xs text-ink-2">Attached configurator build included.</p>}
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-5">
        <button onClick={back} disabled={i === 0} className="rounded-[3px] border border-line-2 px-6 py-3 text-[.74rem] font-semibold uppercase tracking-[.06em] disabled:opacity-40 hover:border-ink">Back</button>
        {last
          ? <button onClick={submit} disabled={!emailOk(s.email)} className="rounded-[3px] bg-ink px-8 py-3 text-[.74rem] font-semibold uppercase tracking-[.06em] text-white disabled:opacity-40">Submit enquiry</button>
          : <button onClick={next} disabled={blocked} className="rounded-[3px] bg-ink px-8 py-3 text-[.74rem] font-semibold uppercase tracking-[.06em] text-white disabled:opacity-40">Continue</button>}
      </div>
    </div>
  );
}
