import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import type { Metadata } from "next";
import { ServicesFilters } from "@/components/public/services-filters";
import { ServiceCard, type ServiceLite } from "@/components/shared/service-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { publicFetch } from "@/lib/api";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Browse Repair Services" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

type SP = { q?: string; category?: string; mode?: string; sort?: string; page?: string };

export default async function ServicesPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const page = Math.max(parseInt(sp.page || "1", 10) || 1, 1);

  // Search, filter, sort and pagination all happen in MongoDB (server side)
  const data = await publicFetch<{ items: ServiceLite[]; total: number; totalPages: number }>("/api/services", {
    q: sp.q,
    category: sp.category,
    mode: sp.mode,
    sort: sp.sort,
    page,
    limit: PAGE_SIZE,
  });

  const href = (p: number) => {
    const q = new URLSearchParams();
    Object.entries({ ...sp, page: String(p) }).forEach(([k, v]) => v && q.set(k, v));
    return `/services?${q.toString()}`;
  };

  return (
    <div>
      <section className="bg-ink text-white">
        <div className="container py-12">
          <p className="eyebrow">Repair marketplace</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Browse repair services</h1>
          <p className="mt-2 max-w-xl text-white/70">
            Approved services from verified technicians. Search, filter and compare, then send a request.
          </p>
        </div>
      </section>

      <div className="container py-10">
        <Suspense fallback={<div className="h-[76px] animate-pulse rounded-xl bg-muted" />}>
          <ServicesFilters />
        </Suspense>

        <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
          {data.total} {data.total === 1 ? "service" : "services"} found
        </p>

        <div className="mt-4">
          {data.items.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.items.map((s) => (
                <ServiceCard key={s._id} s={s} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={SearchX}
              title="No services match your search"
              message="Try a different keyword, or clear the filters to see everything."
              ctaLabel="Clear filters"
              ctaHref="/services"
            />
          )}
        </div>

        {data.totalPages > 1 && (
          <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
            <Button asChild variant="outline" size="sm" className={cn(page <= 1 && "pointer-events-none opacity-50")}>
              <Link href={href(page - 1)} aria-disabled={page <= 1}>
                <ChevronLeft /> Previous
              </Link>
            </Button>
            {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
              <Button key={p} asChild variant={p === page ? "default" : "outline"} size="sm">
                <Link href={href(p)} aria-current={p === page ? "page" : undefined}>{p}</Link>
              </Button>
            ))}
            <Button asChild variant="outline" size="sm" className={cn(page >= data.totalPages && "pointer-events-none opacity-50")}>
              <Link href={href(page + 1)} aria-disabled={page >= data.totalPages}>
                Next <ChevronRight />
              </Link>
            </Button>
          </nav>
        )}
      </div>
    </div>
  );
}
