import {
  Smartphone,
  Laptop,
  AirVent,
  Refrigerator,
  Tv,
  WashingMachine,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const CATEGORIES: { name: string; icon: LucideIcon; blurb: string }[] = [
  { name: "Smartphone", icon: Smartphone, blurb: "Screens, batteries, ports" },
  { name: "Laptop & PC", icon: Laptop, blurb: "Cleaning, upgrades, OS" },
  { name: "AC", icon: AirVent, blurb: "Service, gas, install" },
  { name: "Refrigerator", icon: Refrigerator, blurb: "Cooling and compressor" },
  { name: "TV", icon: Tv, blurb: "Panel, backlight, smart TV" },
  { name: "Washing Machine", icon: WashingMachine, blurb: "Drum, drain, bearings" },
  { name: "Electrical", icon: Zap, blurb: "Wiring, fans, lighting" },
];

export const SERVICE_MODES = ["Home Visit", "Shop Drop-off"] as const;

export type Role = "customer" | "technician" | "admin";

export const dashboardPath = (role?: string) =>
  role === "admin"
    ? "/dashboard/admin"
    : role === "technician"
      ? "/dashboard/technician"
      : "/dashboard/customer";

/** One colour per status, used by every dashboard (brief: requested=blue, accepted=indigo, ...). */
export const STATUS_STYLES: Record<string, string> = {
  requested: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-900",
  accepted: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-200 dark:border-indigo-900",
  "in-progress": "bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-900",
  completed: "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-900",
  rejected: "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-900",
  cancelled: "bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  pending: "bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-900",
  approved: "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-900",
  paid: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-900",
  unpaid: "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
};

export const STATUS_LABELS: Record<string, string> = {
  requested: "Requested",
  accepted: "Accepted",
  "in-progress": "In Progress",
  completed: "Completed",
  rejected: "Rejected",
  cancelled: "Cancelled",
  pending: "Pending",
  approved: "Approved",
  paid: "Paid",
  unpaid: "Unpaid",
};
