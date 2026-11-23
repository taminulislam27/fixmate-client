"use client";

import Link from "next/link";
import { CalendarCheck, CheckCircle2, ClipboardList, Wallet } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shell";
import { DataState } from "@/components/dashboard/data-state";
import { StatusBarChart } from "@/components/dashboard/charts";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/use-api";
import { useSession } from "@/lib/auth-client";
import { money } from "@/lib/utils";

interface Stats {
  totalRequests: number;
  activeJobs: number;
  completedJobs: number;
  totalSpent: number;
  byStatus: Record<string, number>;
}

export default function CustomerOverview() {
  const { data: session } = useSession();
  const { data, loading, error, reload } = useApi<Stats>("/api/stats/overview");

  return (
    <>
      <PageHeader
        title={`Hello, ${session?.user?.name?.split(" ")[0] || "there"}`}
        subtitle="Here is where your repairs stand."
        action={
          <Button asChild variant="cta">
            <Link href="/services">Book a new repair</Link>
          </Button>
        }
      />
      <DataState loading={loading} error={error} onRetry={reload} rows={3}>
        {data && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Total Requests" value={data.totalRequests} icon={ClipboardList} tone="blue" />
              <StatCard label="Active Jobs" value={data.activeJobs} icon={CalendarCheck} tone="accent" />
              <StatCard label="Completed Jobs" value={data.completedJobs} icon={CheckCircle2} tone="green" />
              <StatCard label="Total Spent" value={money(data.totalSpent)} icon={Wallet} />
            </div>
            <StatusBarChart data={data.byStatus} title="My requests by status" />
          </div>
        )}
      </DataState>
    </>
  );
}
