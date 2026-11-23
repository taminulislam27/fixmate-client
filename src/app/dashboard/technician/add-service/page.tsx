"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/shell";
import { ServiceForm } from "@/components/dashboard/service-form";
import { Card } from "@/components/ui/card";
import { api, ApiError } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

export default function AddServicePage() {
  const router = useRouter();
  const { data } = useSession();
  const user = data?.user;

  return (
    <>
      <PageHeader title="Add a service" subtitle="New services stay pending until an admin approves them." />
      <Card className="max-w-3xl p-6">
        {user && (
          <ServiceForm
            technician={{ name: user.name, email: user.email }}
            submitLabel="Submit for approval"
            onSubmit={async (v) => {
              try {
                await api("/api/services", { method: "POST", body: { ...v, basePrice: Number(v.basePrice) } });
                toast.success("Service submitted. It is now waiting for admin approval.");
                router.push("/dashboard/technician/my-services");
              } catch (e) {
                toast.error(e instanceof ApiError ? e.message : "Could not add service");
              }
            }}
          />
        )}
      </Card>
    </>
  );
}
