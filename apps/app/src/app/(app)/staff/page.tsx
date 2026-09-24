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
  FiPlus,
  FiBriefcase,
} from "react-icons/fi";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { useAppDispatch } from "@/src/hooks/useAppDispatch";
import { setAccountType } from "@/src/store/slices/auth";
import { FeatureBlock } from "@/src/components/UI/FeatureBlock";
import { UpgradeModal } from "@/src/components/Modals/UpgradeModal";
import { BaseButton } from "@/src/components/UI/Buttons";
import { customToast } from "@/src/helpers/customToast";

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
  const dispatch = useAppDispatch();
  const { user, accountType } = useAppSelector((state) => state.auth);
  const isIndividual = accountType === "INDIVIDUAL";
  const tier = user?.subscriptionTier?.toUpperCase() || "BASIC";

  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
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
      <div className="group relative rounded-[2rem] border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 transition-all duration-200 hover:-translate-y-1">
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

  const handleSwitchToCompany = () => {
    dispatch(setAccountType("ORGANIZATION"));
    customToast.success(
      "Switched to Company Account view. You can now manage your staff.",
    );
  };

  const handleCreateCompany = () => {
    console.log("Create Company Clicked");
    customToast.info("Simulated Company creation process started!");
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
        <div className="w-full flex items-center justify-center">
          {tier === "PLATINUM" ? (
            <div className="relative overflow-hidden rounded-[2.5rem] border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[400px] w-full max-w-4xl">
              {/* Decorative background glow */}
              <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-theme-primary/5 blur-3xl pointer-events-none" />
              <div className="absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

              {/* Icon Badge */}
              <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-theme-primary/10 to-indigo-500/10 text-theme-primary">
                <FiUsers className="h-10 w-10 text-theme-primary" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">
                Switch to Company Mode
              </h2>
              <p className="mt-3 max-w-lg text-gray-500 dark:text-slate-400 text-sm leading-relaxed">
                You are a Platinum member! To manage team members, invite staff,
                and collaborate, switch to your Company Account, or create a
                brand new company profile.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <BaseButton
                  type="button"
                  color="primary"
                  className="px-8 font-semibold"
                  icon={<FiBriefcase className="size-4" />}
                  position="icon-first"
                  onClick={handleSwitchToCompany}
                >
                  Switch to Company Account
                </BaseButton>

                <BaseButton
                  type="button"
                  color="outline"
                  className="px-8 font-semibold"
                  icon={<FiPlus className="size-4" />}
                  position="icon-first"
                  onClick={handleCreateCompany}
                >
                  Create a Company
                </BaseButton>
              </div>
            </div>
          ) : tier === "PREMIUM" ? (
            <FeatureBlock
              title="Upgrade to Platinum for Staff Features"
              description="As a Premium member, you can add more than 5 clients. However, creating a company account and managing staff is only available for Platinum members."
              icon={<FiUsers className="h-10 w-10 text-theme-primary" />}
              ctaText="Upgrade to Platinum"
              onCtaClick={() => setIsUpgradeOpen(true)}
            />
          ) : (
            <FeatureBlock
              title="Upgrade Plan for Staff Features"
              description="As a Basic member, you are limited to only 5 clients and cannot manage staff. Upgrade your plan to invite team members, assign roles, and collaborate."
              icon={<FiUsers className="h-10 w-10 text-theme-primary" />}
              ctaText="Explore Plans"
              onCtaClick={() => setIsUpgradeOpen(true)}
            />
          )}
        </div>
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

      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
      />
    </div>
  );
}
