import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/session";
import { getEditableTemplate, getVersions } from "@/lib/comms-data";
import { emailHeroUrl } from "@/lib/email-image";
import { SAMPLE_DATA } from "@/lib/emails/registry";
import { CommsEditor } from "@/components/portal/comms-editor";

export const dynamic = "force-dynamic";

export default async function EditTemplate({ params }: { params: Promise<{ key: string }> }) {
  const user = await requireRole(["admin"]);
  const { key } = await params;
  const [tpl, versions] = await Promise.all([getEditableTemplate(key), getVersions(key)]);
  if (!tpl) notFound();

  return (
    <div>
      <Link href="/admin/communications" className="text-[.8rem] text-ink-2 hover:text-ink">← All emails</Link>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[clamp(1.4rem,3.5vw,1.85rem)] font-semibold tracking-[-0.02em]">{tpl.name}</h1>
          <p className="mt-1 text-[.85rem] text-ink-2">{tpl.purpose} · Sends when: {tpl.trigger}</p>
        </div>
      </div>

      <div className="mt-5">
        <CommsEditor
          templateKey={tpl.key}
          name={tpl.name}
          purpose={tpl.purpose}
          trigger={tpl.trigger}
          subject={tpl.subject}
          preheader={tpl.preheader}
          html={tpl.html}
          customised={tpl.customised}
          heroUrl={emailHeroUrl(SAMPLE_DATA._modelSlug)}
          modelName={SAMPLE_DATA.model}
          testTo={user.email}
          versions={versions.map((v) => ({ id: v.id, subject: v.subject, editedByName: v.editedByName, createdAt: v.createdAt.toISOString() }))}
        />
      </div>
    </div>
  );
}
