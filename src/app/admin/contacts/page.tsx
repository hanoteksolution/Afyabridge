import { AdminHeader } from "@/components/admin/header";
import { AdminStatsRow } from "@/components/admin/admin-stats-row";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { ContactActions } from "@/components/admin/contact-actions";
import { format } from "date-fns";
import { withDbRetry } from "@/lib/prisma";

export default async function ContactsAdminPage() {
  const contacts = await withDbRetry((prisma) =>
    prisma.contact.findMany({ orderBy: { createdAt: "desc" } })
  );

  const demoCount = contacts.filter((c) => c.requestDemo).length;
  const newCount = contacts.filter((c) => c.status === "NEW").length;
  const convertedCount = contacts.filter((c) => c.status === "CONVERTED").length;

  const statusColors: Record<string, "default" | "secondary" | "success" | "accent" | "outline"> = {
    NEW: "accent",
    CONTACTED: "secondary",
    QUALIFIED: "default",
    CONVERTED: "success",
    CLOSED: "outline",
  };

  return (
    <div>
      <AdminHeader title="Leads & Contacts" />
      <div className="space-y-6 p-6 lg:p-8">
        <AdminStatsRow
          stats={[
            { title: "Total leads", value: contacts.length, icon: "MessageSquare", variant: "blue" },
            { title: "Demo requests", value: demoCount, icon: "Calendar", variant: "cyan" },
            { title: "New leads", value: newCount, icon: "Mail", variant: "amber" },
            { title: "Converted", value: convertedCount, icon: "CheckCircle2", variant: "emerald" },
          ]}
        />
        <DataTable
          columns={[
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "facilityName", label: "Facility" },
            { key: "country", label: "Country" },
            {
              key: "requestDemo",
              label: "Demo",
              render: (c) => <Badge variant={c.requestDemo ? "success" : "outline"}>{c.requestDemo ? "Yes" : "No"}</Badge>,
            },
            {
              key: "status",
              label: "Status",
              render: (c) => <Badge variant={statusColors[c.status]}>{c.status}</Badge>,
            },
            {
              key: "createdAt",
              label: "Date",
              render: (c) => format(new Date(c.createdAt), "MMM d, yyyy"),
            },
            {
              key: "actions",
              label: "Actions",
              render: (c) => <ContactActions contactId={c.id} currentStatus={c.status} />,
            },
          ]}
          data={contacts}
          emptyMessage="No contact submissions yet"
        />
      </div>
    </div>
  );
}
