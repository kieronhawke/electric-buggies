"use client";

import { useCallback, useState } from "react";
import { Turnstile, turnstileEnabled } from "@/components/turnstile";

/** Footer newsletter / lead-capture. Posts to /api/newsletter → Zapier. */
export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState(""); // honeypot
  const [token, setToken] = useState("");
  const [tsKey, setTsKey] = useState(0);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const onVerify = useCallback((t: string) => setToken(t), []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website: hp, turnstileToken: token }),
      });
      const json = await res.json();
      if (res.ok && json.ok) { setState("done"); return; }
      setState("error");
      setToken(""); setTsKey((k) => k + 1);
    } catch {
      setState("error");
      setToken(""); setTsKey((k) => k + 1);
    }
  };

  if (state === "done") {
    return <p className="text-[.92rem] font-light text-white/80">Thank you, you&rsquo;re on the list.</p>;
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2.5">
      <label htmlFor="nl-email" className="text-[.92rem] font-light text-white/70">
        Occasional updates on new models &amp; insight.
      </label>
      <input
        type="text" tabIndex={-1} autoComplete="off" aria-hidden="true"
        value={hp} onChange={(e) => setHp(e.target.value)}
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />
      <div className="flex gap-2">
        <input
          id="nl-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="min-w-0 flex-1 rounded-[2px] border border-white/20 bg-white/5 px-3 py-2.5 text-[.9rem] text-white placeholder:text-white/40 outline-none focus:border-white/60"
        />
        <button
          type="submit"
          disabled={state === "sending" || (turnstileEnabled && !token)}
          className="flex-none rounded-[2px] bg-white px-4 py-2.5 text-[.7rem] font-semibold uppercase tracking-[.08em] text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {state === "sending" ? "…" : "Join"}
        </button>
      </div>
      <Turnstile key={tsKey} onVerify={onVerify} />
      {state === "error" && <p className="text-[.8rem] text-red-300">Something went wrong, please try again.</p>}
    </form>
  );
}
