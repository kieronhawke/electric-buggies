"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Arrow } from "@/components/ui/button";
import { Turnstile, turnstileEnabled } from "@/components/turnstile";
import { quoteSchema, type QuoteInput } from "@/lib/quote-schema";
import { decodeBuild, buildSpecLines, priceBuild, encodeBuild } from "@/lib/configurator";
import { sectors } from "@/lib/data/sectors";
import { gbp, cn } from "@/lib/utils";

const field =
  "w-full rounded-lg border border-line bg-white px-4 py-3 text-ink outline-none transition-colors placeholder:text-ink-2/60 focus:border-ink";
const label = "block text-[0.7rem] font-medium uppercase tracking-[0.14em] text-ink-2 mb-2";

export function QuoteForm() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [tsKey, setTsKey] = useState(0); // remount the widget after a failed submit
  const onVerify = useCallback((t: string) => setToken(t), []);
  // Attached configurator build (brief §6). Read from the URL on the client
  // AFTER mount, NOT useSearchParams, so the form renders server-side with no
  // Suspense boundary and can never get stuck on "Loading…".
  const [buildParam, setBuildParam] = useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { type: "personal", build: buildParam },
  });

  // After mount, read any attached build from the URL (?m=…) and prefill it.
  useEffect(() => {
    const search = window.location.search;
    if (search.includes("m=")) {
      const encoded = encodeBuild(decodeBuild(search));
      setBuildParam(encoded);
      setValue("build", encoded);
    }
  }, [setValue]);

  const type = watch("type");

  const onSubmit = async (values: QuoteInput) => {
    setServerError(null);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, turnstileToken: token }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong");
      setSent(true);
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Something went wrong");
      setToken("");
      setTsKey((k) => k + 1); // fresh challenge for the retry
    }
  };

  if (sent) {
    return (
      <div className="rounded-lg border border-hairline bg-white p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-champagne/10 text-champagne-deep">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
            <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="mt-6 font-display text-3xl text-ink">Thank you.</h2>
        <p className="mx-auto mt-3 max-w-md text-ink-soft">
          Your request has reached our team. We&rsquo;ll be in touch shortly with specification,
          indicative pricing and lead time. For anything urgent, call us directly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Honeypot, hidden from humans; bots that fill it are silently dropped. */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        {...register("website")}
      />
      {/* Personal / Business toggle (Land Rover style, brief §5) */}
      <div className="inline-flex rounded-full border border-hairline bg-white p-1">
        {(["personal", "business"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setValue("type", t)}
            className={cn(
              "rounded-full px-6 py-2 text-sm font-medium capitalize transition-colors",
              type === t ? "bg-ink text-paper" : "text-ink-soft hover:text-ink",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {buildParam && <AttachedBuild encoded={buildParam} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="name">Name</label>
          <input id="name" className={field} {...register("name")} />
          {errors.name && <p className="mt-1 text-sm text-red-700">{errors.name.message}</p>}
        </div>
        <div>
          <label className={label} htmlFor="email">Email</label>
          <input id="email" type="email" className={field} {...register("email")} />
          {errors.email && <p className="mt-1 text-sm text-red-700">{errors.email.message}</p>}
        </div>
        <div>
          <label className={label} htmlFor="phone">Phone (optional)</label>
          <input id="phone" className={field} {...register("phone")} />
        </div>
        <div>
          <label className={label} htmlFor="sector">Sector (optional)</label>
          <select id="sector" className={field} {...register("sector")} defaultValue="">
            <option value="" disabled>Select…</option>
            {sectors.map((s) => (
              <option key={s.slug} value={s.name}>{s.name}</option>
            ))}
            <option value="Private">Private land</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {type === "business" && (
          <>
            <div>
              <label className={label} htmlFor="company">Company</label>
              <input id="company" className={field} {...register("company")} />
              {errors.company && <p className="mt-1 text-sm text-red-700">{errors.company.message}</p>}
            </div>
            <div>
              <label className={label} htmlFor="fleetSize">Fleet size (optional)</label>
              <input id="fleetSize" className={field} {...register("fleetSize")} placeholder="e.g. 1–5, 6–20, 20+" />
            </div>
          </>
        )}
      </div>

      <div>
        <label className={label} htmlFor="message">Your requirement</label>
        <textarea id="message" rows={5} className={field} {...register("message")}
          placeholder="Tell us where the vehicle will work and what it must do." />
        {errors.message && <p className="mt-1 text-sm text-red-700">{errors.message.message}</p>}
      </div>

      {serverError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</p>
      )}

      <Turnstile key={tsKey} onVerify={onVerify} />

      <Button type="submit" size="lg" disabled={isSubmitting || (turnstileEnabled && !token)}>
        {isSubmitting ? "Sending…" : "Send request"} <Arrow />
      </Button>
      <p className="text-xs text-ink-soft">
        We&rsquo;ll only use your details to respond to this enquiry. See our{" "}
        <a href="/privacy" className="underline hover:text-ink">privacy notice</a>.
      </p>
    </form>
  );
}

function AttachedBuild({ encoded }: { encoded: string }) {
  const b = decodeBuild(encoded);
  const lines = buildSpecLines(b);
  const logo = typeof window !== "undefined" ? localStorage.getItem("eb-logo") : null;
  return (
    <div className="rounded-lg border border-line bg-paper p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow">Attached build · indicative {gbp(priceBuild(b))}</p>
        {b.logoZone && logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="Your uploaded logo" className="h-8 w-auto max-w-[80px] object-contain" />
        )}
      </div>
      <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
        {lines.map((l) => (
          <div key={l.label} className="flex justify-between gap-3 border-b border-line py-1.5">
            <dt className="text-ink-2">{l.label}</dt>
            <dd className="text-right text-ink">{l.value}</dd>
          </div>
        ))}
      </dl>
      {b.logoZone && <p className="mt-3 text-xs text-ink-2">Your logo will be applied at the <b>{b.logoZone}</b>. Final artwork is confirmed at quotation.</p>}
    </div>
  );
}
