"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth-client";
import { Field, FormBanner, SubmitButton } from "./ui";

export function RegisterForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password.length < 10) return setError("Please use a password of at least 10 characters.");
    if (form.password !== form.confirm) return setError("Those passwords do not match.");
    setLoading(true);
    const { error } = await signUp.email({ name: form.name.trim(), email: form.email.trim(), password: form.password });
    if (error) {
      setError(/exist|already/i.test(error.message || "") ? "An account with that email already exists." : error.message || "We could not create your account.");
      setLoading(false);
      return;
    }
    setDone(true);
    setLoading(false);
  }

  if (done) {
    return (
      <FormBanner kind="success">
        <strong className="block">Check your inbox</strong>
        We have sent a confirmation link to <b>{form.email}</b>. Click it to activate your account, then sign in.
      </FormBanner>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      {error && <FormBanner kind="error">{error}</FormBanner>}
      <Field label="Full name" name="name" autoComplete="name" required value={form.name} onChange={set("name")} />
      <Field label="Email" type="email" name="email" autoComplete="email" required value={form.email} onChange={set("email")} />
      <Field label="Password" type="password" name="password" autoComplete="new-password" required value={form.password} onChange={set("password")} hint="At least 10 characters." />
      <Field label="Confirm password" type="password" name="confirm" autoComplete="new-password" required value={form.confirm} onChange={set("confirm")} />
      <SubmitButton loading={loading}>Create account</SubmitButton>
    </form>
  );
}
