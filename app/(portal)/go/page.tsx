import { redirect } from "next/navigation";
import { getCurrentUser, homeForRole, type Role } from "@/lib/session";

export const dynamic = "force-dynamic";

/** Post-login router: sends each role to its home (customer/admin/engineer). */
export default async function Go() {
  const user = await getCurrentUser();
  redirect(user ? homeForRole(user.role as Role) : "/login");
}
