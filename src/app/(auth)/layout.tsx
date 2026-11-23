import Link from "next/link";
import { BadgeCheck, CreditCard, Timer } from "lucide-react";
import { Logo } from "@/components/shared/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.05fr]">
      <div className="flex flex-col px-5 py-8 sm:px-10">
        <Logo />
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">{children}</div>
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to home
        </Link>
      </div>

      <aside className="relative hidden overflow-hidden bg-ink text-white lg:flex lg:flex-col lg:justify-center lg:px-16">
        <div className="dot-grid absolute inset-0" aria-hidden />
        <div className="relative max-w-md">
          <p className="eyebrow">Pay after service</p>
          <h2 className="mt-3 font-display text-4xl font-extrabold leading-tight">
            Every repair, tracked from request to receipt.
          </h2>
          <ul className="mt-10 space-y-6">
            {[
              { icon: BadgeCheck, t: "Verified technicians", d: "Listings are approved by an admin first." },
              { icon: Timer, t: "Live job status", d: "Requested, accepted, in progress, completed." },
              { icon: CreditCard, t: "Pay when it is fixed", d: "Secure Stripe checkout after the job is done." },
            ].map((x) => (
              <li key={x.t} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-accent">
                  <x.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display font-bold">{x.t}</p>
                  <p className="text-sm text-white/65">{x.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
