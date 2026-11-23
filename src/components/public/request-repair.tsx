"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Info, Loader2, LogIn, Wrench } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const todayStr = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

type Errors = Partial<Record<"phone" | "address" | "preferredDate" | "problemDescription", string>>;

/** Role-restricted request flow: logged-out -> sign in, technician/admin -> notice, customer -> form. */
export function RequestRepair({ serviceId, serviceTitle }: { serviceId: string; serviceTitle: string }) {
  const { data, isPending } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState({ phone: "", address: "", preferredDate: "", problemDescription: "" });

  const user = data?.user as { name: string; email: string; role?: string } | undefined;

  if (isPending) return <div className="h-12 w-full animate-pulse rounded-lg bg-muted" />;

  if (!user) {
    return (
      <Button asChild size="lg" variant="cta" className="w-full">
        <Link href={`/sign-in?redirect=${encodeURIComponent(`/services/${serviceId}`)}`}>
          <LogIn /> Sign in to Request Repair
        </Link>
      </Button>
    );
  }

  if (user.role !== "customer") {
    return (
      <div className="space-y-3">
        <Button size="lg" className="w-full" disabled>
          <Wrench /> Request Repair
        </Button>
        <p className="flex items-start gap-2 rounded-lg bg-muted px-3 py-2.5 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" /> Only customers can request a repair.
        </p>
      </div>
    );
  }

  function validate(): Errors {
    const e: Errors = {};
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^[+\d][\d\s-]{6,}$/.test(form.phone.trim())) e.phone = "Enter a valid phone number";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.preferredDate) e.preferredDate = "Choose a preferred date";
    else if (form.preferredDate < todayStr()) e.preferredDate = "Date must be today or in the future";
    if (form.problemDescription.trim().length < 20)
      e.problemDescription = `Describe the problem in at least 20 characters (${form.problemDescription.trim().length}/20)`;
    return e;
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    try {
      await api("/api/bookings", {
        method: "POST",
        body: {
          serviceId,
          customerPhone: form.phone,
          address: form.address,
          preferredDate: form.preferredDate,
          problemDescription: form.problemDescription,
        },
      });
      toast.success("Repair request sent!", {
        description: "The technician will review it shortly.",
        action: { label: "My Bookings", onClick: () => router.push("/dashboard/customer/bookings") },
      });
      setOpen(false);
      setForm({ phone: "", address: "", preferredDate: "", problemDescription: "" });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not send request");
    } finally {
      setLoading(false);
    }
  }

  const set = (k: keyof typeof form) => (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: ev.target.value }));

  return (
    <>
      <Button size="lg" variant="cta" className="w-full" onClick={() => setOpen(true)}>
        <Wrench /> Request Repair
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request repair</DialogTitle>
            <DialogDescription>{serviceTitle}</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" htmlFor="rq-name">
                <Input id="rq-name" value={user.name} readOnly />
              </Field>
              <Field label="Email" htmlFor="rq-email">
                <Input id="rq-email" value={user.email} readOnly />
              </Field>
            </div>
            <Field label="Phone" htmlFor="rq-phone" error={errors.phone}>
              <Input id="rq-phone" value={form.phone} onChange={set("phone")} placeholder="01XXXXXXXXX" inputMode="tel" />
            </Field>
            <Field label="Address" htmlFor="rq-address" error={errors.address}>
              <Input id="rq-address" value={form.address} onChange={set("address")} placeholder="House, road, area" />
            </Field>
            <Field label="Preferred date" htmlFor="rq-date" error={errors.preferredDate}>
              <Input id="rq-date" type="date" min={todayStr()} value={form.preferredDate} onChange={set("preferredDate")} />
            </Field>
            <Field label="Problem description" htmlFor="rq-problem" error={errors.problemDescription}>
              <Textarea
                id="rq-problem"
                value={form.problemDescription}
                onChange={set("problemDescription")}
                placeholder="What is wrong with the device? When did it start?"
              />
            </Field>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="animate-spin" />} Send request
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
