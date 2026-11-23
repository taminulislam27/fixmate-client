import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Read-only star display, with optional "4.5 (12)" label. */
export function Stars({ value, count, size = "sm" }: { value: number; count?: number; size?: "sm" | "md" }) {
  const dim = size === "md" ? "h-5 w-5" : "h-4 w-4";
  if (!count) {
    return <span className="text-xs font-medium text-muted-foreground">No reviews yet</span>;
  }
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-flex" aria-label={`${value} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            className={cn(dim, n <= Math.round(value) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40")}
          />
        ))}
      </span>
      <span className="text-sm font-semibold">{value.toFixed(1)}</span>
      <span className="text-xs text-muted-foreground">({count})</span>
    </span>
  );
}
