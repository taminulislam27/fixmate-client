import { redirect } from "next/navigation";
import { dashboardPath } from "@/lib/constants";
import { requireRole } from "@/lib/session";


export default async function DashboardIndex() {
  const session = await requireRole("any");
  redirect(dashboardPath((session.user as { role?: string }).role));
}
