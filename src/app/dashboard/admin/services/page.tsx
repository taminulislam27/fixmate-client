"use client";

import { useState } from "react";
import { Check, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/shell";
import { DataState } from "@/components/dashboard/data-state";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/input";
import { useApi } from "@/hooks/use-api";
import { api, ApiError } from "@/lib/api";
import { fmtDate, money } from "@/lib/utils";

interface Service {
  _id: string;
  title: string;
  category: string;
  image: string;
  basePrice: number;
  technicianName: string;
  approvalStatus: string;
  createdAt: string;
}

export default function AdminServicesPage() {
  // The server returns pending first, so new listings are the first thing the admin sees
  const [filter, setFilter] = useState("");
  const { data, loading, error, reload } = useApi<Service[]>("/api/admin/services", { status: filter || undefined });
  const [busyId, setBusyId] = useState<string | null>(null);

  async function decide(id: string, approvalStatus: "approved" | "rejected") {
    setBusyId(id);
    try {
      await api(`/api/admin/services/${id}/approval`, { method: "PATCH", body: { approvalStatus } });
      toast.success(`Service ${approvalStatus}`);
      reload();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Could not update service");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <PageHeader
        title="Service Approval"
        subtitle="Only approved services appear on public pages."
        action={
          <div className="w-44">
            <label htmlFor="svc-status" className="sr-only">Filter by approval status</label>
            <Select id="svc-status" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="">All (pending first)</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </Select>
          </div>
        }
      />
      <DataState loading={loading} error={error} onRetry={reload}>
        {data && data.length === 0 ? (
          <EmptyState icon={ShieldCheck} title="Nothing to review" message="No services match this filter." />
        ) : (
          data && (
            <Card className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="border-b bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3">Technician</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Added</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.map((s) => (
                    <tr key={s._id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={s.image} alt="" className="h-12 w-16 rounded-md object-cover" />
                          <span className="max-w-[14rem] truncate font-semibold">{s.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{s.technicianName}</td>
                      <td className="px-4 py-3">{s.category}</td>
                      <td className="px-4 py-3 font-semibold">{money(s.basePrice)}</td>
                      <td className="whitespace-nowrap px-4 py-3">{fmtDate(s.createdAt)}</td>
                      <td className="px-4 py-3"><StatusBadge status={s.approvalStatus} /></td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          {s.approvalStatus !== "approved" && (
                            <Button size="sm" disabled={busyId === s._id} onClick={() => decide(s._id, "approved")}>
                              <Check /> Approve
                            </Button>
                          )}
                          {s.approvalStatus !== "rejected" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-destructive/40 text-destructive hover:bg-destructive/10"
                              disabled={busyId === s._id}
                              onClick={() => decide(s._id, "rejected")}
                            >
                              <X /> Reject
                            </Button>
                          )}
                        </div>
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
