import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/portal/auth-card";
import { RegisterForm } from "@/components/portal/register-form";
import { getCurrentUser, homeForRole } from "@/lib/session";
import type { Role } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect(homeForRole(user.role as Role));

  return (
    <AuthCard
      title="Create your account"
      subtitle="Track orders, manage your fleet and request quotes in one place."
      footer={<>Already have an account? <Link href="/login" className="font-semibold text-ink underline-offset-4 hover:underline">Sign in</Link></>}
    >
      <RegisterForm />
    </AuthCard>
  );
}
