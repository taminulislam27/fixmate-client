"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { CATEGORIES, SERVICE_MODES } from "@/lib/constants";

/**
 * Search / filter / sort controls. They only write to the URL query string;
 * the server page then asks MongoDB for the result (Challenge 1), so filters survive a reload.
 */
export function ServicesFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState(params.get("q") || "");

  useEffect(() => setQ(params.get("q") || ""), [params]);

  function update(next: Record<string, string>) {
    const sp = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([k, v]) => (v ? sp.set(k, v) : sp.delete(k)));
    sp.delete("page"); // any filter change goes back to page 1
    startTransition(() => router.replace(`${pathname}?${sp.toString()}`, { scroll: false }));
  }

  const hasFilters = ["q", "category", "mode", "sort"].some((k) => params.get(k));

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          update({ q: q.trim() });
        }}
        className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_1fr_auto]"
      >
        <div className="relative">
          <label htmlFor="svc-search" className="sr-only">Search by title or category</label>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="svc-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title or category"
            className="pl-9"
          />
        </div>
        <div>
          <label htmlFor="svc-cat" className="sr-only">Category</label>
          <Select id="svc-cat" value={params.get("category") || ""} onChange={(e) => update({ category: e.target.value })}>
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </Select>
        </div>
        <div>
          <label htmlFor="svc-mode" className="sr-only">Service mode</label>
          <Select id="svc-mode" value={params.get("mode") || ""} onChange={(e) => update({ mode: e.target.value })}>
            <option value="">Any service mode</option>
            {SERVICE_MODES.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </Select>
        </div>
        <div>
          <label htmlFor="svc-sort" className="sr-only">Sort</label>
          <Select id="svc-sort" value={params.get("sort") || "newest"} onChange={(e) => update({ sort: e.target.value })}>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button type="submit" className="flex-1 md:flex-none">
            {pending ? <Loader2 className="animate-spin" /> : <Search />} Search
          </Button>
          {hasFilters && (
            <Button type="button" variant="outline" size="icon" aria-label="Reset filters" onClick={() => {
              setQ("");
              startTransition(() => router.replace(pathname, { scroll: false }));
            }}>
              <RotateCcw />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
