import Link from "next/link";
import { XCircle } from "lucide-react";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Payment cancelled" };

export default function CancelPage() {
  return (
    <Card className="w-full max-w-md p-8 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/15 text-amber-600">
        <XCircle className="h-9 w-9" />
      </span>
      <h1 className="mt-5 font-display text-2xl font-extrabold">Payment cancelled</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        No money was taken and your booking is unchanged. You can pay whenever you are ready.
      </p>
      <Button asChild className="mt-6 w-full" size="lg">
        <Link href="/dashboard/customer/bookings">Try Again</Link>
      </Button>
    </Card>
  );
}
