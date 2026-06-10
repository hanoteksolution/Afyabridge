"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Trash2,
  Pencil,
  X,
  Sparkles,
  Search,
  Loader2,
  Save,
  Shield,
  Users,
  Mail,
  User as UserIcon,
} from "lucide-react";
import {
  createUser,
  updateUser,
  deleteUser,
  toggleUserActive,
} from "@/actions/users";
import { toast } from "sonner";
import { AdminStatsRow } from "@/components/admin/admin-stats-row";
import { adminFieldClass } from "@/components/admin/admin-form-panel";
import { cn } from "@/lib/utils";

export type UserRow = {
  id: string;
  name: string | null;
  email: string;
  roleId: string;
  role: { id: string; name: string; slug: string };
  isActive: boolean;
  createdAt: string;
};

export type RoleOption = {
  id: string;
  name: string;
  slug: string;
};

type UserForm = {
  name: string;
  email: string;
  password: string;
  roleId: string;
  isActive: boolean;
};

type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

function initials(name: string | null, email: string) {
  const source = name?.trim() || email;
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

function roleBadgeClass(slug: string) {
  if (slug === "super-admin") return "bg-[#0A1F78]/10 text-[#0A1F78]";
  if (slug === "editor") return "bg-violet-50 text-violet-700";
  return "bg-slate-100 text-slate-600";
}

function UserFormPanel({
  form,
  setForm,
  roles,
  creating,
  saving,
  onSave,
  onClose,
}: {
  form: UserForm;
  setForm: (f: UserForm) => void;
  roles: RoleOption[];
  creating: boolean;
  saving: boolean;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="overflow-hidden rounded-2xl border border-[#2563EB]/25 bg-white shadow-lg shadow-[#0A1F78]/8"
    >
      <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-indigo-50/80 to-blue-50/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0A1F78] to-[#2563EB] text-white shadow-md">
            <UserIcon className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-semibold text-[#0A1F78]">
              {creating ? "New user" : "Edit user"}
            </h4>
            <p className="text-xs text-slate-500">
              Account details, role, and access status
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-lg">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6 p-6">
        <div className="rounded-2xl border border-slate-200/70 bg-slate-50/40 p-5">
          <h5 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Profile
          </h5>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-slate-700">Full name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={adminFieldClass}
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <Label className="text-slate-700">Email *</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={adminFieldClass}
                placeholder="jane@afyabridge.com"
              />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-slate-700">
                Password {creating ? "*" : "(leave blank to keep current)"}
              </Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={adminFieldClass}
                placeholder={creating ? "Minimum 6 characters" : "••••••••"}
                autoComplete="new-password"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
          <h5 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Access & role
          </h5>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-slate-700">Role *</Label>
              <select
                value={form.roleId}
                onChange={(e) => setForm({ ...form, roleId: e.target.value })}
                className={cn(
                  adminFieldClass,
                  "h-10 w-full cursor-pointer bg-white"
                )}
              >
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <div className="flex w-full items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-3.5">
                <div>
                  <p className="text-sm font-medium text-slate-800">Active account</p>
                  <p className="text-xs text-slate-500">User can sign in when active</p>
                </div>
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(v) => setForm({ ...form, isActive: v })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
        <p className="text-xs text-slate-500">
          {creating
            ? "The user will receive these credentials to sign in"
            : "Save to update this user account"}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={saving}
            className="rounded-xl bg-gradient-to-r from-[#0A1F78] to-[#2563EB] shadow-md"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {creating ? "Create user" : "Save changes"}
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function UsersAdminView({
  users: initial,
  roles,
  currentUserId,
}: {
  users: UserRow[];
  roles: RoleOption[];
  currentUserId: string;
}) {
  const [users, setUsers] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<UserForm>({
    name: "",
    email: "",
    password: "",
    roleId: roles[0]?.id ?? "",
    isActive: true,
  });
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((user) => {
      const matchesQuery =
        !q ||
        user.name?.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.role.name.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && user.isActive) ||
        (statusFilter === "INACTIVE" && !user.isActive);

      return matchesQuery && matchesStatus;
    });
  }, [users, query, statusFilter]);

  const activeCount = users.filter((u) => u.isActive).length;
  const adminCount = users.filter(
    (u) => u.role.slug === "super-admin" || u.role.slug === "admin"
  ).length;

  const defaultRoleId = roles[0]?.id ?? "";

  function openNew() {
    setForm({
      name: "",
      email: "",
      password: "",
      roleId: defaultRoleId,
      isActive: true,
    });
    setCreating(true);
    setEditing(null);
  }

  function openEdit(user: UserRow) {
    setForm({
      name: user.name || "",
      email: user.email,
      password: "",
      roleId: user.roleId,
      isActive: user.isActive,
    });
    setEditing(user.id);
    setCreating(false);
  }

  function closeForm() {
    setCreating(false);
    setEditing(null);
    setForm({
      name: "",
      email: "",
      password: "",
      roleId: defaultRoleId,
      isActive: true,
    });
  }

  function toRow(user: {
    id: string;
    name: string | null;
    email: string;
    roleId: string;
    isActive: boolean;
    createdAt: Date;
    role: { id: string; name: string; slug: string };
  }): UserRow {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
    };
  }

  async function handleSave() {
    setSaving(true);
    const res = creating
      ? await createUser(form)
      : await updateUser(editing!, form);
    setSaving(false);

    if (res.success && res.user) {
      const row = toRow(res.user);
      if (creating) setUsers((list) => [row, ...list]);
      else setUsers((list) => list.map((u) => (u.id === editing ? row : u)));
      toast.success(creating ? "User created" : "User updated");
      closeForm();
    } else {
      toast.error(res.error || "Failed to save user");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    const res = await deleteUser(id);
    if (res.success) {
      setUsers((list) => list.filter((u) => u.id !== id));
      if (editing === id) closeForm();
      toast.success("User deleted");
    } else {
      toast.error(res.error || "Failed to delete user");
    }
  }

  async function handleToggleActive(user: UserRow) {
    const next = !user.isActive;
    const res = await toggleUserActive(user.id, next);
    if (res.success && res.user) {
      setUsers((list) =>
        list.map((u) =>
          u.id === user.id ? { ...u, isActive: next } : u
        )
      );
      toast.success(next ? "User activated" : "User deactivated");
    } else {
      toast.error(res.error || "Failed to update status");
    }
  }

  const statusFilters: { id: StatusFilter; label: string }[] = [
    { id: "ALL", label: "All users" },
    { id: "ACTIVE", label: "Active" },
    { id: "INACTIVE", label: "Inactive" },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-[#0A1F78]/10 bg-gradient-to-br from-[#0A1F78] via-[#1e40af] to-[#2563EB] p-6 text-white shadow-lg shadow-[#0A1F78]/15 sm:p-7"
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
              <Sparkles className="h-3.5 w-3.5 text-[#00C2FF]" />
              Team access
            </div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Users
            </h2>
            <p className="mt-1.5 max-w-xl text-sm text-white/75">
              Create admin accounts, assign roles, and control who can access
              the dashboard.
            </p>
          </div>
          <Button
            onClick={openNew}
            size="lg"
            className="h-11 shrink-0 rounded-xl bg-white text-[#0A1F78] shadow-md hover:bg-white/95"
          >
            <Plus className="h-4 w-4" />
            Add user
          </Button>
        </div>
      </motion.div>

      <AdminStatsRow
        stats={[
          { title: "Total users", value: users.length, icon: "Users", variant: "indigo" },
          { title: "Active", value: activeCount, icon: "CheckCircle2", variant: "emerald" },
          { title: "Inactive", value: users.length - activeCount, icon: "EyeOff", variant: "amber" },
          { title: "Admins", value: adminCount, icon: "Shield", variant: "blue" },
        ]}
      />

      <AnimatePresence mode="wait">
        {(creating || editing) && (
          <UserFormPanel
            key={creating ? "create" : editing}
            form={form}
            setForm={setForm}
            roles={roles}
            creating={creating}
            saving={saving}
            onSave={handleSave}
            onClose={closeForm}
          />
        )}
      </AnimatePresence>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm"
      >
        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 lg:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#0A1F78] to-[#2563EB] text-white shadow-md">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[#0A1F78]">Team directory</h3>
                <p className="text-sm text-slate-500">
                  {filtered.length} of {users.length} users
                </p>
              </div>
            </div>
            <div className="relative w-full lg:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, email, role..."
                className="h-10 rounded-xl border-slate-200/80 bg-slate-50/50 pl-9 focus-visible:bg-white"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {statusFilters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setStatusFilter(f.id)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  statusFilter === f.id
                    ? "bg-[#0A1F78] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0A1F78]/5">
              <Users className="h-6 w-6 text-[#2563EB]" />
            </div>
            <p className="font-medium text-slate-700">No users found</p>
            <p className="mt-1 text-sm text-slate-500">
              {query || statusFilter !== "ALL"
                ? "Try adjusting your search or filters"
                : "Add your first team member to get started"}
            </p>
            {!query && statusFilter === "ALL" && (
              <Button onClick={openNew} className="mt-5 rounded-xl">
                <Plus className="h-4 w-4" />
                Add user
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {["User", "Role", "Status", "Joined", ""].map((label) => (
                    <th
                      key={label || "actions"}
                      className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, index) => {
                  const isSelf = user.id === currentUserId;
                  const isActive = editing === user.id;

                  return (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={cn(
                        "group border-b border-slate-50 transition-colors hover:bg-[#0A1F78]/[0.025]",
                        isActive && "bg-blue-50/40",
                        !user.isActive && "opacity-80"
                      )}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0A1F78] to-[#2563EB] text-xs font-bold text-white shadow-sm">
                            {initials(user.name, user.email)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-medium text-slate-900">
                                {user.name || "Unnamed user"}
                              </p>
                              {isSelf && (
                                <span className="rounded-full bg-cyan-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cyan-700">
                                  You
                                </span>
                              )}
                            </div>
                            <p className="flex items-center gap-1 truncate text-xs text-slate-500">
                              <Mail className="h-3 w-3 shrink-0" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium",
                            roleBadgeClass(user.role.slug)
                          )}
                        >
                          <Shield className="h-3 w-3" />
                          {user.role.name}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={user.isActive}
                            disabled={isSelf}
                            onCheckedChange={() => handleToggleActive(user)}
                          />
                          <span
                            className={cn(
                              "text-xs font-medium",
                              user.isActive ? "text-emerald-600" : "text-slate-400"
                            )}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {format(new Date(user.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 rounded-lg text-[#2563EB] hover:bg-[#2563EB]/10 hover:text-[#0A1F78]"
                            onClick={() => openEdit(user)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-30"
                            disabled={isSelf}
                            onClick={() => handleDelete(user.id)}
                            title={isSelf ? "Cannot delete yourself" : "Delete user"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.section>
    </div>
  );
}
