import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Clock, MapPin, Wallet, Wrench } from "lucide-react";
import type { Metadata } from "next";
import { RequestRepair } from "@/components/public/request-repair";
import { Avatar } from "@/components/shared/avatar";
import { Card } from "@/components/ui/card";
import { Stars } from "@/components/shared/stars";
import { ApiError, publicFetch } from "@/lib/api";
import { fmtDate, money } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface Detail {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
  avgRating: number;
  reviewCount: number;
  reviews: { _id: string; customerName: string; rating: number; review: string; reviewedAt: string }[];
  technician: { name: string; image: string; area: string; bio: string };
}

async function getService(id: string): Promise<Detail> {
  try {
    return await publicFetch<Detail>(`/api/services/${id}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const s = await publicFetch<Detail>(`/api/services/${id}`);
    return { title: s.title };
  } catch {
    return { title: "Service" };
  }
}

export default async function ServiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await getService(id);

  const facts = [
    { icon: Wallet, label: "Starting price", value: money(s.basePrice) },
    { icon: Clock, label: "Estimated duration", value: s.estimatedDuration },
    { icon: Wrench, label: "Service mode", value: s.serviceMode },
    { icon: MapPin, label: "Service area", value: s.serviceArea },
  ];

  return (
    <div className="container py-8 lg:py-10">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/services" className="hover:text-foreground">Services</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/services?category=${encodeURIComponent(s.category)}`} className="hover:text-foreground">{s.category}</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="truncate font-medium text-foreground">{s.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-8">
          <div className="aspect-[16/9] overflow-hidden rounded-2xl border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.image} alt={s.title} className="h-full w-full object-cover" />
          </div>

          <div>
            <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">{s.category}</span>
            <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-4xl">{s.title}</h1>
            <div className="mt-3"><Stars value={s.avgRating} count={s.reviewCount} size="md" /></div>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">{s.description}</p>
          </div>

          <section aria-labelledby="reviews-h">
            <h2 id="reviews-h" className="font-display text-2xl font-bold">Customer reviews</h2>
            {s.reviews.length ? (
              <ul className="mt-4 space-y-3">
                {s.reviews.map((r) => (
                  <li key={r._id}>
                    <Card className="p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold">{r.customerName}</p>
                        <span className="text-xs text-muted-foreground">{fmtDate(r.reviewedAt)}</span>
                      </div>
                      <div className="mt-1"><Stars value={r.rating} count={1} /></div>
                      {r.review && <p className="mt-2 text-sm text-muted-foreground">{r.review}</p>}
                    </Card>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 rounded-lg border border-dashed p-5 text-sm text-muted-foreground">
                No reviews yet. Reviews appear after a customer pays for a completed job.
              </p>
            )}
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <Card className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Starting at</p>
            <p className="font-display text-4xl font-extrabold text-primary dark:text-accent">{money(s.basePrice)}</p>
            <p className="mt-1 text-xs text-muted-foreground">Final amount is confirmed by the technician. You pay only after completion.</p>
            <dl className="mt-5 space-y-3 border-t pt-5">
              {facts.map((f) => (
                <div key={f.label} className="flex items-start gap-3">
                  <f.icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <div>
                    <dt className="text-xs text-muted-foreground">{f.label}</dt>
                    <dd className="text-sm font-semibold">{f.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
            <div className="mt-6">
              <RequestRepair serviceId={s._id} serviceTitle={s.title} />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-lg font-bold">Your technician</h2>
            <div className="mt-4 flex items-center gap-3">
              <Avatar name={s.technician.name} src={s.technician.image} className="h-14 w-14 text-lg" />
              <div className="min-w-0">
                <p className="truncate font-semibold">{s.technician.name}</p>
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {s.technician.area}
                </p>
              </div>
            </div>
            {s.technician.bio && <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.technician.bio}</p>}
          </Card>
        </aside>
      </div>
    </div>
  );
}
