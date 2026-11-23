"use client";

import { useState } from "react";
import { PackagePlus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/shell";
import { DataState } from "@/components/dashboard/data-state";
import { ServiceForm, type ServiceValues } from "@/components/dashboard/service-form";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useApi } from "@/hooks/use-api";
import { api, ApiError } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { money } from "@/lib/utils";

interface Service {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
  approvalStatus: string;
  isAvailable: boolean;
}

export default function MyServicesPage() {
  const { data: session } = useSession();
  const { data, setData, loading, error, reload } = useApi<Service[]>("/api/services/my");
  const [editing, setEditing] = useState<Service | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function toggle(s: Service, value: boolean) {

    setData((d) => d && d.map((x) => (x._id === s._id ? { ...x, isAvailable: value } : x)));
    try {
      await api(`/api/services/${s._id}`, { method: "PATCH", body: { isAvailable: value } });
      toast.success(value ? "Service is now available" : "Service hidden from public pages");
    } catch (e) {
      setData((d) => d && d.map((x) => (x._id === s._id ? { ...x, isAvailable: !value } : x)));
      toast.error(e instanceof ApiError ? e.message : "Could not update availability");
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api(`/api/services/${deleteId}`, { method: "DELETE" });
      toast.success("Service deleted");
      setDeleteId(null);
      reload();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Could not delete service");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <PageHeader title="My Services" subtitle="Edit, hide or remove the services you offer." />
      <DataState loading={loading} error={error} onRetry={reload}>
        {data && data.length === 0 ? (
          <EmptyState
            icon={PackagePlus}
            title="You have not added any services"
            message="Add your first repair service so customers can find and book you."
            ctaLabel="Add a service"
            ctaHref="/dashboard/technician/add-service"
          />
        ) : (
          data && (
            <Card className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="border-b bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Approval</th>
                    <th className="px-4 py-3">Available</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.map((s) => (
                    <tr key={s._id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">

                          <img src={s.image} alt="" className="h-12 w-16 rounded-md object-cover" />
                          <span className="max-w-[16rem] truncate font-semibold">{s.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{s.category}</td>
                      <td className="px-4 py-3 font-semibold">{money(s.basePrice)}</td>
                      <td className="px-4 py-3"><StatusBadge status={s.approvalStatus} /></td>
                      <td className="px-4 py-3">
                        <Switch
                          checked={s.isAvailable}
                          onCheckedChange={(v) => toggle(s, v)}
                          aria-label={`Toggle availability for ${s.title}`}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => setEditing(s)}>
                            <Pencil /> Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-destructive/40 text-destructive hover:bg-destructive/10"
                            onClick={() => setDeleteId(s._id)}
                          >
                            <Trash2 /> Delete
                          </Button>
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

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit service</DialogTitle>
            <DialogDescription>After saving, the service goes back to pending until an admin approves it again.</DialogDescription>
          </DialogHeader>
          {editing && session?.user && (
            <ServiceForm
              key={editing._id}
              technician={{ name: session.user.name, email: session.user.email }}
              initial={{
                title: editing.title,
                category: editing.category,
                description: editing.description,
                basePrice: String(editing.basePrice),
                estimatedDuration: editing.estimatedDuration,
                serviceMode: editing.serviceMode,
                serviceArea: editing.serviceArea,
                image: editing.image,
              } satisfies ServiceValues}
              submitLabel="Save changes"
              onSubmit={async (v) => {
                try {
                  await api(`/api/services/${editing._id}`, { method: "PATCH", body: { ...v, basePrice: Number(v.basePrice) } });
                  toast.success("Service updated and sent for re-approval");
                  setEditing(null);
                  reload();
                } catch (e) {
                  toast.error(e instanceof ApiError ? e.message : "Could not update service");
                }
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete this service?"
        description="It will be removed from FixMate permanently. Existing bookings keep their copied details."
        confirmLabel="Delete service"
        loading={deleting}
        onConfirm={confirmDelete}
      />
    </>
  );
}
