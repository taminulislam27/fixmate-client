"use client";

import { useState } from "react";
import { CalendarSearch, CreditCard, Loader2, MapPin, Route, Star, XCircle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/shell";
import { DataState } from "@/components/dashboard/data-state";
import { JobTimeline } from "@/components/dashboard/job-timeline";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Stars } from "@/components/shared/stars";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApi } from "@/hooks/use-api";
import { api, ApiError } from "@/lib/api";
import { cn, fmtDate, money } from "@/lib/utils";

interface Booking {
  _id: string;
  serviceTitle: string;
  serviceImage: string;
  category: string;
  technicianName: string;
  preferredDate: string;
  address: string;
  basePrice: number;
  finalAmount: number;
  status: string;
  paymentStatus: string;
  statusHistory: { status: string; changedAt: string }[];
  rating?: number;
  review?: string;
}

export default function MyBookingsPage() {
  const { data, loading, error, reload } = useApi<Booking[]>("/api/bookings/my");
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [track, setTrack] = useState<Booking | null>(null);
  const [reviewFor, setReviewFor] = useState<Booking | null>(null);

  async function confirmCancel() {
    if (!cancelId) return;
    setCancelling(true);
    try {
      await api(`/api/bookings/${cancelId}/cancel`, { method: "PATCH" });
      toast.success("Booking cancelled");
      setCancelId(null);
      reload();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Could not cancel booking");
    } finally {
      setCancelling(false);
    }
  }

  async function payNow(id: string) {
    setPayingId(id);
    try {
      const { url } = await api<{ url: string }>("/api/payments/create-checkout-session", {
        method: "POST",
        body: { bookingId: id },
      });
      window.location.href = url;
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Could not start payment");
      setPayingId(null);
    }
  }

  const amount = (b: Booking) => (b.status === "completed" || b.paymentStatus === "paid" ? b.finalAmount : b.basePrice);

  /** Buttons obey the brief: Cancel only when requested; Pay Now only when completed + unpaid; Paid badge otherwise. */
  const actions = (b: Booking) => (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" variant="outline" onClick={() => setTrack(b)}>
        <Route /> Track
      </Button>
      {b.status === "requested" && (
        <Button size="sm" variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive/10" onClick={() => setCancelId(b._id)}>
          <XCircle /> Cancel
        </Button>
      )}
      {b.status === "completed" && b.paymentStatus === "unpaid" && (
        <Button size="sm" variant="cta" disabled={payingId === b._id} onClick={() => payNow(b._id)}>
          {payingId === b._id ? <Loader2 className="animate-spin" /> : <CreditCard />} Pay Now
        </Button>
      )}
      {b.paymentStatus === "paid" && (
        <>
          <StatusBadge status="paid" />
          {!b.rating && (
            <Button size="sm" variant="secondary" onClick={() => setReviewFor(b)}>
              <Star /> Rate
            </Button>
          )}
        </>
      )}
    </div>
  );

  return (
    <>
      <PageHeader title="My Bookings" subtitle="Every repair request you have sent, and where each one stands." />
      <DataState loading={loading} error={error} onRetry={reload}>
        {data && data.length === 0 ? (
          <EmptyState
            icon={CalendarSearch}
            title="No bookings yet"
            message="When you request a repair it will show up here, with live status updates."
            ctaLabel="Browse services"
            ctaHref="/services"
          />
        ) : (
          data && (
            <>
              {/* Table on tablets and desktops */}
              <Card className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[860px] text-left text-sm">
                  <thead className="border-b bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Service</th>
                      <th className="px-4 py-3">Technician</th>
                      <th className="px-4 py-3">Preferred date</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Payment</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {data.map((b) => (
                      <tr key={b._id} className="align-middle">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={b.serviceImage} alt="" className="h-12 w-16 rounded-md object-cover" />
                            <div className="min-w-0">
                              <p className="max-w-[14rem] truncate font-semibold">{b.serviceTitle}</p>
                              <p className="text-xs text-muted-foreground">{b.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">{b.technicianName}</td>
                        <td className="whitespace-nowrap px-4 py-3">{fmtDate(b.preferredDate)}</td>
                        <td className="whitespace-nowrap px-4 py-3 font-semibold">{money(amount(b))}</td>
                        <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                        <td className="px-4 py-3"><StatusBadge status={b.paymentStatus} /></td>
                        <td className="px-4 py-3">{actions(b)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>

              {/* Cards on mobile */}
              <div className="space-y-4 md:hidden">
                {data.map((b) => (
                  <Card key={b._id} className="overflow-hidden">
                    <div className="flex gap-3 p-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={b.serviceImage} alt="" className="h-16 w-20 shrink-0 rounded-md object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display font-bold">{b.serviceTitle}</p>
                        <p className="text-xs text-muted-foreground">{b.technicianName}</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <StatusBadge status={b.status} />
                          <StatusBadge status={b.paymentStatus} />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t px-4 py-2.5 text-sm">
                      <span className="text-muted-foreground">{fmtDate(b.preferredDate)}</span>
                      <span className="font-bold">{money(amount(b))}</span>
                    </div>
                    <div className={cn("border-t bg-muted/30 px-4 py-3")}>{actions(b)}</div>
                  </Card>
                ))}
              </div>
            </>
          )
        )}
      </DataState>

      <ConfirmDialog
        open={!!cancelId}
        onOpenChange={(o) => !o && setCancelId(null)}
        title="Cancel this booking?"
        description="The technician will no longer see this request. This cannot be undone."
        confirmLabel="Yes, cancel booking"
        loading={cancelling}
        onConfirm={confirmCancel}
      />

      <Dialog open={!!track} onOpenChange={(o) => !o && setTrack(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Job tracker</DialogTitle>
            <DialogDescription>{track?.serviceTitle}</DialogDescription>
          </DialogHeader>
          {track && (
            <>
              <p className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {track.address}
              </p>
              <JobTimeline history={track.statusHistory} status={track.status} />
              {track.rating ? (
                <div className="rounded-lg bg-muted p-3 text-sm">
                  <Stars value={track.rating} count={1} />
                  {track.review && <p className="mt-1 text-muted-foreground">{track.review}</p>}
                </div>
              ) : null}
            </>
          )}
        </DialogContent>
      </Dialog>

      <ReviewDialog
        booking={reviewFor}
        onClose={() => setReviewFor(null)}
        onDone={() => {
          setReviewFor(null);
          reload();
        }}
      />
    </>
  );
}

function ReviewDialog({ booking, onClose, onDone }: { booking: Booking | null; onClose: () => void; onDone: () => void }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!booking) return;
    if (!rating) return void toast.error("Please choose a star rating");
    setSaving(true);
    try {
      await api(`/api/bookings/${booking._id}/review`, { method: "POST", body: { rating, review: text } });
      toast.success("Thanks for your review!");
      setRating(0);
      setText("");
      onDone();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Could not save review");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={!!booking} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rate this repair</DialogTitle>
          <DialogDescription>{booking?.serviceTitle}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(n)}
              className="rounded p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Star className={cn("h-9 w-9 transition-colors", n <= (hover || rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40")} />
            </button>
          ))}
        </div>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={500} placeholder="Share a few words about the work (optional)" />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Not now</Button>
          <Button onClick={submit} disabled={saving}>
            {saving && <Loader2 className="animate-spin" />} Submit review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
