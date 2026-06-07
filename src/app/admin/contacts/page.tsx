import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/header";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { ContactActions } from "@/components/admin/contact-actions";
import { format } from "date-fns";

export default async function ContactsAdminPage() {
  const contacts = await prisma.contact.findMany({ orderBy: { createdAt: "desc" } });

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
      <div className="p-6">
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
