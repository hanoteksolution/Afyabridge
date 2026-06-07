"use client";

import { updateContactStatus } from "@/actions/admin";
import { toast } from "sonner";

const statuses = ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "CLOSED"] as const;

export function ContactActions({
  contactId,
  currentStatus,
}: {
  contactId: string;
  currentStatus: string;
}) {
  async function handleStatusChange(status: typeof statuses[number]) {
    await updateContactStatus(contactId, status);
    toast.success(`Status updated to ${status}`);
  }

  return (
    <select
      value={currentStatus}
      onChange={(e) => handleStatusChange(e.target.value as typeof statuses[number])}
      className="rounded-md border border-slate-200 px-2 py-1 text-xs"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
