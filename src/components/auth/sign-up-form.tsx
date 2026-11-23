"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, UserRound, Wrench } from "lucide-react";
import { toast } from "sonner";
import { signUp } from "@/lib/auth-client";
import { dashboardPath } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Errors = Partial<Record<"name" | "email" | "password", string>>;

const ROLES = [
  { value: "customer", title: "Customer", text: "I need something repaired", icon: UserRound },
  { value: "technician", title: "Technician", text: "I offer repair services", icon: Wrench },
] as const;

export function SignUpForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [role, setRole] = useState<"customer" | "technician">("customer");
  const [errors, setErrors] = useState<Errors>({});
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  function validate(): Errors {
    const e: Errors = {};
    if (form.name.trim().length < 2) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";
    const p = form.password;
    if (!p) e.password = "Password is required";
    else if (p.length < 6) e.password = "Password must be at least 6 characters";
    else if (!/[A-Z]/.test(p)) e.password = "Include at least one uppercase letter";
    else if (!/[a-z]/.test(p)) e.password = "Include at least one lowercase letter";
    return e;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    const { error } = await signUp.email({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      role, // the server hook still forces anything except technician back to customer
    } as Parameters<typeof signUp.email>[0]);
    setLoading(false);

    if (error) {
      toast.error(error.message || "Could not create your account");
      return;
    }
    toast.success("Account created! Welcome to FixMate.");
    router.replace(dashboardPath(role));
    router.refresh();
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold">Create your account</h1>
      <p className="mt-2 text-muted-foreground">Join FixMate as a customer or a technician.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">I am a</legend>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((r) => (
              <label
                key={r.value}
                className={cn(
                  "flex cursor-pointer flex-col gap-1 rounded-xl border-2 p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                  role === r.value ? "border-accent bg-accent/10" : "border-input hover:bg-muted"
                )}
              >
                <input
                  type="radio"
                  name="role"
                  value={r.value}
                  checked={role === r.value}
                  onChange={() => setRole(r.value)}
                  className="sr-only"
                />
                <r.icon className={cn("h-5 w-5", role === r.value ? "text-accent" : "text-muted-foreground")} />
                <span className="font-display font-bold">{r.title}</span>
                <span className="text-xs text-muted-foreground">{r.text}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <Field label="Full name" htmlFor="su-name" error={errors.name}>
          <Input id="su-name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
        </Field>
        <Field label="Email" htmlFor="su-email" error={errors.email}>
          <Input id="su-email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
        </Field>
        <Field label="Password" htmlFor="su-pass" error={errors.password} hint="6+ characters with an uppercase and a lowercase letter">
          <div className="relative">
            <Input
              id="su-pass"
              type={show ? "text" : "password"}
              autoComplete="new-password"
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
          {loading && <Loader2 className="animate-spin" />} Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-semibold text-primary hover:underline dark:text-accent">
          Sign in
        </Link>
      </p>
    </div>
  );
}
