import { Check, Circle, X } from "lucide-react";
import { cn, fmtDateTime } from "@/lib/utils";

interface HistoryItem {
  status: string;
  changedAt: string;
}

const STEPS = [
  { key: "requested", label: "Requested" },
  { key: "accepted", label: "Accepted" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "paid", label: "Paid" },
];

export function JobTimeline({ history = [], status }: { history?: HistoryItem[]; status: string }) {
  const at = (key: string) => history.find((h) => h.status === key)?.changedAt;
  const terminalBad = status === "rejected" || status === "cancelled";
  const reached = (key: string) => !!at(key);

  const steps = terminalBad
    ? [STEPS[0], { key: status, label: status === "rejected" ? "Rejected" : "Cancelled" }]
    : STEPS;

  return (
    <ol className="space-y-0" aria-label="Job progress">
      {steps.map((s, i) => {
        const done = reached(s.key);
        const bad = terminalBad && s.key === status;
        const last = i === steps.length - 1;
        return (
          <li key={s.key} className="relative flex gap-4 pb-6 last:pb-0">
            {!last && (
              <span
                aria-hidden
                className={cn(
                  "absolute left-[15px] top-8 h-[calc(100%-1.5rem)] w-0.5",
                  done && reached(steps[i + 1].key) ? "bg-green-500" : "bg-border"
                )}
              />
            )}
            <span
              className={cn(
                "z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
                bad
                  ? "border-red-500 bg-red-500 text-white"
                  : done
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-border bg-card text-muted-foreground"
              )}
            >
              {bad ? <X className="h-4 w-4" /> : done ? <Check className="h-4 w-4" /> : <Circle className="h-3 w-3" />}
            </span>
            <div className="pt-1">
              <p className={cn("text-sm font-semibold", !done && "text-muted-foreground")}>{s.label}</p>
              <p className="text-xs text-muted-foreground">{done ? fmtDateTime(at(s.key)) : "Waiting"}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
