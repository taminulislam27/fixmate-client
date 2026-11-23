"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";


export function DataState({
  loading,
  error,
  onRetry,
  rows = 5,
  children,
}: {
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  rows?: number;
  children: React.ReactNode;
}) {
  if (loading) {
    return (
      <div className="space-y-3" aria-busy="true" aria-label="Loading">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <p className="mt-3 font-semibold">{error}</p>
        <Button variant="outline" className="mt-4" onClick={onRetry}>
          <RotateCcw /> Try again
        </Button>
      </div>
    );
  }
  return <>{children}</>;
}
