import Link from "next/link";
import { requireRole } from "@/lib/session";
import { emailHeroUrl } from "@/lib/email-image";
import { SAMPLE_DATA } from "@/lib/emails/registry";
import { CUSTOM_EMAIL_SKELETON } from "@/lib/emails/blocks";
import { CustomEmailEditor } from "@/components/portal/custom-email-editor";

export const dynamic = "force-dynamic";

export default async function NewCustomEmail() {
  const user = await requireRole(["admin"]);
  return (
    <div>
      <Link href="/admin/communications" className="text-[.8rem] text-ink-2 hover:text-ink">← All emails</Link>
      <h1 className="mt-2 text-[clamp(1.4rem,3.5vw,1.85rem)] font-semibold tracking-[-0.02em]">Compose a custom email</h1>
      <p className="mt-1 text-[.85rem] text-ink-2">Build a one-off email from brand blocks and merge fields, then send a test.</p>
      <div className="mt-5">
        <CustomEmailEditor name="" subject="" preheader="" html={CUSTOM_EMAIL_SKELETON} heroUrl={emailHeroUrl(SAMPLE_DATA._modelSlug)} testTo={user.email} />
      </div>
    </div>
  );
}
