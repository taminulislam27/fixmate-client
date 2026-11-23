"use client";

import { Receipt } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shell";
import { DataState } from "@/components/dashboard/data-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";
import { fmtDateTime, money } from "@/lib/utils";

interface Payment {
  _id: string;
  serviceTitle: string;
  technicianName: string;
  amount: number;
  transactionId: string;
  paidAt: string;
}

export default function PaymentHistoryPage() {
  const { data, loading, error, reload } = useApi<Payment[]>("/api/payments/my");

  return (
    <>
      <PageHeader title="Payment History" subtitle="Every job you have paid for." />
      <DataState loading={loading} error={error} onRetry={reload}>
        {data && data.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No payments yet"
            message="Once a technician completes a job, you can pay for it from My Bookings."
            ctaLabel="Go to My Bookings"
            ctaHref="/dashboard/customer/bookings"
          />
        ) : (
          data && (
            <Card className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="border-b bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3">Technician</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Transaction ID</th>
                    <th className="px-4 py-3">Paid on</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.map((p) => (
                    <tr key={p._id}>
                      <td className="px-4 py-3 font-semibold">{p.serviceTitle}</td>
                      <td className="px-4 py-3">{p.technicianName}</td>
                      <td className="px-4 py-3 font-semibold text-green-600 dark:text-green-400">{money(p.amount)}</td>
                      <td className="px-4 py-3 font-mono text-xs">{p.transactionId}</td>
                      <td className="whitespace-nowrap px-4 py-3">{fmtDateTime(p.paidAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )
        )}
      </DataState>
    </>
  );
}
