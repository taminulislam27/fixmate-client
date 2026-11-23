"use client";

import Link from "next/link";
import { BadgeCheck, Hourglass, Layers, Wallet } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shell";
import { DataState } from "@/components/dashboard/data-state";
import { StatusBarChart } from "@/components/dashboard/charts";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/use-api";
import { useSession } from "@/lib/auth-client";
import { money } from "@/lib/utils";

interface Stats {
  totalServices: number;
  approvedServices: number;
  pendingRequests: number;
  earnings: number;
  byStatus: Record<string, number>;
}

export default function TechnicianOverview() {
  const { data: session } = useSession();
  const { data, loading, error, reload } = useApi<Stats>("/api/stats/overview");

  return (
    <>
      <PageHeader
        title={`Welcome, ${session?.user?.name?.split(" ")[0] || "technician"}`}
        subtitle="Your services and incoming jobs at a glance."
        action={
          <Button asChild variant="cta">
            <Link href="/dashboard/technician/add-service">Add a service</Link>
          </Button>
        }
      />
      <DataState loading={loading} error={error} onRetry={reload} rows={3}>
        {data && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Total Services" value={data.totalServices} icon={Layers} />
              <StatCard label="Approved Services" value={data.approvedServices} icon={BadgeCheck} tone="green" />
              <StatCard label="Pending Requests" value={data.pendingRequests} icon={Hourglass} tone="accent" />
              <StatCard label="Earnings" value={money(data.earnings)} icon={Wallet} tone="blue" />
            </div>
            <StatusBarChart data={data.byStatus} title="My jobs by status" />
          </div>
        )}
      </DataState>
    </>
  );
}
