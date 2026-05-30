"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { requestPasswordReset, resetPassword } from "@/lib/auth-client";
import { Field, FormBanner, SubmitButton } from "./ui";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await requestPasswordReset({ email: email.trim(), redirectTo: "/reset-password" });
    // Always show the same message (no account enumeration).
    setDone(true);
    setLoading(false);
  }

  if (done) {
    return (
      <FormBanner kind="success">
        If an account exists for <b>{email}</b>, a password reset link is on its way. The link expires in one hour.
      </FormBanner>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <Field label="Email" type="email" name="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <SubmitButton loading={loading}>Send reset link</SubmitButton>
    </form>
  );
}

export function ResetPasswordForm({ token }: { token?: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token) {
    return <FormBanner kind="error">This reset link is missing or invalid. Please request a new one.</FormBanner>;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 10) return setError("Please use a password of at least 10 characters.");
    if (password !== confirm) return setError("Those passwords do not match.");
    setLoading(true);
    const { error } = await resetPassword({ newPassword: password, token });
    if (error) {
      setError(error.message || "This link has expired. Please request a new one.");
      setLoading(false);
      return;
    }
    router.push("/login?reset=1");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      {error && <FormBanner kind="error">{error}</FormBanner>}
      <Field label="New password" type="password" name="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} hint="At least 10 characters." />
      <Field label="Confirm new password" type="password" name="confirm" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      <SubmitButton loading={loading}>Set new password</SubmitButton>
    </form>
  );
}
