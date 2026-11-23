import { DashboardShell } from "@/components/dashboard/shell";
import { requireRole } from "@/lib/session";
import type { Role } from "@/lib/constants";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole("any");
  const role = ((session.user as { role?: string }).role || "customer") as Role;
  return <DashboardShell role={role}>{children}</DashboardShell>;
}
