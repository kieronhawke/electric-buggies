import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/portal/auth-card";
import { LoginForm } from "@/components/portal/login-form";
import { getCurrentUser, homeForRole } from "@/lib/session";
import type { Role } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; reset?: string; verified?: string }> }) {
  const { next, reset, verified } = await searchParams;
  const user = await getCurrentUser();
  if (user) redirect(next || homeForRole(user.role as Role));

  const notice = reset ? "Your password has been updated. Please sign in." : verified ? "Email confirmed. You can sign in now." : undefined;

  return (
    <AuthCard
      title="Sign in"
      subtitle="Access your orders, fleet and quotes."
      footer={<>New to Electric Buggies? <Link href="/register" className="font-semibold text-ink underline-offset-4 hover:underline">Create an account</Link></>}
    >
      <LoginForm next={next} notice={notice} />
    </AuthCard>
  );
}
