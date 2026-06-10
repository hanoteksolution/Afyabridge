"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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
  ShieldCheck,
  Lock,
  Users,
  Check,
} from "lucide-react";
import { createRole, updateRole, deleteRole } from "@/actions/roles";
import { toast } from "sonner";
import { AdminStatsRow } from "@/components/admin/admin-stats-row";
import {
  adminFieldClass,
  adminTextareaClass,
} from "@/components/admin/admin-form-panel";
import {
  groupPermissions,
  permissionLabel,
} from "@/lib/permission-meta";
import { ADMIN_PERMISSIONS, type Permission } from "@/lib/constants";
import { cn } from "@/lib/utils";

export type RoleRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  permissions: Permission[];
  userCount: number;
};

type RoleForm = {
  name: string;
  slug: string;
  description: string;
  permissions: Permission[];
};

const PROTECTED_SLUGS = new Set(["super-admin"]);
const permissionGroups = groupPermissions();
const allPermissions = [...ADMIN_PERMISSIONS];

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function roleBadgeClass(slug: string) {
  if (slug === "super-admin") return "from-[#0A1F78] to-[#3730a3]";
  if (slug === "editor") return "from-violet-600 to-purple-600";
  return "from-slate-600 to-slate-700";
}

function PermissionsEditor({
  selected,
  onChange,
}: {
  selected: Permission[];
  onChange: (perms: Permission[]) => void;
}) {
  const selectedSet = new Set(selected);

  function toggle(permission: Permission) {
    const next = new Set(selectedSet);
    if (next.has(permission)) next.delete(permission);
    else next.add(permission);
    onChange(allPermissions.filter((p) => next.has(p)));
  }

  function toggleGroup(perms: Permission[], enable: boolean) {
    const next = new Set(selectedSet);
    for (const p of perms) {
      if (enable) next.add(p);
      else next.delete(p);
    }
    onChange(allPermissions.filter((p) => next.has(p)));
  }

  function selectAll() {
    onChange([...allPermissions]);
  }

  function clearAll() {
    onChange([]);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-600">
          {selected.length} of {allPermissions.length} permissions selected
        </p>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" className="h-8 rounded-lg" onClick={selectAll}>
            Select all
          </Button>
          <Button type="button" variant="outline" size="sm" className="h-8 rounded-lg" onClick={clearAll}>
            Clear all
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {permissionGroups.map((group) => {
          const groupSelected = group.permissions.filter((p) => selectedSet.has(p)).length;
          const allGroupSelected = groupSelected === group.permissions.length;

          return (
            <div
              key={group.module}
              className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-[#0A1F78]">{group.label}</p>
                  <p className="text-[10px] text-slate-400">
                    {groupSelected}/{group.permissions.length} enabled
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleGroup(group.permissions, !allGroupSelected)}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide transition-colors",
                    allGroupSelected
                      ? "bg-[#0A1F78]/10 text-[#0A1F78]"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200/80"
                  )}
                >
                  {allGroupSelected ? "All on" : "Toggle all"}
                </button>
              </div>
              <div className="space-y-2">
                {group.permissions.map((permission) => {
                  const checked = selectedSet.has(permission);
                  return (
                    <button
                      key={permission}
                      type="button"
                      onClick={() => toggle(permission)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-all",
                        checked
                          ? "border-[#2563EB]/30 bg-[#2563EB]/5 text-[#0A1F78]"
                          : "border-slate-100 bg-slate-50/50 text-slate-600 hover:border-slate-200"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                          checked
                            ? "border-[#2563EB] bg-[#2563EB] text-white"
                            : "border-slate-300 bg-white"
                        )}
                      >
                        {checked && <Check className="h-3 w-3" />}
                      </span>
                      <span className="font-medium">{permissionLabel(permission)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RoleFormPanel({
  form,
  setForm,
  creating,
  saving,
  slugLocked,
  onSave,
  onClose,
}: {
  form: RoleForm;
  setForm: (f: RoleForm) => void;
  creating: boolean;
  saving: boolean;
  slugLocked: boolean;
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
      <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-violet-50/80 to-indigo-50/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-[#0A1F78] text-white shadow-md">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-semibold text-[#0A1F78]">
              {creating ? "New role" : "Edit role & permissions"}
            </h4>
            <p className="text-xs text-slate-500">
              Define access level and granular permissions
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
            Role details
          </h5>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-slate-700">Role name *</Label>
              <Input
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm({
                    ...form,
                    name,
                    slug:
                      creating && !slugLocked
                        ? slugify(name)
                        : form.slug,
                  });
                }}
                className={adminFieldClass}
                placeholder="Content Manager"
              />
            </div>
            <div>
              <Label className="text-slate-700">Slug *</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                className={adminFieldClass}
                placeholder="content-manager"
                disabled={slugLocked}
              />
              {slugLocked && (
                <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                  <Lock className="h-3 w-3" />
                  System role slug cannot be changed
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <Label className="text-slate-700">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={adminTextareaClass}
                rows={2}
                placeholder="What this role can do in the admin..."
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
          <h5 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Permissions
          </h5>
          <PermissionsEditor
            selected={form.permissions}
            onChange={(permissions) => setForm({ ...form, permissions })}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
        <p className="text-xs text-slate-500">
          {form.permissions.length} permission{form.permissions.length === 1 ? "" : "s"} will be granted
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={saving}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-[#0A1F78] shadow-md"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {creating ? "Create role" : "Save changes"}
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function RolesAdminView({ roles: initial }: { roles: RoleRow[] }) {
  const [roles, setRoles] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<RoleForm>({
    name: "",
    slug: "",
    description: "",
    permissions: [],
  });
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return roles;
    return roles.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.slug.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q)
    );
  }, [roles, query]);

  const totalPermissions = allPermissions.length;
  const avgPerms =
    roles.length > 0
      ? Math.round(
          roles.reduce((s, r) => s + r.permissions.length, 0) / roles.length
        )
      : 0;
  const totalUsers = roles.reduce((s, r) => s + r.userCount, 0);

  function openNew() {
    setForm({ name: "", slug: "", description: "", permissions: [] });
    setCreating(true);
    setEditing(null);
  }

  function openEdit(role: RoleRow) {
    setForm({
      name: role.name,
      slug: role.slug,
      description: role.description || "",
      permissions: [...role.permissions],
    });
    setEditing(role.id);
    setCreating(false);
  }

  function closeForm() {
    setCreating(false);
    setEditing(null);
  }

  function toRow(role: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    permissions: unknown;
    _count: { users: number };
  }): RoleRow {
    return {
      id: role.id,
      name: role.name,
      slug: role.slug,
      description: role.description,
      permissions: (role.permissions as Permission[]) || [],
      userCount: role._count.users,
    };
  }

  async function handleSave() {
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error("Name and slug are required");
      return;
    }
    if (form.permissions.length === 0) {
      toast.error("Select at least one permission");
      return;
    }

    setSaving(true);
    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      permissions: form.permissions,
    };
    const res = creating
      ? await createRole(payload)
      : await updateRole(editing!, payload);
    setSaving(false);

    if (res.success && res.role) {
      const row = toRow(res.role);
      if (creating) setRoles((list) => [...list, row]);
      else setRoles((list) => list.map((r) => (r.id === editing ? row : r)));
      toast.success(creating ? "Role created" : "Role updated");
      closeForm();
    } else {
      toast.error(res.error || "Failed to save role");
    }
  }

  async function handleDelete(id: string, slug: string) {
    if (!confirm("Delete this role? This cannot be undone.")) return;
    const res = await deleteRole(id);
    if (res.success) {
      setRoles((list) => list.filter((r) => r.id !== id));
      if (editing === id) closeForm();
      toast.success("Role deleted");
    } else {
      toast.error(res.error || "Failed to delete role");
    }
  }

  const editingSlug = editing
    ? roles.find((r) => r.id === editing)?.slug
    : undefined;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-[#0A1F78]/10 bg-gradient-to-br from-[#0A1F78] via-[#1e40af] to-[#2563EB] p-6 text-white shadow-lg shadow-[#0A1F78]/15 sm:p-7"
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet-400/20 blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
              <Sparkles className="h-3.5 w-3.5 text-[#00C2FF]" />
              Access control
            </div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Roles & permissions
            </h2>
            <p className="mt-1.5 max-w-xl text-sm text-white/75">
              Create roles and fine-tune what each team member can view or
              manage across the admin.
            </p>
          </div>
          <Button
            onClick={openNew}
            size="lg"
            className="h-11 shrink-0 rounded-xl bg-white text-[#0A1F78] shadow-md hover:bg-white/95"
          >
            <Plus className="h-4 w-4" />
            Add role
          </Button>
        </div>
      </motion.div>

      <AdminStatsRow
        stats={[
          { title: "Total roles", value: roles.length, icon: "Shield", variant: "indigo" },
          { title: "Users assigned", value: totalUsers, icon: "Users", variant: "blue" },
          { title: "Avg. permissions", value: avgPerms, icon: "ShieldCheck", variant: "cyan" },
          { title: "Available permissions", value: totalPermissions, icon: "Lock", variant: "emerald" },
        ]}
      />

      <AnimatePresence mode="wait">
        {(creating || editing) && (
          <RoleFormPanel
            key={creating ? "create" : editing}
            form={form}
            setForm={setForm}
            creating={creating}
            saving={saving}
            slugLocked={!!editingSlug && PROTECTED_SLUGS.has(editingSlug)}
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
        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-[#0A1F78] text-white shadow-md">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-[#0A1F78]">Role directory</h3>
              <p className="text-sm text-slate-500">
                {filtered.length} of {roles.length} roles
              </p>
            </div>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search roles..."
              className="h-10 rounded-xl border-slate-200/80 bg-slate-50/50 pl-9 focus-visible:bg-white"
            />
          </div>
        </div>

        <div className="space-y-3 p-6">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-14 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50">
                <Shield className="h-6 w-6 text-violet-600" />
              </div>
              <p className="font-medium text-slate-700">No roles found</p>
              <p className="mt-1 text-sm text-slate-500">
                {query ? "Try a different search" : "Create a custom role to get started"}
              </p>
              {!query && (
                <Button onClick={openNew} className="mt-5 rounded-xl">
                  <Plus className="h-4 w-4" />
                  Add role
                </Button>
              )}
            </div>
          ) : (
            filtered.map((role, index) => {
              const isActive = editing === role.id;
              const isProtected = PROTECTED_SLUGS.has(role.slug);
              const permPercent = Math.round(
                (role.permissions.length / totalPermissions) * 100
              );

              return (
                <motion.div
                  key={role.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={cn(
                    "group overflow-hidden rounded-2xl border bg-white transition-all",
                    isActive
                      ? "border-violet-300/60 shadow-md ring-2 ring-violet-100"
                      : "border-slate-200/70 hover:border-slate-300/80 hover:shadow-sm"
                  )}
                >
                  <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                    <div
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md",
                        roleBadgeClass(role.slug)
                      )}
                    >
                      {isProtected ? (
                        <Lock className="h-5 w-5" />
                      ) : (
                        <Shield className="h-5 w-5" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-[#0A1F78]">{role.name}</p>
                        <code className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-500">
                          {role.slug}
                        </code>
                        {isProtected && (
                          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                            System role
                          </span>
                        )}
                      </div>
                      {role.description && (
                        <p className="mt-1 text-sm text-slate-500">{role.description}</p>
                      )}
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          <Users className="h-3.5 w-3.5 text-[#2563EB]" />
                          {role.userCount} user{role.userCount === 1 ? "" : "s"}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          {role.permissions.length} permissions
                        </span>
                        <div className="flex min-w-[120px] flex-1 items-center gap-2 sm:max-w-[200px]">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-[#2563EB] transition-all"
                              style={{ width: `${permPercent}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-medium text-slate-400">
                            {permPercent}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 sm:shrink-0">
                      {role.userCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 rounded-lg text-slate-500"
                          asChild
                        >
                          <Link href="/admin/users">
                            <Users className="h-3.5 w-3.5" />
                            View users
                          </Link>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 rounded-lg text-[#2563EB] hover:bg-[#2563EB]/10"
                        onClick={() => openEdit(role)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Manage
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-30"
                        disabled={isProtected || role.userCount > 0}
                        onClick={() => handleDelete(role.id, role.slug)}
                        title={
                          isProtected
                            ? "System role cannot be deleted"
                            : role.userCount > 0
                              ? "Reassign users before deleting"
                              : "Delete role"
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.section>
    </div>
  );
}
