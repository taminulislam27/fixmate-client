"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, UserCog } from "lucide-react";
import { toast } from "sonner";
import { signOut, useSession } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";
import { dashboardPath } from "@/lib/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "./avatar";

const ROLE_LABEL: Record<string, string> = { customer: "Customer", technician: "Technician", admin: "Admin" };

/** Avatar + dropdown (name, role badge, Dashboard, Update Profile, Sign Out). Used in navbar and dashboard top bar. */
export function UserMenu({ showName = false }: { showName?: boolean }) {
  const { data } = useSession();
  const router = useRouter();
  const user = data?.user as
    | { name: string; email: string; image?: string | null; role?: string }
    | undefined;
  if (!user) return null;
  const role = user.role || "customer";

  async function handleSignOut() {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          clearToken();
          toast.success("Signed out successfully");
          router.push("/");
          router.refresh();
        },
      },
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Open user menu">
        <Avatar name={user.name} src={user.image} />
        {showName && (
          <span className="hidden text-left leading-tight sm:block">
            <span className="block max-w-[9rem] truncate text-sm font-semibold">{user.name}</span>
            <span className="block text-xs capitalize text-muted-foreground">{role}</span>
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <p className="truncate text-sm font-bold">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          <span className="mt-2 inline-block rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-bold text-accent">
            {ROLE_LABEL[role]}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={dashboardPath(role)}>
            <LayoutDashboard /> Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile">
            <UserCog /> Update Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleSignOut} className="text-destructive focus:text-destructive">
          <LogOut /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
