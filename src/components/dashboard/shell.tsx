"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarCheck,
  ClipboardList,
  CreditCard,
  Home,
  LayoutDashboard,
  Menu,
  PlusCircle,
  Receipt,
  ShieldCheck,
  Users,
  UserCog,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { UserMenu } from "@/components/shared/user-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/constants";

type Item = { href: string; label: string; icon: LucideIcon };

const MENUS: Record<Role, Item[]> = {
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/customer/bookings", label: "My Bookings", icon: CalendarCheck },
    { href: "/dashboard/customer/payments", label: "Payment History", icon: CreditCard },
    { href: "/dashboard/profile", label: "Update Profile", icon: UserCog },
  ],
  technician: [
    { href: "/dashboard/technician", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/technician/add-service", label: "Add Service", icon: PlusCircle },
    { href: "/dashboard/technician/my-services", label: "My Services", icon: Wrench },
    { href: "/dashboard/technician/requests", label: "Manage Requests", icon: ClipboardList },
    { href: "/dashboard/profile", label: "Update Profile", icon: UserCog },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/services", label: "Service Approval", icon: ShieldCheck },
    { href: "/dashboard/admin/bookings", label: "All Bookings", icon: BarChart3 },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: Receipt },
    { href: "/dashboard/profile", label: "Update Profile", icon: UserCog },
  ],
};

const ROOTS = ["/dashboard/customer", "/dashboard/technician", "/dashboard/admin"];

export function DashboardShell({ role, children }: { role: Role; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const items = MENUS[role];


  const isActive = (href: string) => (ROOTS.includes(href) ? pathname === href : pathname.startsWith(href));

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Dashboard">
      {items.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          onClick={() => setOpen(false)}
          aria-current={isActive(it.href) ? "page" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
            isActive(it.href)
              ? "bg-accent text-accent-foreground"
              : "text-white/75 hover:bg-white/10 hover:text-white"
          )}
        >
          <it.icon className="h-[18px] w-[18px] shrink-0" />
          {it.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-ink lg:flex">
        <div className="flex h-16 items-center border-b border-white/10 px-5">
          <Logo light />
        </div>
        {nav}
      </aside>


      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <aside className="relative flex h-full w-72 max-w-[85%] flex-col bg-ink animate-in slide-in-from-left">
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
              <Logo light />
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => setOpen(false)} aria-label="Close menu">
                <X />
              </Button>
            </div>
            {nav}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b bg-background/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu />
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/"><Home /> Home</Link>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserMenu showName />
          </div>
        </header>
        <main className="w-full p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-extrabold sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
