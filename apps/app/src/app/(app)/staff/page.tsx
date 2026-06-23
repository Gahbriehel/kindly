"use client";

import { useState, useMemo, type JSX } from "react";
import { Table } from "@/src/components/UI/Table";
import type { ColumnDef } from "@tanstack/react-table";
import {
  FiPhone,
  FiMail,
  FiMessageSquare,
  FiMoreVertical,
  FiCheckCircle,
  FiClock,
  FiUsers,
} from "react-icons/fi";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { FeatureBlock } from "@/src/components/UI/FeatureBlock";

interface StaffMember {
  id: string;
  name: string;
  avatarText: string;
  phoneNumber: string;
  email: string;
  role: "Admin" | "Manager" | "Staff" | "Support";
  status: "Active" | "Away" | "Inactive";
}

const mockStaff: StaffMember[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatarText: "SJ",
    phoneNumber: "+1 234 567 8900",
    email: "sarah.j@email.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: "2",
    name: "Michael Chen",
    avatarText: "MC",
    phoneNumber: "+1 345 678 9012",
    email: "m.chen@email.com",
    role: "Manager",
    status: "Active",
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    avatarText: "ER",
    phoneNumber: "+1 456 789 0123",
    email: "emma.r@email.com",
    role: "Staff",
    status: "Away",
  },
  {
    id: "4",
    name: "David Kim",
    avatarText: "DK",
    phoneNumber: "+1 567 890 1234",
    email: "d.kim@email.com",
    role: "Support",
    status: "Active",
  },
  {
    id: "5",
    name: "Aisha Patel",
    avatarText: "AP",
    phoneNumber: "+1 678 901 2345",
    email: "aisha.p@email.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: "6",
    name: "James Wilson",
    avatarText: "JW",
    phoneNumber: "+1 789 012 3456",
    email: "j.wilson@email.com",
    role: "Staff",
    status: "Inactive",
  },
];

const roleStyles: Record<StaffMember["role"], string> = {
  Admin:
    "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400",
  Manager:
    "bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400",
  Staff: "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300",
  Support: "bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400",
};

const statusConfig: Record<
  StaffMember["status"],
  { label: string; classes: string; icon: JSX.Element }
> = {
  Active: {
    label: "Active",
    classes:
      "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50",
    icon: <FiCheckCircle className="size-3.5" />,
  },
  Away: {
    label: "Away",
    classes:
      "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50",
    icon: <FiClock className="size-3.5" />,
  },
  Inactive: {
    label: "Inactive",
    classes:
      "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-700",
    icon: <FiClock className="size-3.5" />,
  },
};

export default function StaffPage(): JSX.Element {
  const { user, accountType } = useAppSelector((state) => state.auth);
  const isIndividual =
    accountType === "INDIVIDUAL" || user?.accountType === "INDIVIDUAL";

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredData = useMemo(() => {
    if (!searchQuery) return mockStaff;
    const q = searchQuery.toLowerCase();
    return mockStaff.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.phoneNumber.includes(q) ||
        item.role.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const columns = useMemo<ColumnDef<StaffMember>[]>(
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
        id: "contact",
        header: "Contact",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex flex-col gap-1 text-[0.8rem]">
              <span className="flex items-center gap-1.5 text-gray-500 dark:text-slate-400">
                <FiPhone className="size-3.5 text-gray-400 dark:text-slate-500 shrink-0" />
                {item.phoneNumber}
              </span>
              <span className="flex items-center gap-1.5 text-gray-400 dark:text-slate-500">
                <FiMail className="size-3.5 text-gray-400 dark:text-slate-500 shrink-0" />
                {item.email}
              </span>
            </div>
          );
        },
      },
      {
        id: "role",
        header: "Role",
        accessorKey: "role",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${roleStyles[item.role]}`}
            >
              {item.role}
            </span>
          );
        },
      },
      {
        id: "status",
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => {
          const item = row.original;
          const cfg = statusConfig[item.status];
          return (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cfg.classes}`}
            >
              {cfg.icon}
              {cfg.label}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: () => (
          <div className="flex items-center gap-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-full text-indigo-500 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
              <FiMessageSquare className="size-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
              <FiMoreVertical className="size-4" />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  const renderGridItem = (item: StaffMember) => {
    const cfg = statusConfig[item.status];
    return (
      <div className="group relative rounded-[2rem] border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-slate-900/40 hover:-translate-y-1">
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
              <span
                className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${roleStyles[item.role]}`}
              >
                {item.role}
              </span>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0 ${cfg.classes}`}
          >
            {cfg.icon}
            {cfg.label}
          </span>
        </div>

        <div className="my-4 border-t border-gray-50 dark:border-slate-800/50" />

        {/* Contact Info */}
        <div className="flex flex-col gap-2 text-[0.8rem]">
          <span className="flex items-center gap-2 text-gray-500 dark:text-slate-400">
            <FiPhone className="size-3.5 text-gray-400 dark:text-slate-500 shrink-0" />
            {item.phoneNumber}
          </span>
          <span className="flex items-center gap-2 text-gray-400 dark:text-slate-500">
            <FiMail className="size-3.5 text-gray-400 dark:text-slate-500 shrink-0" />
            {item.email}
          </span>
        </div>

        {/* Card Footer */}
        <div className="mt-4 flex items-center justify-end gap-1 border-t border-gray-50 dark:border-slate-800/50 pt-3">
          <button className="flex h-8 w-8 items-center justify-center rounded-full text-indigo-500 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            <FiMessageSquare className="size-4" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            <FiMoreVertical className="size-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-serif text-gray-900 dark:text-slate-100">
          Staff Directory
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          Manage your team members and their access levels.
        </p>
      </div>

      {isIndividual ? (
        <FeatureBlock
          title="Manage your team with Staff features"
          description="Adding or managing staff is not available for Individual accounts. Subscribe to an organization plan to invite team members, assign roles, and collaborate."
          icon={<FiUsers className="h-10 w-10 text-theme-primary" />}
          ctaText="Explore Plans"
          onCtaClick={() => {
            // Plan details/routing will be done later
          }}
        />
      ) : (
        <Table
          data={paginatedData}
          columns={columns}
          loading={false}
          error={false}
          searchPlaceholder="Search by name, role or status..."
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          renderGridItem={renderGridItem}
          onFilterClick={() => {}}
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
      )}
    </div>
  );
}
