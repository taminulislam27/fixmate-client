import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { dashboardPath, type Role } from "./constants";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** For server layouts: logged-out -> /sign-in, wrong role -> own dashboard. */
export async function requireRole(allowed: Role[] | "any") {
  const session = await getSession();
  if (!session) redirect("/sign-in");
  const role = ((session.user as { role?: string }).role || "customer") as Role;
  if (allowed !== "any" && !allowed.includes(role)) redirect(dashboardPath(role));
  return session;
}
