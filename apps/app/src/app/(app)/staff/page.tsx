"use client";

import { useState, useMemo, type JSX } from "react";
import { Table } from "@/src/components/UI/Table";
import type { ColumnDef } from "@tanstack/react-table";
import { FiMail, FiCheckCircle, FiClock, FiSend } from "react-icons/fi";
import { useStaffQuery } from "@/src/hooks/useStaffQuery";
import type { IStaffInvite, IStaffMember, StaffRole } from "@/src/models/staff";

type StaffStatus = "Active" | "Inactive" | "Invited" | "Expired";

interface StaffRow {
  id: string;
  name: string;
  avatarText: string;
  email: string;
  role: StaffRole;
  permissionCount: number;
  status: StaffStatus;
}

const roleLabels: Record<StaffRole, string> = {
  OWNER: "Owner",
  STAFF: "Staff",
};

const roleStyles: Record<StaffRole, string> = {
  OWNER:
    "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400",
  STAFF: "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300",
};

const statusConfig: Record<
  StaffStatus,
  { classes: string; icon: JSX.Element }
> = {
  Active: {
    classes:
      "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50",
    icon: <FiCheckCircle className="size-3.5" />,
  },
  Invited: {
    classes:
      "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50",
    icon: <FiSend className="size-3.5" />,
  },
  Expired: {
    classes:
      "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-700",
    icon: <FiClock className="size-3.5" />,
  },
  Inactive: {
    classes:
      "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-700",
    icon: <FiClock className="size-3.5" />,
  },
};

const initials = (firstName: string, lastName: string) =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

const memberToRow = (member: IStaffMember): StaffRow => ({
  id: member.id,
  name: `${member.firstName} ${member.lastName}`,
  avatarText: initials(member.firstName, member.lastName),
  email: member.email,
  role: member.role,
  permissionCount: member.permissions.length,
  status: member.isActive ? "Active" : "Inactive",
});

const inviteToRow = (invite: IStaffInvite): StaffRow => ({
  id: invite.id,
  name: `${invite.firstName} ${invite.lastName}`,
  avatarText: initials(invite.firstName, invite.lastName),
  email: invite.email,
  role: "STAFF",
  permissionCount: invite.permissions.length,
  status:
    invite.status === "EXPIRED" || new Date(invite.expiresAt) <= new Date()
      ? "Expired"
      : "Invited",
});

const accessLabel = (item: StaffRow) =>
  item.role === "OWNER"
    ? "Full access"
    : `${item.permissionCount} permission${item.permissionCount === 1 ? "" : "s"}`;

function StatusBadge({ status }: { status: StaffStatus }): JSX.Element {
  const cfg = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shrink-0 ${cfg.classes}`}
    >
      {cfg.icon}
      {status}
    </span>
  );
}

function RoleBadge({ role }: { role: StaffRole }): JSX.Element {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${roleStyles[role]}`}
    >
      {roleLabels[role]}
    </span>
  );
}

export default function StaffPage(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, error, refetch, isFetching } = useStaffQuery();

  const rows = useMemo<StaffRow[]>(() => {
    if (!data?.data) return [];
    const { staff, invitations } = data.data;
    return [
      ...staff.map(memberToRow),
      ...invitations
        .filter((invite) => ["PENDING", "EXPIRED"].includes(invite.status))
        .map(inviteToRow),
    ];
  }, [data]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return rows;
    const q = searchQuery.toLowerCase();
    return rows.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        roleLabels[item.role].toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q),
    );
  }, [rows, searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));

  const handleSearchChange = (query: string) => {
    setSearchQuery((prev) => {
      if (prev === query) return prev;
      setCurrentPage(1);
      return query;
    });
  };

  const columns = useMemo<ColumnDef<StaffRow>[]>(
    () => [
      {
        id: "name",
        header: "Staff Name",
        accessorKey: "name",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 dark:bg-slate-800 text-[0.8rem] font-semibold text-indigo-600 dark:text-indigo-400">
                {item.avatarText}
              </div>
              <span className="font-semibold text-gray-900 dark:text-slate-100 text-[0.9rem]">
                {item.name}
              </span>
            </div>
          );
        },
      },
      {
        id: "email",
        header: "Email",
        accessorKey: "email",
        cell: ({ row }) => (
          <span className="flex items-center gap-1.5 text-[0.8rem] text-gray-500 dark:text-slate-400">
            <FiMail className="size-3.5 text-gray-400 dark:text-slate-500 shrink-0" />
            {row.original.email}
          </span>
        ),
      },
      {
        id: "role",
        header: "Role",
        accessorKey: "role",
        cell: ({ row }) => <RoleBadge role={row.original.role} />,
      },
      {
        id: "access",
        header: "Access",
        cell: ({ row }) => (
          <span className="text-[0.8rem] text-gray-500 dark:text-slate-400">
            {accessLabel(row.original)}
          </span>
        ),
      },
      {
        id: "status",
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
    ],
    [],
  );

  const renderGridItem = (item: StaffRow) => (
    <div className="group relative rounded-[2rem] border border-gray-100 dark:border-slate-800 bg-white dark:bg-theme-surface p-6 transition-all duration-200 hover:-translate-y-1">
      {/* Card Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-50 dark:bg-slate-800 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            {item.avatarText}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-slate-100 text-[0.95rem]">
              {item.name}
            </h3>
            <div className="mt-1">
              <RoleBadge role={item.role} />
            </div>
          </div>
        </div>
        <StatusBadge status={item.status} />
      </div>

      <div className="my-4 border-t border-gray-50 dark:border-slate-800/50" />

      {/* Contact & Access */}
      <div className="flex flex-col gap-2 text-[0.8rem]">
        <span className="flex items-center gap-2 text-gray-500 dark:text-slate-400">
          <FiMail className="size-3.5 text-gray-400 dark:text-slate-500 shrink-0" />
          {item.email}
        </span>
        <span className="text-gray-400 dark:text-slate-500">
          {accessLabel(item)}
        </span>
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Manage your team members and their access levels
            {!isLoading &&
              ` · ${rows.length} total staff member${rows.length === 1 ? "" : "s"}`}
          </p>
        </div>
      </div>

      <Table
        data={paginatedData}
        columns={columns}
        loading={isLoading}
        error={!!error}
        onRefetch={() => void refetch()}
        isRefetching={isFetching}
        searchPlaceholder="Search by name, email, role or status..."
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        renderGridItem={renderGridItem}
        pagination={{
          currentPage,
          totalPages,
          totalResults: filteredData.length,
          pageSize,
          onPageChange: (page) => setCurrentPage(page),
          onPageSizeChange: (size) => {
            setPageSize(size);
            setCurrentPage(1);
          },
        }}
      />
    </div>
  );
}
