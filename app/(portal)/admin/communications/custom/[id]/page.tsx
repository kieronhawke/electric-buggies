import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/session";
import { getCustomEmail } from "@/lib/comms-data";
import { emailHeroUrl } from "@/lib/email-image";
import { SAMPLE_DATA } from "@/lib/emails/registry";
import { CustomEmailEditor } from "@/components/portal/custom-email-editor";

export const dynamic = "force-dynamic";

export default async function EditCustomEmail({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole(["admin"]);
  const { id } = await params;
  const row = await getCustomEmail(id);
  if (!row) notFound();
  return (
    <div>
      <Link href="/admin/communications" className="text-[.8rem] text-ink-2 hover:text-ink">← All emails</Link>
      <h1 className="mt-2 text-[clamp(1.4rem,3.5vw,1.85rem)] font-semibold tracking-[-0.02em]">{row.name}</h1>
      <p className="mt-1 text-[.85rem] text-ink-2">Custom email draft.</p>
      <div className="mt-5">
        <CustomEmailEditor id={row.id} name={row.name} subject={row.subject} preheader={row.preheader} html={row.html} heroUrl={emailHeroUrl(SAMPLE_DATA._modelSlug)} testTo={user.email} />
      </div>
    </div>
  );
}
