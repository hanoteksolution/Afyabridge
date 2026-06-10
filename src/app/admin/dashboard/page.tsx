import { AdminHeader } from "@/components/admin/header";
import { AdminStatsRow } from "@/components/admin/admin-stats-row";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { DashboardChart } from "@/components/admin/dashboard-chart";
import { DashboardWelcome } from "@/components/admin/dashboard-welcome";
import { DashboardQuickStats } from "@/components/admin/dashboard-quick-stats";
import { DashboardPanel } from "@/components/admin/dashboard-panel";
import { withDbRetry } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();

  const [
    contactCount,
    demoCount,
    pageCount,
    blogCount,
    recentContacts,
    recentActivity,
    newsletterCount,
  ] = await withDbRetry((prisma) =>
    Promise.all([
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
    ])
  );

  return (
    <div className="min-h-screen">
      <AdminHeader title="Dashboard" />
      <div className="space-y-6 p-6 lg:p-8">
        <DashboardWelcome
          name={session?.user?.name}
          leadCount={contactCount}
          pageCount={pageCount}
        />

        <AdminStatsRow
          stats={[
            {
              title: "Total Leads",
              value: contactCount,
              icon: "MessageSquare",
              change: "+12% this month",
              trend: "up",
              variant: "blue",
            },
            {
              title: "Demo Requests",
              value: demoCount,
              icon: "Calendar",
              change: "+8% this month",
              trend: "up",
              variant: "cyan",
            },
            {
              title: "Published Pages",
              value: pageCount,
              icon: "FileText",
              variant: "indigo",
            },
            {
              title: "Newsletter Subscribers",
              value: newsletterCount,
              icon: "Users",
              change: "+24 new",
              trend: "up",
              variant: "emerald",
            },
          ]}
        />

        <div className="grid gap-6 xl:grid-cols-5">
          <div className="xl:col-span-3">
            <DashboardChart />
          </div>
          <div className="xl:col-span-2">
            <DashboardPanel
              title="Quick Stats"
              description="Content and engagement snapshot"
              delay={0.28}
            >
              <DashboardQuickStats
                stats={[
                  { label: "Published Blog Posts", value: blogCount, icon: "FileText" },
                  { label: "Page Views (30d)", value: "12.4K", icon: "Eye" },
                  { label: "Conversion Rate", value: "3.2%", icon: "TrendingUp" },
                ]}
              />
            </DashboardPanel>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <DashboardPanel
            title="Recent Leads"
            description="Latest inbound contact submissions"
            delay={0.36}
          >
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
          </DashboardPanel>

          <DashboardPanel
            title="Recent Activity"
            description="Latest CMS changes across your workspace"
            delay={0.42}
          >
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
                  render: (item) =>
                    format(new Date(item.createdAt), "MMM d, HH:mm"),
                },
              ]}
              data={recentActivity}
              emptyMessage="No activity yet"
            />
          </DashboardPanel>
        </div>
      </div>
    </div>
  );
}
