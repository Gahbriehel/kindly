import type { IUserData } from "../models/auth";
import type { Permission } from "../models/permission";

export interface PermissionOption {
  key: Permission;
  label: string;
  /** Destructive or financial actions; granting one asks for confirmation. */
  sensitive?: boolean;
}

export interface PermissionGroup {
  id: string;
  label: string;
  desc: string;
  permissions: PermissionOption[];
}

// Groups are not editable yet, so GROUP_* permissions are left out.
export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    desc: "Overview stats and today's outreach",
    permissions: [{ key: "DASHBOARD_VIEW", label: "View dashboard" }],
  },
  {
    id: "clients",
    label: "Clients",
    desc: "Client records and tags",
    permissions: [
      { key: "CLIENT_VIEW", label: "View clients" },
      { key: "CLIENT_CREATE", label: "Add clients" },
      { key: "CLIENT_UPDATE", label: "Edit clients" },
      { key: "CLIENT_DELETE", label: "Delete clients", sensitive: true },
    ],
  },
  {
    id: "events",
    label: "Calendar & Events",
    desc: "Birthdays, anniversaries and other events",
    permissions: [
      { key: "EVENT_VIEW", label: "View events" },
      { key: "EVENT_CREATE", label: "Create events" },
      { key: "EVENT_UPDATE", label: "Edit events" },
      { key: "EVENT_DELETE", label: "Delete events", sensitive: true },
    ],
  },
  {
    id: "templates",
    label: "Templates",
    desc: "Message templates",
    permissions: [
      { key: "TEMPLATE_VIEW", label: "View templates" },
      { key: "TEMPLATE_CREATE", label: "Create templates" },
      { key: "TEMPLATE_UPDATE", label: "Edit templates" },
      { key: "TEMPLATE_DELETE", label: "Delete templates", sensitive: true },
    ],
  },
  {
    id: "invoices",
    label: "Invoices",
    desc: "Billing, payments and invoice delivery",
    permissions: [
      { key: "INVOICE_VIEW", label: "View invoices" },
      { key: "INVOICE_CREATE", label: "Create invoices" },
      { key: "INVOICE_UPDATE", label: "Edit & delete drafts" },
      { key: "INVOICE_SEND", label: "Send invoices" },
      {
        key: "INVOICE_RECORD_PAYMENT",
        label: "Record payments",
        sensitive: true,
      },
      { key: "INVOICE_VOID", label: "Void invoices", sensitive: true },
    ],
  },
  {
    id: "categories",
    label: "Manage Categories",
    desc: "Everyone can use categories; these allow changing them",
    permissions: [
      { key: "CATEGORY_CREATE", label: "Add categories" },
      { key: "CATEGORY_UPDATE", label: "Rename categories" },
      { key: "CATEGORY_DELETE", label: "Delete categories", sensitive: true },
    ],
  },
];

const OPTIONS = new Map(
  PERMISSION_GROUPS.flatMap((g) => g.permissions).map((p) => [p.key, p]),
);

export const ASSIGNABLE_PERMISSIONS: Permission[] = [...OPTIONS.keys()];

export const permissionLabel = (permission: Permission) =>
  OPTIONS.get(permission)?.label ?? permission;

export const isSensitive = (permission: Permission) =>
  !!OPTIONS.get(permission)?.sensitive;

/**
 * Permissions that only work alongside others, e.g. editing a client is
 * useless without seeing the list. Mirrors the backend's map, which applies
 * the same rules on save.
 */
export const PERMISSION_REQUIRES: Partial<Record<Permission, Permission[]>> = {
  CLIENT_CREATE: ["CLIENT_VIEW"],
  CLIENT_UPDATE: ["CLIENT_VIEW"],
  CLIENT_DELETE: ["CLIENT_VIEW"],
  GROUP_CREATE: ["GROUP_VIEW"],
  GROUP_UPDATE: ["GROUP_VIEW"],
  GROUP_DELETE: ["GROUP_VIEW"],
  // The event form picks participants from the client list.
  EVENT_CREATE: ["EVENT_VIEW", "CLIENT_VIEW"],
  EVENT_UPDATE: ["EVENT_VIEW", "CLIENT_VIEW"],
  EVENT_DELETE: ["EVENT_VIEW"],
  TEMPLATE_CREATE: ["TEMPLATE_VIEW"],
  TEMPLATE_UPDATE: ["TEMPLATE_VIEW"],
  TEMPLATE_DELETE: ["TEMPLATE_VIEW"],
  // The invoice wizard picks a client, then one of their events.
  INVOICE_CREATE: ["INVOICE_VIEW", "CLIENT_VIEW", "EVENT_VIEW"],
  INVOICE_UPDATE: ["INVOICE_VIEW"],
  INVOICE_SEND: ["INVOICE_VIEW"],
  INVOICE_RECORD_PAYMENT: ["INVOICE_VIEW"],
  INVOICE_VOID: ["INVOICE_VIEW"],
};

/** Everything `permission` needs, directly or through another requirement. */
function requirementsOf(permission: Permission): Set<Permission> {
  const found = new Set<Permission>();
  const visit = (p: Permission) => {
    for (const req of PERMISSION_REQUIRES[p] ?? []) {
      if (found.has(req)) continue;
      found.add(req);
      visit(req);
    }
  };
  visit(permission);
  return found;
}

/** `permissions` plus everything they require. */
export function withRequired(permissions: Iterable<Permission>) {
  const result = new Set<Permission>();
  for (const p of permissions) {
    result.add(p);
    requirementsOf(p).forEach((req) => result.add(req));
  }
  return result;
}

/** Members of `permissions` that can't work without `permission`. */
export const dependentsOf = (
  permission: Permission,
  permissions: Iterable<Permission>,
) =>
  [...permissions].filter(
    (p) => p !== permission && requirementsOf(p).has(permission),
  );

export interface PermissionPreset {
  id: string;
  label: string;
  desc: string;
  permissions: Permission[];
}

const all = (prefix: string) =>
  ASSIGNABLE_PERMISSIONS.filter((p) => p.startsWith(prefix));

export const PERMISSION_PRESETS: PermissionPreset[] = [
  {
    id: "full",
    label: "Full access",
    desc: "Everything except staff and business settings",
    permissions: ASSIGNABLE_PERMISSIONS,
  },
  {
    id: "front-desk",
    label: "Front desk",
    desc: "Manages clients and the calendar",
    permissions: [
      "DASHBOARD_VIEW",
      "CLIENT_CREATE",
      "CLIENT_UPDATE",
      "EVENT_CREATE",
      "EVENT_UPDATE",
      "TEMPLATE_VIEW",
    ],
  },
  {
    id: "bookkeeper",
    label: "Bookkeeper",
    desc: "Handles invoices and payments",
    permissions: [
      "DASHBOARD_VIEW",
      ...all("INVOICE_").filter((p) => p !== "INVOICE_VOID"),
    ],
  },
  {
    id: "view-only",
    label: "View only",
    desc: "Can look, can't change anything",
    permissions: [
      "DASHBOARD_VIEW",
      "CLIENT_VIEW",
      "EVENT_VIEW",
      "TEMPLATE_VIEW",
      "INVOICE_VIEW",
    ],
  },
];

const sameSet = (a: Set<Permission>, b: Set<Permission>) =>
  a.size === b.size && [...a].every((p) => b.has(p));

/** The preset whose permissions match exactly, if any. */
export function matchPreset(permissions: Iterable<Permission>) {
  const current = withRequired(permissions);
  return PERMISSION_PRESETS.find((preset) =>
    sameSet(withRequired(preset.permissions), current),
  );
}

/** Owners can do everything; staff only what they were granted. */
export function hasPermission(
  user: Pick<IUserData, "role" | "permissions"> | null | undefined,
  permission: Permission,
) {
  if (!user) return false;
  if (user.role === "OWNER") return true;
  return !!user.permissions?.includes(permission);
}
