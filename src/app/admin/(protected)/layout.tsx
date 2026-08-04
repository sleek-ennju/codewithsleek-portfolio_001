import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/server/permissions/require-admin";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return <AdminShell adminName={session.user.name ?? session.user.email ?? "Administrator"}>{children}</AdminShell>;
}
