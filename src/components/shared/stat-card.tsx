import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";


export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "primary" | "accent" | "green" | "blue";
}) {
  const tones = {
    primary: "bg-primary/10 text-primary dark:text-accent",
    accent: "bg-accent/15 text-accent",
    green: "bg-green-500/15 text-green-600 dark:text-green-400",
    blue: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  };
  return (
    <Card className="flex items-center gap-4 p-5">
      <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", tones[tone])}>
        <Icon className="h-6 w-6" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="font-display text-2xl font-extrabold leading-tight">{value}</p>
      </div>
    </Card>
  );
}
