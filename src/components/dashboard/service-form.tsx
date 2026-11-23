"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { CATEGORIES, SERVICE_MODES } from "@/lib/constants";
import { uploadToImgBB } from "@/lib/imgbb";

export interface ServiceValues {
  title: string;
  category: string;
  description: string;
  basePrice: string;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
  image: string;
}

export const emptyService: ServiceValues = {
  title: "",
  category: "",
  description: "",
  basePrice: "",
  estimatedDuration: "",
  serviceMode: "",
  serviceArea: "",
  image: "",
};

type Errors = Partial<Record<keyof ServiceValues, string>>;

function validate(v: ServiceValues): Errors {
  const e: Errors = {};
  if (v.title.trim().length < 3) e.title = "Title must be at least 3 characters";
  if (!v.category) e.category = "Choose a category";
  if (v.description.trim().length < 10) e.description = "Description must be at least 10 characters";
  const price = Number(v.basePrice);
  if (!v.basePrice || !Number.isFinite(price) || price <= 0) e.basePrice = "Enter a positive price";
  if (!v.estimatedDuration.trim()) e.estimatedDuration = "Estimated duration is required";
  if (!v.serviceMode) e.serviceMode = "Choose a service mode";
  if (!v.serviceArea.trim()) e.serviceArea = "Service area is required";
  if (!v.image) e.image = "Upload a service image";
  return e;
}

export function ServiceForm({
  initial = emptyService,
  technician,
  submitLabel,
  onSubmit,
}: {
  initial?: ServiceValues;
  technician: { name: string; email: string };
  submitLabel: string;
  onSubmit: (v: ServiceValues) => Promise<void>;
}) {
  const [v, setV] = useState<ServiceValues>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof ServiceValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setV((p) => ({ ...p, [k]: e.target.value }));

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToImgBB(file);
      setV((p) => ({ ...p, image: url }));
      setErrors((p) => ({ ...p, image: undefined }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate(v);
    setErrors(e);
    if (Object.keys(e).length) return;
    setSaving(true);
    try {
      await onSubmit(v);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Technician name" htmlFor="sf-tn">
          <Input id="sf-tn" value={technician.name} readOnly />
        </Field>
        <Field label="Technician email" htmlFor="sf-te">
          <Input id="sf-te" value={technician.email} readOnly />
        </Field>
      </div>

      <Field label="Title" htmlFor="sf-title" error={errors.title}>
        <Input id="sf-title" value={v.title} onChange={set("title")} placeholder="e.g. iPhone Screen Replacement" />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Category" htmlFor="sf-cat" error={errors.category}>
          <Select id="sf-cat" value={v.category} onChange={set("category")}>
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </Select>
        </Field>
        <Field label="Service mode" htmlFor="sf-mode" error={errors.serviceMode}>
          <Select id="sf-mode" value={v.serviceMode} onChange={set("serviceMode")}>
            <option value="">Select a mode</option>
            {SERVICE_MODES.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Description" htmlFor="sf-desc" error={errors.description}>
        <Textarea id="sf-desc" value={v.description} onChange={set("description")} placeholder="What does this service include?" />
      </Field>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Base price (USD)" htmlFor="sf-price" error={errors.basePrice}>
          <Input id="sf-price" type="number" min="1" step="0.01" value={v.basePrice} onChange={set("basePrice")} placeholder="45" />
        </Field>
        <Field label="Estimated duration" htmlFor="sf-dur" error={errors.estimatedDuration}>
          <Input id="sf-dur" value={v.estimatedDuration} onChange={set("estimatedDuration")} placeholder="2-3 hours" />
        </Field>
        <Field label="Service area" htmlFor="sf-area" error={errors.serviceArea}>
          <Input id="sf-area" value={v.serviceArea} onChange={set("serviceArea")} placeholder="Dhanmondi, Dhaka" />
        </Field>
      </div>

      <Field label="Service image" htmlFor="sf-img" error={errors.image} hint="JPG or PNG, up to 5 MB. Uploaded to ImgBB.">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-24 w-36 items-center justify-center overflow-hidden rounded-lg border border-dashed bg-muted">
            {v.image ? (
              <img src={v.image} alt="Service preview" className="h-full w-full object-cover" />
            ) : (
              <ImagePlus className="h-7 w-7 text-muted-foreground" />
            )}
          </div>
          <input ref={fileRef} id="sf-img" type="file" accept="image/*" onChange={onFile} className="sr-only" />
          <Button type="button" variant="outline" disabled={uploading} onClick={() => fileRef.current?.click()}>
            {uploading ? <Loader2 className="animate-spin" /> : <ImagePlus />}
            {v.image ? "Change image" : "Choose image"}
          </Button>
        </div>
      </Field>

      <Button type="submit" size="lg" disabled={saving || uploading}>
        {saving && <Loader2 className="animate-spin" />} {submitLabel}
      </Button>
    </form>
  );
}
