import Link from "next/link";
import { AuthCard } from "@/components/portal/auth-card";
import { ForgotPasswordForm } from "@/components/portal/reset-forms";

export const dynamic = "force-dynamic";

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter your email and we will send you a link to set a new password."
      footer={<Link href="/login" className="font-semibold text-ink underline-offset-4 hover:underline">Back to sign in</Link>}
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
