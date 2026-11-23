"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { STATUS_LABELS } from "@/lib/constants";


const STATUS_COLORS: Record<string, string> = {
  requested: "#3b82f6",
  accepted: "#6366f1",
  "in-progress": "#f59e0b",
  completed: "#22c55e",
  rejected: "#ef4444",
  cancelled: "#94a3b8",
};
const PALETTE = ["#0e5a6b", "#f97316", "#3b82f6", "#22c55e", "#a855f7", "#eab308", "#14b8a6"];

const tooltipStyle = {
  borderRadius: 10,
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--card))",
  color: "hsl(var(--foreground))",
  fontSize: 12,
};

export function ChartCard({ title, children, empty }: { title: string; children: React.ReactNode; empty?: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          {empty ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No data to show yet</div>
          ) : (
            children
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function StatusBarChart({ data, title = "Jobs by status" }: { data: Record<string, number>; title?: string }) {
  const rows = Object.entries(data).map(([k, v]) => ({ key: k, name: STATUS_LABELS[k] || k, value: v }));
  return (
    <ChartCard title={title} empty={!rows.length}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--muted))" }} />
          <Bar dataKey="value" name="Jobs" radius={[6, 6, 0, 0]}>
            {rows.map((r) => (
              <Cell key={r.key} fill={STATUS_COLORS[r.key] || "#0e5a6b"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function CategoryPieChart({ data, title = "Services by category" }: { data: Record<string, number>; title?: string }) {
  const rows = Object.entries(data).map(([name, value]) => ({ name, value }));
  return (
    <ChartCard title={title} empty={!rows.length}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={rows} dataKey="value" nameKey="name" innerRadius={52} outerRadius={88} paddingAngle={2}>
            {rows.map((_, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function RevenueAreaChart({ data, title = "Revenue by day" }: { data: Record<string, number>; title?: string }) {
  const rows = Object.entries(data)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, value]) => ({ day: day.slice(5), value }));
  return (
    <ChartCard title={title} empty={!rows.length}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={rows} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v}`, "Revenue"]} />
          <Area type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2.5} fill="url(#rev)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
