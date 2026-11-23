"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api, ApiError } from "@/lib/api";
import { money } from "@/lib/utils";

interface Payment {
  amount: number;
  transactionId: string;
  serviceTitle: string;
}


export function PaymentSuccess() {
  const sessionId = useSearchParams().get("session_id");
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  const [payment, setPayment] = useState<Payment | null>(null);
  const [message, setMessage] = useState("");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return; 
    started.current = true;
    if (!sessionId) {
      setState("error");
      setMessage("No payment session was found.");
      return;
    }
    api<Payment>("/api/payments/verify", { query: { session_id: sessionId } })
      .then((p) => {
        setPayment(p);
        setState("ok");
        toast.success("Payment successful");
      })
      .catch((e) => {
        setState("error");
        setMessage(e instanceof ApiError ? e.message : "We could not verify this payment.");
      });
  }, [sessionId]);

  return (
    <Card className="w-full max-w-md p-8 text-center">
      {state === "loading" && (
        <div role="status">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-accent" />
          <h1 className="mt-5 font-display text-2xl font-extrabold">Confirming your payment…</h1>
          <p className="mt-2 text-sm text-muted-foreground">Please do not close this page.</p>
        </div>
      )}
      {state === "ok" && payment && (
        <>
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15 text-green-600">
            <CheckCircle2 className="h-9 w-9" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-extrabold">Payment successful</h1>
          <p className="mt-1 text-sm text-muted-foreground">{payment.serviceTitle}</p>
          <dl className="mt-6 space-y-3 rounded-xl bg-muted p-4 text-left text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Amount paid</dt>
              <dd className="font-display text-lg font-extrabold">{money(payment.amount)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Transaction ID</dt>
              <dd className="break-all text-right font-mono text-xs">{payment.transactionId}</dd>
            </div>
          </dl>
          <Button asChild className="mt-6 w-full" size="lg">
            <Link href="/dashboard/customer/bookings">Back to My Bookings</Link>
          </Button>
        </>
      )}
      {state === "error" && (
        <>
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-9 w-9" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-extrabold">Could not confirm payment</h1>
          <p className="mt-2 text-sm text-muted-foreground">{message}</p>
          <Button asChild className="mt-6 w-full" size="lg">
            <Link href="/dashboard/customer/bookings">Back to My Bookings</Link>
          </Button>
        </>
      )}
    </Card>
  );
}
