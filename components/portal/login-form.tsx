"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, authClient } from "@/lib/auth-client";
import { Field, FormBanner, SubmitButton } from "./ui";

export function LoginForm({ next, notice: initialNotice }: { next?: string; notice?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(initialNotice || "");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");
    const { error } = await signIn.email({ email, password });
    if (error) {
      const msg = error.message || "We could not sign you in.";
      // better-auth blocks unverified accounts; offer a resend.
      if (error.status === 403 || /verif/i.test(msg)) {
        setError("Please confirm your email first. We have re-sent your confirmation link.");
        try { await authClient.sendVerificationEmail({ email, callbackURL: next || "/account" }); } catch {}
      } else {
        setError(/invalid|password|credential/i.test(msg) ? "Incorrect email or password." : msg);
      }
      setLoading(false);
      return;
    }
    router.push(next || "/go");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      {error && <FormBanner kind="error">{error}</FormBanner>}
      {notice && <FormBanner kind="success">{notice}</FormBanner>}
      <Field label="Email" type="email" name="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <Field label="Password" type="password" name="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      <div className="-mt-1 text-right">
        <Link href="/forgot-password" className="text-[.82rem] font-medium text-ink-2 underline-offset-4 hover:text-ink hover:underline">Forgot password?</Link>
      </div>
      <SubmitButton loading={loading}>Sign in</SubmitButton>
    </form>
  );
}
