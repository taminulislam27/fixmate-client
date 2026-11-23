"use client";

import { useState } from "react";
import { Check, Inbox, Loader2, Play, Wrench, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/shell";
import { DataState } from "@/components/dashboard/data-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useApi } from "@/hooks/use-api";
import { api, ApiError } from "@/lib/api";
import { fmtDate, money } from "@/lib/utils";

interface Job {
  _id: string;
  serviceTitle: string;
  customerName: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
  basePrice: number;
  finalAmount: number;
  status: string;
  paymentStatus: string;
}

const FILTERS = [
  { value: "", label: "All" },
  { value: "requested", label: "Requested" },
  { value: "accepted", label: "Accepted" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export default function RequestsPage() {
  const [filter, setFilter] = useState("");
  const { data, loading, error, reload } = useApi<Job[]>("/api/bookings/technician", { status: filter || undefined });
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [completing, setCompleting] = useState<Job | null>(null);
  const [amount, setAmount] = useState("");
  const [amountErr, setAmountErr] = useState("");

  async function move(id: string, status: string, extra?: Record<string, unknown>, okMsg?: string) {
    setBusyId(id);
    try {
      await api(`/api/bookings/${id}/status`, { method: "PATCH", body: { status, ...extra } });
      toast.success(okMsg || `Job marked ${status}`);
      reload();
      return true;
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Could not update job");
      return false;
    } finally {
      setBusyId(null);
    }
  }

  async function submitComplete() {
    if (!completing) return;
    const n = Number(amount);
    if (!amount || !Number.isFinite(n) || n <= 0) return void setAmountErr("Enter an amount greater than 0");
    const ok = await move(completing._id, "completed", { finalAmount: n }, "Job completed. The customer can now pay.");
    if (ok) setCompleting(null);
  }

  const actions = (j: Job) => {
    const busy = busyId === j._id;
    if (j.status === "requested")
      return (
        <div className="flex gap-2">
          <Button size="sm" disabled={busy} onClick={() => move(j._id, "accepted", undefined, "Request accepted")}>
            {busy ? <Loader2 className="animate-spin" /> : <Check />} Accept
          </Button>
          <Button size="sm" variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive/10" disabled={busy} onClick={() => setRejectId(j._id)}>
            <X /> Reject
          </Button>
        </div>
      );
    if (j.status === "accepted")
      return (
        <Button size="sm" variant="cta" disabled={busy} onClick={() => move(j._id, "in-progress", undefined, "Work started")}>
          {busy ? <Loader2 className="animate-spin" /> : <Play />} Start Work
        </Button>
      );
    if (j.status === "in-progress")
      return (
        <Button
          size="sm"
          disabled={busy}
          onClick={() => {
            setCompleting(j);
            setAmount(String(j.basePrice));
            setAmountErr("");
          }}
        >
          <Wrench /> Mark Completed
        </Button>
      );
    if (j.status === "completed") return <StatusBadge status={j.paymentStatus} />;
    return <span className="text-xs text-muted-foreground">No action</span>;
  };

  return (
    <>
      <PageHeader
        title="Manage Requests"
        subtitle="Jobs sent to you by customers."
        action={
          <div className="w-44">
            <label htmlFor="req-filter" className="sr-only">Filter by status</label>
            <Select id="req-filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
              {FILTERS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </Select>
          </div>
        }
      />
      <DataState loading={loading} error={error} onRetry={reload}>
        {data && data.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title={filter ? "No jobs with this status" : "No requests yet"}
            message={filter ? "Try another status filter." : "When a customer books one of your services, it will appear here."}
            ctaLabel={filter ? undefined : "Add a service"}
            ctaHref={filter ? undefined : "/dashboard/technician/add-service"}
          />
        ) : (
          data && (
            <Card className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="border-b bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3">Address</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Problem</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y align-top">
                  {data.map((j) => (
                    <tr key={j._id}>
                      <td className="px-4 py-3">
                        <p className="font-semibold">{j.customerName}</p>
                        <p className="text-xs text-muted-foreground">{j.customerPhone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="max-w-[12rem] font-semibold">{j.serviceTitle}</p>
                        <p className="text-xs text-muted-foreground">
                          {j.status === "completed" ? `Final ${money(j.finalAmount)}` : `Base ${money(j.basePrice)}`}
                        </p>
                      </td>
                      <td className="max-w-[11rem] px-4 py-3 text-muted-foreground">{j.address}</td>
                      <td className="whitespace-nowrap px-4 py-3">{fmtDate(j.preferredDate)}</td>
                      <td className="max-w-[16rem] px-4 py-3 text-muted-foreground">
                        <p className="line-clamp-3" title={j.problemDescription}>{j.problemDescription}</p>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={j.status} /></td>
                      <td className="px-4 py-3">{actions(j)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )
        )}
      </DataState>

      <ConfirmDialog
        open={!!rejectId}
        onOpenChange={(o) => !o && setRejectId(null)}
        title="Reject this request?"
        description="The customer will see the request as rejected. This is final."
        confirmLabel="Reject request"
        loading={!!busyId}
        onConfirm={async () => {
          if (rejectId && (await move(rejectId, "rejected", undefined, "Request rejected"))) setRejectId(null);
        }}
      />

      <Dialog open={!!completing} onOpenChange={(o) => !o && setCompleting(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Mark as completed</DialogTitle>
            <DialogDescription>Set the final amount the customer will pay for {completing?.serviceTitle}.</DialogDescription>
          </DialogHeader>
          <Field label="Final amount (USD)" htmlFor="final-amt" error={amountErr}>
            <Input id="final-amt" type="number" min="1" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </Field>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleting(null)}>Cancel</Button>
            <Button onClick={submitComplete} disabled={!!busyId}>
              {busyId && <Loader2 className="animate-spin" />} Complete job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
