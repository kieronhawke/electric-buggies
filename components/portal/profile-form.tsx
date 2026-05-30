"use client";

import { useActionState } from "react";
import { updateProfile, type ActionState } from "@/lib/account-actions";
import { Field, FormBanner, SubmitButton } from "./ui";

export function ProfileForm({ defaults }: { defaults: { name: string; email: string; phone: string; company: string } }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(updateProfile, null);
  return (
    <form action={action} className="flex flex-col gap-4">
      {state?.ok && <FormBanner kind="success">Your details have been saved.</FormBanner>}
      {state?.error && <FormBanner kind="error">{state.error}</FormBanner>}
      <Field label="Full name" name="name" autoComplete="name" required defaultValue={defaults.name} />
      <Field label="Email" type="email" value={defaults.email} disabled hint="To change your email, contact the team." />
      <Field label="Phone" name="phone" autoComplete="tel" defaultValue={defaults.phone} />
      <Field label="Company" name="company" autoComplete="organization" defaultValue={defaults.company} />
      <SubmitButton loading={pending}>Save changes</SubmitButton>
    </form>
  );
}
