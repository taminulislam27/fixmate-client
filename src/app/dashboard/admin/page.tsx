"use client";

import { DollarSign, ShieldQuestion, UserCog, Users } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shell";
import { DataState } from "@/components/dashboard/data-state";
import { CategoryPieChart, RevenueAreaChart, StatusBarChart } from "@/components/dashboard/charts";
import { StatCard } from "@/components/shared/stat-card";
import { useApi } from "@/hooks/use-api";
import { money } from "@/lib/utils";

interface Stats {
  totalUsers: number;
  totalTechnicians: number;
  pendingServices: number;
  totalRevenue: number;
  byStatus: Record<string, number>;
  servicesByCategory: Record<string, number>;
  revenueByDay: Record<string, number>;
}

export default function AdminOverview() {
  const { data, loading, error, reload } = useApi<Stats>("/api/stats/overview");

  return (
    <>
      <PageHeader title="Platform overview" subtitle="Users, listings, jobs and revenue across FixMate." />
      <DataState loading={loading} error={error} onRetry={reload} rows={3}>
        {data && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Total Users" value={data.totalUsers} icon={Users} tone="blue" />
              <StatCard label="Total Technicians" value={data.totalTechnicians} icon={UserCog} />
              <StatCard label="Pending Services" value={data.pendingServices} icon={ShieldQuestion} tone="accent" />
              <StatCard label="Total Revenue" value={money(data.totalRevenue)} icon={DollarSign} tone="green" />
            </div>
            <div className="grid gap-6 xl:grid-cols-2">
              <StatusBarChart data={data.byStatus} title="All jobs by status" />
              <CategoryPieChart data={data.servicesByCategory} />
            </div>
            <RevenueAreaChart data={data.revenueByDay} />
          </div>
        )}
      </DataState>
    </>
  );
}
