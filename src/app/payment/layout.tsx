import { Footer } from "@/components/public/footer";
import { Navbar } from "@/components/public/navbar";
import { requireRole } from "@/lib/session";

export default async function PaymentLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["customer"]);
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-16">{children}</main>
      <Footer />
    </div>
  );
}
