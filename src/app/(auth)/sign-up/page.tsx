import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { dashboardPath } from "@/lib/constants";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Sign Up" };

export default async function SignUpPage() {
  const session = await getSession();
  if (session) redirect(dashboardPath((session.user as { role?: string }).role));
  return <SignUpForm />;
}
