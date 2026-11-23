"use client";

import { Users } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/shell";
import { DataState } from "@/components/dashboard/data-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Avatar } from "@/components/shared/avatar";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/input";
import { useApi } from "@/hooks/use-api";
import { api, ApiError } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { fmtDate } from "@/lib/utils";

interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
  createdAt?: string;
}

export default function ManageUsersPage() {
  const { data: session } = useSession();
  const { data, setData, loading, error, reload } = useApi<User[]>("/api/admin/users");
  const meEmail = session?.user?.email;

  async function changeRole(u: User, role: string) {
    const before = u.role;
    setData((d) => d && d.map((x) => (x._id === u._id ? { ...x, role } : x)));
    try {
      await api(`/api/admin/users/${u._id}/role`, { method: "PATCH", body: { role } });
      toast.success(`${u.name} is now a ${role}`);
    } catch (e) {
      setData((d) => d && d.map((x) => (x._id === u._id ? { ...x, role: before } : x)));
      toast.error(e instanceof ApiError ? e.message : "Could not change role");
    }
  }

  return (
    <>
      <PageHeader title="Manage Users" subtitle="Everyone registered on FixMate. You cannot change your own role." />
      <DataState loading={loading} error={error} onRetry={reload}>
        {data && data.length === 0 ? (
          <EmptyState icon={Users} title="No users yet" message="Registered users will appear here." />
        ) : (
          data && (
            <Card className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Joined</th>
                    <th className="px-4 py-3">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.map((u) => {
                    const isMe = u.email === meEmail;
                    return (
                      <tr key={u._id}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar name={u.name} src={u.image} />
                            <span className="font-semibold">{u.name}{isMe && <span className="ml-2 text-xs font-medium text-muted-foreground">(you)</span>}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                        <td className="whitespace-nowrap px-4 py-3">{fmtDate(u.createdAt)}</td>
                        <td className="px-4 py-3">
                          <label className="sr-only" htmlFor={`role-${u._id}`}>Role for {u.name}</label>
                          <Select
                            id={`role-${u._id}`}
                            className="h-9 w-36"
                            value={u.role}
                            disabled={isMe}
                            onChange={(e) => changeRole(u, e.target.value)}
                          >
                            <option value="customer">Customer</option>
                            <option value="technician">Technician</option>
                            <option value="admin">Admin</option>
                          </Select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          )
        )}
      </DataState>
    </>
  );
}
