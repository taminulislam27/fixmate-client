import { Suspense } from "react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { SignInForm } from "@/components/auth/sign-in-form";
import { dashboardPath } from "@/lib/constants";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Sign In" };

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ redirect?: string }> }) {
  const sp = await searchParams;
  const session = await getSession();
  if (session) {
    const to = sp.redirect && sp.redirect.startsWith("/") && !sp.redirect.startsWith("//") ? sp.redirect : null;
    redirect(to || dashboardPath((session.user as { role?: string }).role));
  }
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}
