import type { Metadata } from "next";
import { cookies } from "next/headers";
import { createClient } from "@sanity/client";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminTable, type Lead } from "@/components/admin/admin-table";
import { adminToken } from "@/lib/admin";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

async function getLeads(): Promise<Lead[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!projectId || !token) return [];
  try {
    const client = createClient({ projectId, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production", token, apiVersion: "2024-10-01", useCdn: false });
    return await client.fetch('*[_type=="lead"]|order(coalesce(updatedAt,createdAt) desc)');
  } catch {
    return [];
  }
}

export default async function AdminPage() {
  const configured = !!process.env.ADMIN_PASSWORD;
  const authed = configured && (await cookies()).get("eb_admin")?.value === adminToken();
  if (!authed) return <AdminLogin configured={configured} />;
  return <AdminTable leads={await getLeads()} />;
}
