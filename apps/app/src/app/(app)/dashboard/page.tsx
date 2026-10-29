"use client";
import { JSX, useMemo, useState } from "react";
import { StatsCardContainer, StatsCard } from "@/src/components/UI/StatsCard";
import { HiOutlineUsers } from "react-icons/hi";
import { IoChatbubbleOutline } from "react-icons/io5";
import { useDashboardQuery } from "@/src/hooks/useDashboardQuery";
import { useCategoriesQuery } from "@/src/hooks/useCategoryQuery";
import { useEventsQuery } from "@/src/hooks/useEventQuery";
import { Table } from "@/src/components/UI/Table";
import type { ColumnDef } from "@tanstack/react-table";
import type { IEvent } from "@/src/models/event";
import { getInitials } from "@/src/helpers/stringHelpers";
import { getRelativeDays, formatRelativeTime } from "@/src/helpers/dateHelpers";
import { getCategoryConfig } from "@/src/helpers/categoryConfig";
import dayjs from "dayjs";
import { SendClientMessageModal } from "@/src/components/Modals/SendClientMessageModal";
import { EventViewModal } from "@/src/components/Modals/EventViewModal";
import { usePermissions } from "@/src/hooks/usePermissions";

export default function DashboardPage(): JSX.Element {
  const { data, isLoading } = useDashboardQuery();
  const { can } = usePermissions();
  const canViewEvents = can("EVENT_VIEW");
  const canViewClients = can("CLIENT_VIEW");
  const [selectedEventForMessage, setSelectedEventForMessage] =
    useState<IEvent | null>(null);
  const [selectedEventForView, setSelectedEventForView] =
    useState<IEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [timeFilter, setTimeFilter] = useState<"upcoming" | "past" | "all">(
    "upcoming",
  );
  const [categoryId, setCategoryId] = useState("");
  const { data: categoriesData } = useCategoriesQuery();
  const categories = categoriesData?.data || [];
  const {
    data: eventsData,
    isLoading: isEventsLoading,
    isFetching: isEventsFetching,
    error: eventsError,
    refetch: refetchEvents,
  } = useEventsQuery(
    {
      filter: timeFilter,
      categoryId: categoryId || undefined,
      page: currentPage,
      limit: pageSize,
      search: searchQuery || undefined,
    },
    { enabled: canViewEvents },
  );

  const stats = data?.data.dashboard.stats;
  const upcomingEvents = eventsData?.data || [];
  const recentActivity = data?.data.dashboard.recentActivity || [];

  const activeFilterCount =
    (timeFilter !== "upcoming" ? 1 : 0) + (categoryId ? 1 : 0);

  const chipClass = (active: boolean) =>
    `px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
      active
        ? "bg-theme-primary text-white"
        : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
    }`;

  const filterContent = (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-2">
        <span className="text-xs font-bold text-gray-900 dark:text-slate-100 uppercase tracking-wider">
          Filters
        </span>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={() => {
              setTimeFilter("upcoming");
              setCategoryId("");
              setCurrentPage(1);
            }}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">
          Time
        </span>
        <div className="flex flex-wrap gap-2">
          {(["upcoming", "past", "all"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setTimeFilter(option);
                setCurrentPage(1);
              }}
              className={`${chipClass(timeFilter === option)} capitalize`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">
            Category
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setCategoryId("");
                setCurrentPage(1);
              }}
              className={chipClass(!categoryId)}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  setCategoryId(category.id);
                  setCurrentPage(1);
                }}
                className={chipClass(categoryId === category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const milestoneColumns = useMemo<ColumnDef<IEvent>[]>(
    () => [
      {
        id: "milestone",
        header: "Milestone",
        cell: ({ row }) => {
          const item = row.original;
          const clientNames = (item.participants || []).map(
            (p) => p.client?.fullName || "",
          );
          const clientName = clientNames.join(" & ") || item.title;
          const config = getCategoryConfig(item.category?.name || "");
          const IconComponent = config.icon;
          return (
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                {getInitials(clientNames[0] || item.title)}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-slate-100 text-sm truncate">
                    {clientName}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.bgClass}`}
                  >
                    <IconComponent className="size-3" />
                    {config.label}
                  </span>
                </div>
              </div>
            </div>
          );
        },
      },
      {
        id: "date",
        header: "Date",
        cell: ({ row }) => {
          const date = row.original.occurrenceDate || row.original.date;
          return (
            <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">
              {dayjs(date).format("MMMM D")}
            </span>
          );
        },
      },
      {
        id: "when",
        header: "When",
        cell: ({ row }) => (
          <span className="inline-flex items-center rounded-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 px-2.5 py-0.5 text-xs font-medium text-gray-500 dark:text-slate-400">
            {getRelativeDays(row.original.occurrenceDate || row.original.date)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedEventForMessage(row.original);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-all cursor-pointer"
            title="Send Message"
            aria-label="Send message to client"
          >
            <IoChatbubbleOutline className="size-4.5" />
          </button>
        ),
      },
    ],
    [],
  );

  return (
    <>
      {(canViewEvents || canViewClients) && (
        <StatsCardContainer className="mb-8">
          {canViewEvents && (
            <>
              <StatsCard
                label="Events this month"
                value={stats?.eventsThisMonth || 0}
                icon={<HiOutlineUsers className="w-5 h-5" />}
                isLoading={isLoading}
              />
              <StatsCard
                label="Upcoming Events"
                value={stats?.upcomingEvents || 0}
                icon={<HiOutlineUsers className="w-5 h-5" />}
                isLoading={isLoading}
              />
            </>
          )}
          {canViewClients && (
            <StatsCard
              label="Active Clients"
              value={stats?.activeClients || 0}
              icon={<HiOutlineUsers className="w-5 h-5" />}
              isLoading={isLoading}
            />
          )}
        </StatsCardContainer>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Milestones */}
        {canViewEvents && (
          <div className="lg:col-span-2">
            <Table
              title="Milestones"
              data={upcomingEvents}
              columns={milestoneColumns}
              loading={isEventsLoading}
              error={!!eventsError}
              supportedViews={["list"]}
              onRowClick={(item) => setSelectedEventForView(item)}
              filterContent={filterContent}
              filterActiveCount={activeFilterCount}
              onRefetch={() => void refetchEvents()}
              isRefetching={isEventsFetching}
              searchPlaceholder="Search"
              searchQuery={searchQuery}
              onSearchChange={(query) => {
                setSearchQuery((prev) => {
                  if (prev === query) return prev;
                  setCurrentPage(1);
                  return query;
                });
              }}
              pagination={{
                currentPage,
                totalPages: eventsData?.pagination?.totalPages ?? 1,
                totalResults: eventsData?.pagination?.total ?? 0,
                pageSize,
                onPageChange: (page: number) => setCurrentPage(page),
                onPageSizeChange: (size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                },
              }}
            />
          </div>
        )}

        {/* Right Column */}
        <div
          className={`flex flex-col gap-5 ${canViewEvents ? "" : "lg:col-span-3"}`}
        >
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-slate-100 font-geist">
            Recent Activity
          </h2>
          <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-theme-surface p-6">
            {isLoading ? (
              <div className="space-y-5 animate-pulse">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="flex items-start gap-3">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-200 dark:bg-slate-800" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-full bg-gray-100 dark:bg-slate-800 rounded" />
                      <div className="h-3 w-16 bg-gray-100 dark:bg-slate-800 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="space-y-5">
                {recentActivity.map((activity, idx) => (
                  <div
                    key={activity.refId || idx}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-slate-300">
                        {activity.label}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-slate-500 mt-1 font-medium">
                        {formatRelativeTime(activity.at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <p className="text-sm text-gray-400 dark:text-slate-500 font-medium">
                  No recent activity
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <SendClientMessageModal
        display={!!selectedEventForMessage}
        close={() => setSelectedEventForMessage(null)}
        event={selectedEventForMessage}
      />

      <EventViewModal
        event={selectedEventForView}
        close={() => setSelectedEventForView(null)}
        viewOnly
      />
    </>
  );
}
