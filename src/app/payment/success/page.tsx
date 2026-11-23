import { Suspense } from "react";
import type { Metadata } from "next";
import { PaymentSuccess } from "@/components/payment/payment-success";

export const metadata: Metadata = { title: "Payment" };

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <PaymentSuccess />
    </Suspense>
  );
}
