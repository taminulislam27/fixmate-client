"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/shell";
import { Avatar } from "@/components/shared/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { authClient, useSession } from "@/lib/auth-client";
import { uploadToImgBB } from "@/lib/imgbb";

export default function ProfilePage() {
  const { data, isPending } = useSession();
  const user = data?.user as
    | { name: string; email: string; image?: string | null; role?: string; phone?: string; area?: string; bio?: string }
    | undefined;

  const [form, setForm] = useState({ name: "", phone: "", area: "", bio: "", image: "" });
  const [nameErr, setNameErr] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        area: user.area || "",
        bio: user.bio || "",
        image: user.image || "",
      });
    }

  }, [user?.email, isPending]);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToImgBB(file);
      setForm((f) => ({ ...f, image: url }));
      toast.success("Photo uploaded. Remember to save your changes.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (form.name.trim().length < 2) return void setNameErr("Name must be at least 2 characters");
    setNameErr("");
    setSaving(true);

    const { error } = await authClient.updateUser({
      name: form.name.trim(),
      image: form.image || undefined,
      phone: form.phone.trim(),
      area: form.area.trim(),
      bio: form.bio.trim(),
    });
    setSaving(false);
    if (error) return void toast.error(error.message || "Could not update profile");
    toast.success("Profile updated");
  }

  if (isPending || !user) {
    return (
      <>
        <PageHeader title="Update Profile" />
        <div className="h-96 max-w-3xl animate-pulse rounded-xl bg-muted" />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Update Profile" subtitle="Your name and photo update everywhere instantly." />
      <Card className="max-w-3xl p-6">
        <form onSubmit={onSubmit} className="space-y-6" noValidate>
          <div className="flex flex-wrap items-center gap-5">
            <Avatar name={form.name} src={form.image} className="h-20 w-20 text-2xl" />
            <div>
              <input ref={fileRef} id="pf-photo" type="file" accept="image/*" onChange={onFile} className="sr-only" />
              <Button type="button" variant="outline" disabled={uploading} onClick={() => fileRef.current?.click()}>
                {uploading ? <Loader2 className="animate-spin" /> : <Camera />} Change photo
              </Button>
              <p className="mt-1.5 text-xs text-muted-foreground">JPG or PNG up to 5 MB, uploaded to ImgBB.</p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" htmlFor="pf-name" error={nameErr}>
              <Input id="pf-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Phone" htmlFor="pf-phone">
              <Input id="pf-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="01XXXXXXXXX" inputMode="tel" />
            </Field>
            <Field label="Email" htmlFor="pf-email" hint="Email cannot be changed">
              <Input id="pf-email" value={user.email} readOnly />
            </Field>
            <Field label="Role" htmlFor="pf-role" hint="Roles are managed by an admin">
              <Input id="pf-role" value={(user.role || "customer").replace(/^\w/, (c) => c.toUpperCase())} readOnly />
            </Field>
          </div>

          <Field label="Area" htmlFor="pf-area">
            <Input id="pf-area" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="e.g. Mirpur, Dhaka" />
          </Field>
          <Field label="Bio" htmlFor="pf-bio" hint={user.role === "technician" ? "Customers see this on your service pages: skills and experience." : "A short note about you."}>
            <Textarea id="pf-bio" maxLength={400} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </Field>

          <Button type="submit" size="lg" disabled={saving || uploading}>
            {saving && <Loader2 className="animate-spin" />} Save changes
          </Button>
        </form>
      </Card>
    </>
  );
}
