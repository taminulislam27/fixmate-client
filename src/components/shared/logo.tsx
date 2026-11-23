import Link from "next/link";
import { Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

/** Same size and style everywhere (navbar, footer, dashboard, auth pages). */
export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2.5", className)} aria-label="FixMate home">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        <Wrench className="h-5 w-5" strokeWidth={2.5} />
      </span>
      <span className={cn("font-display text-xl font-extrabold tracking-tight", light ? "text-white" : "text-foreground")}>
        Fix<span className="text-accent">Mate</span>
      </span>
    </Link>
  );
}
