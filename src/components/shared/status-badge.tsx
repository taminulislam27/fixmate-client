import { cn } from "@/lib/utils";
import { STATUS_LABELS, STATUS_STYLES } from "@/lib/constants";

/** Single badge used by every dashboard so colours never drift. */
export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        STATUS_STYLES[status] || STATUS_STYLES.unpaid,
        className
      )}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}
