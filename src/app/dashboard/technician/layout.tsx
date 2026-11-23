import { requireRole } from "@/lib/session";

export default async function TechnicianLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["technician"]);
  return <>{children}</>;
}
