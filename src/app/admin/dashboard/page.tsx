import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/header";
import { StatsCard } from "@/components/admin/stats-card";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import {
  Users, MessageSquare, FileText, Eye,
  TrendingUp, Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { DashboardChart } from "@/components/admin/dashboard-chart";

export default async function DashboardPage() {
  const [
    contactCount,
    demoCount,
    pageCount,
    blogCount,
    recentContacts,
    recentActivity,
    newsletterCount,
  ] = await Promise.all([
    prisma.contact.count(),
    prisma.contact.count({ where: { requestDemo: true } }),
    prisma.page.count(),
    prisma.blogPost.count({ where: { isPublished: true } }),
    prisma.contact.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { user: true },
    }),
    prisma.newsletterSubscriber.count({ where: { isActive: true } }),
  ]);

  return (
    <div>
      <AdminHeader title="Dashboard" />
      <div className="p-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Leads" value={contactCount} icon={MessageSquare} change="+12% this month" trend="up" />
          <StatsCard title="Demo Requests" value={demoCount} icon={Calendar} change="+8% this month" trend="up" />
          <StatsCard title="Published Pages" value={pageCount} icon={FileText} />
          <StatsCard title="Newsletter Subscribers" value={newsletterCount} icon={Users} change="+24 new" trend="up" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <DashboardChart />
          <div className="rounded-xl border border-slate-200/80 bg-white p-6">
            <h3 className="text-lg font-semibold text-[#0A1F78] mb-4">Quick Stats</h3>
            <div className="space-y-4">
              {[
                { label: "Published Blog Posts", value: blogCount, icon: FileText },
                { label: "Page Views (30d)", value: "12.4K", icon: Eye },
                { label: "Conversion Rate", value: "3.2%", icon: TrendingUp },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                  <div className="flex items-center gap-3">
                    <stat.icon className="h-4 w-4 text-[#2563EB]" />
                    <span className="text-sm text-slate-600">{stat.label}</span>
                  </div>
                  <span className="font-semibold text-[#0A1F78]">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold text-[#0A1F78] mb-4">Recent Leads</h3>
            <DataTable
              columns={[
                { key: "name", label: "Name" },
                { key: "email", label: "Email" },
                {
                  key: "requestDemo",
                  label: "Demo",
                  render: (item) => (
                    <Badge variant={item.requestDemo ? "success" : "outline"}>
                      {item.requestDemo ? "Yes" : "No"}
                    </Badge>
                  ),
                },
                {
                  key: "createdAt",
                  label: "Date",
                  render: (item) => format(new Date(item.createdAt), "MMM d"),
                },
              ]}
              data={recentContacts}
              emptyMessage="No leads yet"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#0A1F78] mb-4">Recent Activity</h3>
            <DataTable
              columns={[
                {
                  key: "action",
                  label: "Action",
                  render: (item) => (
                    <Badge variant="secondary">{item.action}</Badge>
                  ),
                },
                { key: "entity", label: "Entity" },
                {
                  key: "user",
                  label: "User",
                  render: (item) => item.user?.name || "System",
                },
                {
                  key: "createdAt",
                  label: "Time",
                  render: (item) => format(new Date(item.createdAt), "MMM d, HH:mm"),
                },
              ]}
              data={recentActivity}
              emptyMessage="No activity yet"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
