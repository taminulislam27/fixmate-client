"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shell";
import { DataState } from "@/components/dashboard/data-state";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/input";
import { useApi } from "@/hooks/use-api";
import { fmtDate, money } from "@/lib/utils";

interface Booking {
  _id: string;
  serviceTitle: string;
  customerName: string;
  technicianName: string;
  preferredDate: string;
  status: string;
  paymentStatus: string;
  basePrice: number;
  finalAmount: number;
}

const STATUSES = ["requested", "accepted", "in-progress", "completed", "rejected", "cancelled"];

export default function AdminBookingsPage() {
  const [filter, setFilter] = useState("");
  const { data, loading, error, reload } = useApi<Booking[]>("/api/admin/bookings", { status: filter || undefined });

  return (
    <>
      <PageHeader
        title="All Bookings"
        subtitle="Read-only view of every repair job on the platform."
        action={
          <div className="w-44">
            <label htmlFor="bk-status" className="sr-only">Filter by status</label>
            <Select id="bk-status" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s.replace("-", " ").replace(/^\w/, (c) => c.toUpperCase())}</option>
              ))}
            </Select>
          </div>
        }
      />
      <DataState loading={loading} error={error} onRetry={reload}>
        {data && data.length === 0 ? (
          <EmptyState icon={ClipboardList} title="No bookings found" message="Nothing matches this filter yet." />
        ) : (
          data && (
            <Card className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Technician</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.map((b) => (
                    <tr key={b._id}>
                      <td className="max-w-[14rem] truncate px-4 py-3 font-semibold">{b.serviceTitle}</td>
                      <td className="px-4 py-3">{b.customerName}</td>
                      <td className="px-4 py-3">{b.technicianName}</td>
                      <td className="whitespace-nowrap px-4 py-3">{fmtDate(b.preferredDate)}</td>
                      <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                      <td className="px-4 py-3"><StatusBadge status={b.paymentStatus} /></td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {money(b.status === "completed" || b.paymentStatus === "paid" ? b.finalAmount : b.basePrice)}
                      </td>
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
