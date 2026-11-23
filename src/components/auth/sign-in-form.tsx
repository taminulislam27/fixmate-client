"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient, signIn } from "@/lib/auth-client";
import { dashboardPath } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/label";

const DEMO = [
  { label: "Customer", email: "customer@fixmate.dev", password: "Demo1234" },
  { label: "Technician", email: "tech1@fixmate.dev", password: "Demo1234" },
];

export function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e: typeof errors = {};
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    const { error } = await signIn.email({ email: form.email.trim().toLowerCase(), password: form.password });
    if (error) {
      setLoading(false);
      toast.error(error.message || "Invalid email or password");
      return;
    }

    // go back to where the user was heading, otherwise to their own dashboard
    const wanted = params.get("redirect");
    const safe = wanted && wanted.startsWith("/") && !wanted.startsWith("//") ? wanted : null;
    const session = await authClient.getSession();
    const role = (session.data?.user as { role?: string } | undefined)?.role;
    toast.success("Signed in successfully");
    router.replace(safe || dashboardPath(role));
    router.refresh();
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold">Welcome back</h1>
      <p className="mt-2 text-muted-foreground">Sign in to track your repairs and manage your jobs.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
        <Field label="Email" htmlFor="si-email" error={errors.email}>
          <Input id="si-email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
        </Field>
        <Field label="Password" htmlFor="si-pass" error={errors.password}>
          <div className="relative">
            <Input
              id="si-pass"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />} Sign in
        </Button>
      </form>

      <div className="mt-6 rounded-xl border border-dashed p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quick test accounts</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {DEMO.map((d) => (
            <Button key={d.label} type="button" size="sm" variant="secondary" onClick={() => setForm({ email: d.email, password: d.password })}>
              Fill {d.label}
            </Button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to FixMate?{" "}
        <Link href="/sign-up" className="font-semibold text-primary hover:underline dark:text-accent">
          Create an account
        </Link>
      </p>
    </div>
  );
}
