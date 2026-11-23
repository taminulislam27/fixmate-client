import Link from "next/link";
import type { Metadata } from "next";
import { CircleDollarSign, ClipboardCheck, ShieldCheck, UserCheck, Users, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "How It Works & About" };

const FLOW = [
  { s: "requested", t: "Requested", d: "You send the request with your problem, address and date." },
  { s: "accepted", t: "Accepted", d: "The technician reviews and accepts the job (or rejects it)." },
  { s: "in-progress", t: "In Progress", d: "Work has started on your device or appliance." },
  { s: "completed", t: "Completed", d: "The technician finishes and sets the final amount." },
  { s: "paid", t: "Paid", d: "You pay securely with Stripe. Only now does money move." },
];

const ROLES = [
  {
    icon: Users,
    title: "Customers",
    points: ["Browse and compare approved services", "Send repair requests and cancel while still requested", "Pay per job after completion and rate the work"],
  },
  {
    icon: Wrench,
    title: "Technicians",
    points: ["List services with photos and prices", "Accept or reject incoming requests", "Move jobs forward and set the final amount"],
  },
  {
    icon: ShieldCheck,
    title: "Admins",
    points: ["Approve or reject every service listing", "Manage users and roles", "Watch all jobs and track revenue"],
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-ink text-white">
        <div className="container py-16">
          <p className="eyebrow">About FixMate</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold leading-tight sm:text-5xl">
            Repairs that are visible from first request to final payment.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">
            After handing over a device, most people have no idea what is happening and often pay before any work is
            done. FixMate fixes both: every job has a clear status, and payment happens only after delivery.
          </p>
        </div>
      </section>

      <section className="container py-20">
        <p className="eyebrow">The job pipeline</p>
        <h2 className="section-title mt-2">How every repair moves</h2>
        <p className="section-sub">One step at a time, enforced by the server so nothing can be skipped.</p>
        <ol className="mt-10 grid gap-4 md:grid-cols-5">
          {FLOW.map((f, i) => (
            <li key={f.s} className="relative">
              <Card className="h-full p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-display font-extrabold text-primary-foreground">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-display text-base font-bold">{f.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.d}</p>
              </Card>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-sm text-muted-foreground">
          A requested job can also be <strong>rejected</strong> by the technician or <strong>cancelled</strong> by the customer.
        </p>
      </section>

      <section className="bg-secondary/60 py-20">
        <div className="container">
          <p className="eyebrow">Three roles</p>
          <h2 className="section-title mt-2">Built for everyone in the repair</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {ROLES.map((r) => (
              <Card key={r.title} className="p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <r.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-xl font-bold">{r.title}</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {r.points.map((p) => (
                    <li key={p} className="flex gap-2"><ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {p}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: UserCheck, t: "Trusted technicians", d: "Listings are approved by an admin before anyone can book them." },
            { icon: CircleDollarSign, t: "Fair, final pricing", d: "Starting prices up front. The technician confirms the final amount." },
            { icon: ShieldCheck, t: "Secure payments", d: "Stripe Checkout handles every payment. We never see card details." },
          ].map((x) => (
            <div key={x.t} className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <x.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold">{x.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{x.d}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-primary p-8 text-primary-foreground">
          <div>
            <h2 className="font-display text-2xl font-bold">Ready to get something fixed?</h2>
            <p className="mt-1 text-sm opacity-80">Browse services or join as a technician.</p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="cta"><Link href="/services">Browse services</Link></Button>
            <Button asChild variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10">
              <Link href="/sign-up">Join FixMate</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
