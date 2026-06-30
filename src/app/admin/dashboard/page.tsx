import Link from "next/link";
import { AdminHeader } from "@/components/admin/header";
import { AdminStatsRow } from "@/components/admin/admin-stats-row";
import { DataTable } from "@/components/admin/data-table";
import { format } from "date-fns";
import { DashboardWelcome } from "@/components/admin/dashboard-welcome";
import { DashboardPanel } from "@/components/admin/dashboard-panel";
import { DashboardQuickActions } from "@/components/admin/dashboard-quick-actions";
import { dbBatch } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await auth();

  const [
    contactCount,
    pageCount,
    blogCount,
    draftCount,
    recentContacts,
    recentPosts,
  ] = await dbBatch(
    (prisma) => prisma.contact.count(),
    (prisma) => prisma.page.count({ where: { isPublished: true } }),
    (prisma) => prisma.blogPost.count({ where: { isPublished: true } }),
    (prisma) => prisma.blogPost.count({ where: { isPublished: false } }),
    (prisma) =>
      prisma.contact.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    (prisma) =>
      prisma.blogPost.findMany({
        where: { isPublished: true },
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: { id: true, title: true, slug: true, updatedAt: true },
      })
  );

  const newMessages = recentContacts.filter((c) => c.status === "NEW").length;

  return (
    <div className="min-h-screen">
      <AdminHeader title="Dashboard" />
      <div className="space-y-8 p-6 lg:p-8">
        <DashboardWelcome
          name={session?.user?.name}
          pageCount={pageCount}
          postCount={blogCount}
          messageCount={contactCount}
        />

        <AdminStatsRow
          stats={[
            {
              title: "Published pages",
              value: pageCount,
              icon: "FileText",
              variant: "indigo",
            },
            {
              title: "Published posts",
              value: blogCount,
              icon: "BookOpen",
              variant: "blue",
              change: draftCount > 0 ? `${draftCount} drafts` : undefined,
              trend: "neutral",
            },
            {
              title: "Messages",
              value: contactCount,
              icon: "MessageSquare",
              variant: "cyan",
              change: newMessages > 0 ? `${newMessages} new` : undefined,
              trend: newMessages > 0 ? "up" : "neutral",
            },
            {
              title: "Draft posts",
              value: draftCount,
              icon: "Clock",
              variant: "amber",
            },
          ]}
        />

        <DashboardPanel
          title="Quick actions"
          description="Jump to the tools you use most"
          delay={0.08}
        >
          <DashboardQuickActions />
        </DashboardPanel>

        <div className="grid gap-6 lg:grid-cols-2">
          <DashboardPanel
            title="Recent messages"
            description="Latest contact form submissions"
            delay={0.12}
            action={
              <Button variant="ghost" size="sm" asChild className="text-[#2563EB]">
                <Link href="/admin/contacts">View all</Link>
              </Button>
            }
          >
            <DataTable
              columns={[
                { key: "name", label: "Name" },
                { key: "email", label: "Email" },
                {
                  key: "createdAt",
                  label: "Date",
                  render: (item) => format(new Date(item.createdAt), "MMM d"),
                },
              ]}
              data={recentContacts}
              emptyMessage="No messages yet"
            />
          </DashboardPanel>

          <DashboardPanel
            title="Recent posts"
            description="Latest published articles"
            delay={0.16}
            action={
              <Button variant="ghost" size="sm" asChild className="text-[#2563EB]">
                <Link href="/admin/blogs">View all</Link>
              </Button>
            }
          >
            <DataTable
              columns={[
                { key: "title", label: "Title" },
                {
                  key: "updatedAt",
                  label: "Updated",
                  render: (item) => format(new Date(item.updatedAt), "MMM d"),
                },
                {
                  key: "slug",
                  label: "",
                  render: (item) => (
                    <Link
                      href={`/admin/blogs/${item.id}`}
                      className="text-sm font-medium text-[#2563EB] hover:underline"
                    >
                      Edit
                    </Link>
                  ),
                },
              ]}
              data={recentPosts}
              emptyMessage="No posts yet — write your first post"
            />
            <div className="mt-4">
              <Button size="sm" asChild>
                <Link href="/admin/blogs/new">Add new post</Link>
              </Button>
            </div>
          </DashboardPanel>
        </div>
      </div>
    </div>
  );
}
