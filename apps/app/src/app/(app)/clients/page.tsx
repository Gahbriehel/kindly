"use client";

import { useState, useMemo, type JSX } from "react";
import {
  FiPlus,
  FiPhone,
  FiMail,
  FiMoreVertical,
  FiCalendar,
  FiHeart,
  FiGift,
} from "react-icons/fi";
import { NotAvailable } from "@/src/components/UI/NotAvailable";
import { BaseButton } from "@/src/components/UI/Buttons";
import { Table } from "@/src/components/UI/Table";
import { ActionsList } from "@/src/components/UI/ActionsList";
import { ConfirmActionModal } from "@/src/components/Modals/ConfirmActionModal";
import { ClientViewModal } from "@/src/components/Modals/ClientViewModal";
import { ClientFormModal } from "@/src/components/Forms/ClientFormModal";
import {
  useClientsQuery,
  useDeleteClient,
  useTagsQuery,
} from "@/src/hooks/useClientQuery";
import { getInitials } from "@/src/helpers/stringHelpers";
import { formatRelativeTime } from "@/src/helpers/dateHelpers";
import { formatDate } from "@/src/helpers/formatDate";
import { customToast } from "@/src/helpers/customToast";
import type { ColumnDef } from "@tanstack/react-table";
import type { IClient } from "@/src/models/client";

const SAVED_TAGS_LIMIT = 50;

type ClientFilter =
  | { type: "tag"; name: string }
  | { type: "group"; id: string; name: string };

const sameFilter = (a: ClientFilter | null, b: ClientFilter): boolean =>
  !!a &&
  a.type === b.type &&
  (a.type === "group" && b.type === "group"
    ? a.id === b.id
    : a.name.toLowerCase() === b.name.toLowerCase());

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
    return <NotAvailable />;
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

  if (!primaryEvent) {
    return <NotAvailable />;
  }

  const title = primaryEvent.title;
  const rawDate = primaryEvent.date;
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
    return <NotAvailable />;
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
  onView,
  onEdit,
  onDelete,
}: {
  client: IClient;
  onView: (client: IClient) => void;
  onEdit: (client: IClient) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <ActionsList
      actions={[
        { title: "View Client", fn: () => onView(client) },
        { title: "Edit Client", fn: () => onEdit(client) },
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
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilterState] = useState<ClientFilter | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null);
  const [viewingSnapshot, setViewingClient] = useState<IClient | null>(null);
  // When the edit form was opened from the view modal, closing it returns there.
  const [returnToView, setReturnToView] = useState<IClient | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<IClient | null>(null);

  const openAdd = () => {
    setEditingClient(null);
    setFormOpen(true);
  };
  const openEdit = (client: IClient) => {
    setReturnToView(null);
    setEditingClient(client);
    setFormOpen(true);
  };
  const openEditFromView = (client: IClient) => {
    setReturnToView(client);
    setViewingClient(null);
    setEditingClient(client);
    setFormOpen(true);
  };
  const closeForm = () => {
    setFormOpen(false);
    setEditingClient(null);
    if (returnToView) {
      setViewingClient(returnToView);
      setReturnToView(null);
    }
  };

  const setFilter = (next: ClientFilter | null) => {
    setFilterState(next);
    setCurrentPage(1);
  };

  const { data, isLoading, error } = useClientsQuery({
    page: currentPage,
    limit: pageSize,
    search: searchQuery || undefined,
    tag: filter?.type === "tag" ? filter.name : undefined,
    groupId: filter?.type === "group" ? filter.id : undefined,
  });

  const deleteMutation = useDeleteClient({
    onSuccess: () => {
      customToast.success("Client deleted successfully");
      setDeletingClientId(null);
      setViewingClient(null);
    },
  });

  const rawClients = useMemo(() => data?.data ?? [], [data?.data]);

  const { data: savedTags } = useTagsQuery({ limit: SAVED_TAGS_LIMIT });

  // There is no group list endpoint, and a filtered page only contains the
  // filtered group/tag, so remember every tag and group seen on loaded clients
  // (deleting a saved tag leaves it on existing clients).
  const [seen, setSeen] = useState<{
    source: IClient[];
    tags: string[];
    groups: Record<string, string>;
  }>({ source: [], tags: [], groups: {} });

  if (seen.source !== rawClients) {
    const tags = new Set(seen.tags);
    const groups = { ...seen.groups };
    rawClients.forEach((c) => {
      c.tags?.forEach((t) => t && tags.add(t));
      c.groups?.forEach((g) => g.id && g.name && (groups[g.id] = g.name));
    });
    setSeen({ source: rawClients, tags: Array.from(tags), groups });
  }
  const { tags: seenTags, groups: seenGroups } = seen;

  const filterOptions = useMemo<ClientFilter[]>(() => {
    const names = new Map<string, string>();
    [...(savedTags?.data.map((t) => t.name) ?? []), ...seenTags].forEach(
      (name) =>
        name &&
        !names.has(name.toLowerCase()) &&
        names.set(name.toLowerCase(), name),
    );
    return [
      ...Array.from(names.values()).map(
        (name): ClientFilter => ({ type: "tag", name }),
      ),
      ...Object.entries(seenGroups).map(
        ([id, name]): ClientFilter => ({ type: "group", id, name }),
      ),
    ];
  }, [savedTags, seenTags, seenGroups]);

  const clients = rawClients;
  // Prefer the freshest copy so the view reflects edits after returning to it.
  const viewingClient = viewingSnapshot
    ? (rawClients.find((c) => c.id === viewingSnapshot.id) ?? viewingSnapshot)
    : null;

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
            <div className="flex items-center gap-3 text-left">
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
          if (!lastDate) return <NotAvailable />;
          return (
            <span className="text-xs text-gray-500 dark:text-slate-400">
              {formatRelativeTime(lastDate)}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <ClientActions
            client={row.original}
            onView={setViewingClient}
            onEdit={openEdit}
            onDelete={setDeletingClientId}
          />
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
              <button
                type="button"
                onClick={() => setViewingClient(client)}
                className="text-left cursor-pointer"
              >
                <h3 className="font-semibold text-gray-900 dark:text-slate-100 text-[0.95rem] line-clamp-1 hover:underline">
                  {client.fullName}
                </h3>
              </button>
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
          <ClientActions
            client={client}
            onView={setViewingClient}
            onEdit={openEdit}
            onDelete={setDeletingClientId}
          />
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
        {filter && (
          <button
            type="button"
            onClick={() => setFilter(null)}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter(null)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            !filter
              ? "bg-theme-primary text-white"
              : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
          }`}
        >
          All
        </button>
        {filterOptions.map((option) => (
          <button
            key={
              option.type === "group"
                ? `group:${option.id}`
                : `tag:${option.name}`
            }
            type="button"
            onClick={() => setFilter(option)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              sameFilter(filter, option)
                ? "bg-theme-primary text-white"
                : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
            }`}
          >
            {option.name}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-col gap-6 p-4 sm:p-6 lg:p-8">
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
          onClick={openAdd}
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
        onRowClick={setViewingClient}
        searchPlaceholder="Search"
        searchQuery={searchQuery}
        onSearchChange={(query) => {
          setSearchQuery(query);
          setCurrentPage(1);
        }}
        filterContent={filterPopoverContent}
        filterActiveCount={filter ? 1 : 0}
        renderGridItem={renderGridItem}
        pagination={{
          currentPage,
          totalPages: data?.pagination?.totalPages ?? 1,
          totalResults: totalClientsCount,
          pageSize,
          onPageChange: (page: number) => setCurrentPage(page),
          onPageSizeChange: (size) => {
            setPageSize(size);
            setCurrentPage(1);
          },
        }}
      />

      <ClientViewModal
        client={viewingClient}
        close={() => setViewingClient(null)}
        onEdit={openEditFromView}
      />

      {formOpen && <ClientFormModal close={closeForm} client={editingClient} />}

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
    </div>
  );
}
