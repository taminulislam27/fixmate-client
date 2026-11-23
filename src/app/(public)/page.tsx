import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  ListChecks,
  Search,
  ShieldCheck,
  Timer,
  Wrench,
  Send,
  Hammer,
  Smartphone,
  Laptop,
  AirVent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ServiceCard, type ServiceLite } from "@/components/shared/service-card";
import { EmptyState } from "@/components/shared/empty-state";
import { CATEGORIES } from "@/lib/constants";
import { publicFetch } from "@/lib/api";

export const dynamic = "force-dynamic";

async function load() {
  try {
    const [list, stats] = await Promise.all([
      publicFetch<{ items: ServiceLite[] }>("/api/services", { limit: 6, sort: "newest" }),
      publicFetch<{ technicians: number; completedJobs: number; services: number }>("/api/stats/public"),
    ]);
    return { services: list.items, stats };
  } catch {
    return { services: [] as ServiceLite[], stats: null };
  }
}

const STEPS = [
  { icon: Search, title: "Find a Service", text: "Browse approved repair services, filter by category and compare prices." },
  { icon: Send, title: "Send a Request", text: "Share your problem, address and preferred date. No payment needed yet." },
  { icon: Hammer, title: "Technician Fixes It", text: "Follow every step live: accepted, in progress, completed." },
  { icon: CreditCard, title: "Pay After Completion", text: "Pay securely with Stripe only once the job is done." },
];

const WHY = [
  { icon: BadgeCheck, title: "Admin-approved listings", text: "Every service is reviewed before it appears on FixMate." },
  { icon: Timer, title: "Live job tracking", text: "No more guessing. See the exact stage of your repair." },
  { icon: ShieldCheck, title: "Pay after service", text: "Your money moves only after the technician marks the job complete." },
  { icon: ListChecks, title: "Clear final price", text: "The technician confirms the final amount before you pay." },
];

export default async function HomePage() {
  const { services, stats } = await load();

  const numbers = [
    { value: stats ? `${stats.technicians}+` : "2+", label: "Verified technicians" },
    { value: stats ? `${stats.services}+` : "12+", label: "Active services" },
    { value: stats ? `${stats.completedJobs}+` : "3+", label: "Jobs completed" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="dot-grid absolute inset-0" aria-hidden />
        <div className="container relative grid items-center gap-12 py-16 lg:grid-cols-[1.15fr_1fr] lg:py-24">
          <div>
            <p className="eyebrow">Repair, tracked end to end</p>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
              Broken device? Get it fixed by <span className="text-accent">verified technicians.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">
              Book phone, laptop, AC, fridge, TV and home electrical repairs. Watch your job move step by step and pay
              only after the work is done.
            </p>

            <form action="/services" method="GET" className="mt-8 flex max-w-xl flex-col gap-2 sm:flex-row">
              <label htmlFor="hero-search" className="sr-only">
                Search repair services
              </label>
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />
                <input
                  id="hero-search"
                  name="q"
                  placeholder="Try “screen replacement” or “AC”"
                  className="h-12 w-full rounded-lg border border-white/20 bg-white/10 pl-11 pr-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <Button type="submit" variant="cta" size="lg">
                Find a Technician
              </Button>
            </form>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-white/15 pt-6">
              {numbers.map((n) => (
                <div key={n.label}>
                  <dt className="sr-only">{n.label}</dt>
                  <dd className="font-display text-3xl font-extrabold text-accent">{n.value}</dd>
                  <p className="text-xs text-white/65">{n.label}</p>
                </div>
              ))}
            </dl>
          </div>

          {/* Hero illustration built from the brand's own icons */}
          <div className="relative mx-auto hidden aspect-square w-full max-w-md lg:block" aria-hidden>
            <div className="absolute inset-6 rounded-[2.5rem] bg-primary shadow-2xl" />
            <div className="absolute inset-6 rounded-[2.5rem] border border-white/15" />
            <div className="absolute left-1/2 top-1/2 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 rotate-[-12deg] items-center justify-center rounded-[2rem] bg-accent text-accent-foreground shadow-xl">
              <Wrench className="h-20 w-20" strokeWidth={2.2} />
            </div>
            {[
              { Icon: Smartphone, pos: "left-0 top-14", label: "Screen fixed" },
              { Icon: Laptop, pos: "right-0 top-28", label: "Runs cool again" },
              { Icon: AirVent, pos: "bottom-12 left-6", label: "Serviced today" },
            ].map(({ Icon, pos, label }) => (
              <div
                key={label}
                className={`absolute ${pos} flex items-center gap-2.5 rounded-xl bg-card px-3.5 py-2.5 text-foreground shadow-lg`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary dark:text-accent">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-bold">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured services */}
      <section className="container py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Fresh on FixMate</p>
            <h2 className="section-title mt-2">Latest featured services</h2>
            <p className="section-sub">The newest approved repair services from verified technicians.</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/services">
              View all services <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="mt-10">
          {services.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <ServiceCard key={s._id} s={s} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No services yet"
              message="Approved services will appear here as soon as technicians add them."
              ctaLabel="Browse services"
              ctaHref="/services"
            />
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-secondary/60 py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Simple by design</p>
            <h2 className="section-title mt-2">How FixMate works</h2>
            <p className="section-sub mx-auto">Four steps from a broken device to a working one.</p>
          </div>
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <Card className="relative h-full p-6">
                  <span className="absolute right-5 top-4 font-display text-5xl font-extrabold text-primary/10 dark:text-accent/15">
                    {i + 1}
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <s.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </Card>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-20">
        <p className="eyebrow">What needs fixing?</p>
        <h2 className="section-title mt-2">Popular categories</h2>
        <p className="section-sub">Jump straight into the repairs people book most.</p>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.name}
              href={`/services?category=${encodeURIComponent(c.name)}`}
              className="group flex h-full flex-col rounded-xl border bg-card p-5 transition-all hover:-translate-y-1 hover:border-accent hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <c.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-base font-bold">{c.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-ink py-20 text-white">
        <div className="container grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <p className="eyebrow">Why FixMate</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Repairs you can actually trust
            </h2>
            <p className="mt-3 max-w-md text-base leading-relaxed text-white/70">
              People hand over a device and hope for the best. FixMate shows every step and keeps your payment safe until
              the work is delivered.
            </p>
            <Button asChild variant="cta" size="lg" className="mt-8">
              <Link href="/sign-up">Get started free</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {WHY.map((w) => (
              <div key={w.title} className="rounded-xl border border-white/10 bg-white/5 p-5">
                <w.icon className="h-6 w-6 text-accent" />
                <h3 className="mt-3 font-display text-base font-bold">{w.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/70">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
