"use client";

import { useState, useMemo, type JSX } from "react";
import {
  FiPlus,
  FiInfo,
  FiZap,
  FiPhone,
  FiMail,
  FiMoreVertical,
  FiCalendar,
  FiHeart,
  FiGift,
} from "react-icons/fi";
import { BaseButton } from "@/src/components/UI/Buttons";
import { Table } from "@/src/components/UI/Table";
import { ActionsList } from "@/src/components/UI/ActionsList";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { UpgradeModal } from "@/src/components/Modals/UpgradeModal";
import { ConfirmActionModal } from "@/src/components/Modals/ConfirmActionModal";
import { useClientsQuery, useDeleteClient } from "@/src/hooks/useClientQuery";
import { getInitials } from "@/src/helpers/stringHelpers";
import { formatRelativeTime } from "@/src/helpers/dateHelpers";
import { formatDate } from "@/src/helpers/formatDate";
import { customToast } from "@/src/helpers/customToast";
import type { ColumnDef } from "@tanstack/react-table";
import type { IClient } from "@/src/models/client";

function getTagBadgeStyle(tag: string) {
  const lower = tag.toLowerCase();
  if (lower === "group") {
    return "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border border-slate-900 dark:border-slate-100";
  }
  if (lower === "vip") {
    return "bg-indigo-50/90 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100/90 dark:border-indigo-800/40";
  }
  return "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700";
}

function ClientContactInfo({ client }: { client: IClient }) {
  if (!client.phoneNumber && !client.email) {
    return <span className="text-xs text-gray-400 dark:text-slate-500">—</span>;
  }
  return (
    <div className="flex flex-col gap-1 text-[0.8rem]">
      {client.phoneNumber && (
        <span className="flex items-center gap-1.5 text-gray-500 dark:text-slate-400">
          <FiPhone className="size-3.5 text-gray-400 dark:text-slate-500 shrink-0" />
          {client.phoneNumber}
        </span>
      )}
      {client.email && (
        <span className="flex items-center gap-1.5 text-gray-400 dark:text-slate-500 truncate">
          <FiMail className="size-3.5 text-gray-400 dark:text-slate-500 shrink-0" />
          {client.email}
        </span>
      )}
    </div>
  );
}

function ClientEventInfo({ client }: { client: IClient }) {
  const primaryEvent = client.events?.[0];
  const hasEvent = Boolean(primaryEvent);
  const hasBirthDate = Boolean(client.birthDate);

  if (!hasEvent && !hasBirthDate) {
    return <span className="text-xs text-gray-400 dark:text-slate-500">—</span>;
  }

  const title = primaryEvent?.title || "Birthday";
  const rawDate = primaryEvent?.date || client.birthDate;
  const isAnniversary = title.toLowerCase().includes("anniversary");
  const formattedDate = rawDate
    ? formatDate({ date: rawDate, showTime: false, utc: false })
    : null;

  return (
    <div className="flex flex-col gap-1 text-[0.8rem]">
      <span className="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-slate-100">
        {isAnniversary ? (
          <FiHeart className="size-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
        ) : (
          <FiGift className="size-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
        )}
        <span className="truncate">{title}</span>
      </span>
      {formattedDate && (
        <span className="flex items-center gap-1.5 text-gray-400 dark:text-slate-500 font-normal">
          <FiCalendar className="size-3.5 text-gray-400 dark:text-slate-500 shrink-0" />
          {formattedDate}
        </span>
      )}
    </div>
  );
}

function ClientTagBadge({ client }: { client: IClient }) {
  const displayTag = client.tags?.[0] || client.groups?.[0]?.name;

  if (!displayTag) {
    return <span className="text-xs text-gray-400 dark:text-slate-500">—</span>;
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold shrink-0 ${getTagBadgeStyle(
        displayTag,
      )}`}
    >
      {displayTag}
    </span>
  );
}

function ClientActions({
  client,
  onDelete,
}: {
  client: IClient;
  onDelete: (id: string) => void;
}) {
  return (
    <ActionsList
      actions={[
        {
          title: "Delete Client",
          fn: () => onDelete(client.id),
          color: "red",
        },
      ]}
      trigger={
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="More actions"
        >
          <FiMoreVertical className="size-4" />
        </button>
      }
    />
  );
}

export default function ClientsPage(): JSX.Element {
  const { user } = useAppSelector((state) => state.auth);
  const tier = user?.company?.subscriptionTier?.toUpperCase() || "BASIC";

  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tagFilter, setTagFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null);

  const { data, isLoading, error } = useClientsQuery({
    page: currentPage,
    limit: pageSize,
    search: searchQuery || undefined,
  });

  const deleteMutation = useDeleteClient({
    onSuccess: () => {
      customToast.success("Client deleted successfully");
      setDeletingClientId(null);
    },
  });

  const rawClients = useMemo(() => data?.data ?? [], [data?.data]);

  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    rawClients.forEach((client) => {
      client.tags?.forEach((t) => t && tagsSet.add(t));
      client.groups?.forEach((g) => g.name && tagsSet.add(g.name));
    });
    return Array.from(tagsSet);
  }, [rawClients]);

  const clients = useMemo(() => {
    if (tagFilter === "ALL") return rawClients;
    const lowerFilter = tagFilter.toLowerCase();
    return rawClients.filter(
      (client) =>
        client.tags?.some((t) => t.toLowerCase() === lowerFilter) ||
        client.groups?.some((g) => g.name.toLowerCase() === lowerFilter),
    );
  }, [rawClients, tagFilter]);

  const totalClientsCount = data?.pagination?.total ?? rawClients.length;

  const columns = useMemo<ColumnDef<IClient>[]>(
    () => [
      {
        id: "name",
        header: "Client Name",
        accessorKey: "fullName",
        cell: ({ row }) => {
          const client = row.original;
          const initials = getInitials(client.fullName) || "CL";

          return (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 dark:bg-slate-800 text-[0.8rem] font-semibold text-indigo-600 dark:text-indigo-400">
                {initials}
              </div>
              <span className="font-semibold text-gray-900 dark:text-slate-100 text-[0.9rem] leading-tight">
                {client.fullName}
              </span>
            </div>
          );
        },
      },
      {
        id: "contact",
        header: "Contact",
        cell: ({ row }) => <ClientContactInfo client={row.original} />,
      },
      {
        id: "event",
        header: "Event",
        cell: ({ row }) => <ClientEventInfo client={row.original} />,
      },
      {
        id: "tag",
        header: "Tag",
        accessorKey: "tags",
        cell: ({ row }) => <ClientTagBadge client={row.original} />,
      },
      {
        id: "lastContact",
        header: "Last Contact",
        cell: ({ row }) => {
          const client = row.original;
          const lastDate = client.updatedAt || client.createdAt;
          return (
            <span className="text-xs text-gray-500 dark:text-slate-400">
              {lastDate ? formatRelativeTime(lastDate) : "—"}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <ClientActions client={row.original} onDelete={setDeletingClientId} />
        ),
      },
    ],
    [],
  );

  const renderGridItem = (client: IClient) => {
    const initials = getInitials(client.fullName) || "CL";
    const lastDate = client.updatedAt || client.createdAt;

    return (
      <div className="group relative rounded-3xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 transition-all duration-200 hover:-translate-y-1 shadow-xs flex flex-col justify-between h-full min-h-[240px]">
        <div>
          {/* Card Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-50 dark:bg-slate-800 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                {initials}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-slate-100 text-[0.95rem] line-clamp-1">
                  {client.fullName}
                </h3>
              </div>
            </div>
            <ClientTagBadge client={client} />
          </div>

          <div className="my-4 border-t border-gray-50 dark:border-slate-800/50" />

          {/* Contact Details */}
          <ClientContactInfo client={client} />

          {/* Event Details */}
          <div className="mt-3 pt-3 border-t border-gray-50 dark:border-slate-800/50">
            <ClientEventInfo client={client} />
          </div>
        </div>

        {/* Card Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-50 dark:border-slate-800/50 pt-3 text-xs text-gray-400 dark:text-slate-500">
          <span>{lastDate ? formatRelativeTime(lastDate) : "—"}</span>
          <ClientActions client={client} onDelete={setDeletingClientId} />
        </div>
      </div>
    );
  };

  const filterPopoverContent = (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-2">
        <span className="text-xs font-bold text-gray-900 dark:text-slate-100 uppercase tracking-wider">
          Filter by Tag
        </span>
        {tagFilter !== "ALL" && (
          <button
            type="button"
            onClick={() => setTagFilter("ALL")}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTagFilter("ALL")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            tagFilter === "ALL"
              ? "bg-theme-primary text-white"
              : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
          }`}
        >
          All
        </button>
        {availableTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setTagFilter(tag)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              tagFilter === tag
                ? "bg-theme-primary text-white"
                : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* Client Limit Banners */}
      {tier === "BASIC" && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-amber-200 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300">
          <div className="flex items-start gap-3">
            <FiInfo className="size-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="text-sm font-semibold">Basic Plan Limits</p>
              <p className="text-xs text-amber-700/90 dark:text-amber-400/80 mt-0.5">
                You are limited to a maximum of 5 clients on the Basic tier.
                Upgrade to Premium or Platinum for unlimited client capacity.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsUpgradeOpen(true)}
            className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl transition-all self-start sm:self-center shrink-0 cursor-pointer"
          >
            <FiZap className="size-3.5" />
            Upgrade Plan
          </button>
        </div>
      )}

      {tier === "PREMIUM" && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-indigo-100 bg-indigo-50/30 dark:border-slate-800 dark:bg-slate-900/40 text-indigo-900 dark:text-slate-300">
          <div className="flex items-start gap-3">
            <FiZap className="size-5 shrink-0 mt-0.5 text-indigo-500" />
            <div>
              <p className="text-sm font-semibold">Premium Plan Status</p>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                You have unlimited client capacity! Upgrade to Platinum to
                invite team members, manage staff, and collaborate.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsUpgradeOpen(true)}
            className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider bg-theme-primary hover:bg-theme-primary-hover text-white px-4 py-2 rounded-xl transition-all self-start sm:self-center shrink-0 cursor-pointer"
          >
            Upgrade to Platinum
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-slate-100 font-geist">
            Clients
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Manage your client relationships
            {totalClientsCount > 0 && ` · ${totalClientsCount} total`}
          </p>
        </div>
        <BaseButton
          type="button"
          onClick={() => {}}
          color="primary"
          icon={<FiPlus className="size-4" />}
          position="icon-first"
          className="h-11 px-5 rounded-2xl text-sm font-medium transition-all shadow-xs"
          text="Add Client"
        />
      </div>

      {/* Table Container */}
      <Table
        data={clients}
        columns={columns}
        loading={isLoading}
        error={!!error}
        searchPlaceholder="Search"
        searchQuery={searchQuery}
        onSearchChange={(query) => {
          setSearchQuery(query);
          setCurrentPage(1);
        }}
        filterContent={filterPopoverContent}
        filterActiveCount={tagFilter !== "ALL" ? 1 : 0}
        renderGridItem={renderGridItem}
        pagination={{
          currentPage,
          totalPages: data?.pagination?.totalPages ?? 1,
          totalResults:
            tagFilter !== "ALL" ? clients.length : totalClientsCount,
          pageSize,
          onPageChange: (page: number) => setCurrentPage(page),
          onPageSizeChange: (size) => {
            setPageSize(size);
            setCurrentPage(1);
          },
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmActionModal
        actionName="Delete"
        title="Delete Client"
        message="Are you sure you want to delete this client? This will remove them and any associated records."
        display={!!deletingClientId}
        close={() => setDeletingClientId(null)}
        loading={deleteMutation.isPending}
        fn={() => {
          if (deletingClientId) {
            deleteMutation.mutate(deletingClientId);
          }
        }}
      />

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
      />
    </div>
  );
}
