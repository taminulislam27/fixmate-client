"use client";

import { DollarSign, Receipt } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shell";
import { DataState } from "@/components/dashboard/data-state";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/shared/stat-card";
import { Card } from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";
import { fmtDateTime, money } from "@/lib/utils";

interface Payment {
  _id: string;
  customerName: string;
  technicianName: string;
  serviceTitle: string;
  amount: number;
  transactionId: string;
  paidAt: string;
}

export default function TransactionsPage() {
  const { data, loading, error, reload } = useApi<{ items: Payment[]; totalRevenue: number }>("/api/admin/payments");

  return (
    <>
      <PageHeader title="Transactions" subtitle="Every payment recorded through Stripe." />
      <DataState loading={loading} error={error} onRetry={reload}>
        {data && (
          <div className="space-y-6">
            <div className="max-w-sm">
              <StatCard label="Total Revenue" value={money(data.totalRevenue)} icon={DollarSign} tone="green" />
            </div>
            {data.items.length === 0 ? (
              <EmptyState icon={Receipt} title="No transactions yet" message="Payments will be listed here once customers pay for completed jobs." />
            ) : (
              <Card className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-left text-sm">
                  <thead className="border-b bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Technician</th>
                      <th className="px-4 py-3">Service</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Transaction ID</th>
                      <th className="px-4 py-3">Paid on</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {data.items.map((p) => (
                      <tr key={p._id}>
                        <td className="px-4 py-3">{p.customerName}</td>
                        <td className="px-4 py-3">{p.technicianName}</td>
                        <td className="max-w-[14rem] truncate px-4 py-3 font-semibold">{p.serviceTitle}</td>
                        <td className="px-4 py-3 font-semibold text-green-600 dark:text-green-400">{money(p.amount)}</td>
                        <td className="px-4 py-3 font-mono text-xs">{p.transactionId}</td>
                        <td className="whitespace-nowrap px-4 py-3">{fmtDateTime(p.paidAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )}
          </div>
        )}
      </DataState>
    </>
  );
}
