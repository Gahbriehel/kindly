"use client";
import { JSX, useState } from "react";
import { StatsCardContainer, StatsCard } from "@/src/components/UI/StatsCard";
import { HiOutlineUsers } from "react-icons/hi";
import { IoChatbubbleOutline } from "react-icons/io5";
import { useDashboardQuery } from "@/src/hooks/useDashboardQuery";
import { SearchInput } from "@/src/components/UI/Table/SearchInput";
import { getInitials } from "@/src/helpers/stringHelpers";
import { getRelativeDays, formatRelativeTime } from "@/src/helpers/dateHelpers";
import { getCategoryConfig } from "@/src/helpers/categoryConfig";
import dayjs from "dayjs";

interface IClient {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}

interface IDashboardEvent {
  eventId: string;
  title: string;
  category: string;
  notes: string;
  clients?: IClient | IClient[];
}

// Safe helpers for Today's Outreach events (since client format can vary)
function getClientNamesFromEvent(event: IDashboardEvent): string {
  if (!event) return "";
  if (Array.isArray(event.clients)) {
    return (event.clients as IClient[])
      .map((c) => c.fullName)
      .filter(Boolean)
      .join(" & ");
  }
  if (event.clients && typeof event.clients === "object") {
    return (event.clients as IClient).fullName || "";
  }
  return "";
}

function getFirstClientFromEvent(event: IDashboardEvent): string {
  if (!event) return "";
  if (Array.isArray(event.clients)) {
    return (event.clients as IClient[])[0]?.fullName || "";
  }
  if (event.clients && typeof event.clients === "object") {
    return (event.clients as IClient).fullName || "";
  }
  return "";
}

export default function DashboardPage(): JSX.Element {
  const { data, isLoading } = useDashboardQuery();
  const [searchQuery, setSearchQuery] = useState("");

  const stats = data?.data.dashboard.stats;
  const upcomingPreview = data?.data.dashboard.upcomingPreview || [];
  const todaysEvents = data?.data.dashboard.todaysOutreach?.events || [];
  const todaysOutreachDate = data?.data.dashboard.todaysOutreach?.date || "";
  const recentActivity = data?.data.dashboard.recentActivity || [];

  // Filter milestones by search query
  const filteredMilestones = upcomingPreview.filter((item) => {
    const query = searchQuery.toLowerCase();
    const names = (item.clientNames || []).join(" ").toLowerCase();
    const category = (item.category || "").toLowerCase();
    const title = (item.title || "").toLowerCase();
    return (
      names.includes(query) || category.includes(query) || title.includes(query)
    );
  });

  return (
    <>
      <StatsCardContainer>
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
        <StatsCard
          label="Active Clients"
          value={stats?.activeClients || 0}
          icon={<HiOutlineUsers className="w-5 h-5" />}
          isLoading={isLoading}
        />
      </StatsCardContainer>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Left Column - Milestones */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100 font-serif">
              Milestones
            </h2>
            <div className="w-full sm:w-72">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search"
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div
                    key={n}
                    className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-slate-800/50 last:border-0 animate-pulse"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-full bg-gray-100 dark:bg-slate-800 shrink-0" />
                      <div className="space-y-2">
                        <div className="h-4 w-36 bg-gray-100 dark:bg-slate-800 rounded" />
                        <div className="h-3.5 w-16 bg-gray-100 dark:bg-slate-800 rounded" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-12 bg-gray-100 dark:bg-slate-800 rounded-full" />
                      <div className="h-9 w-9 bg-gray-100 dark:bg-slate-800 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredMilestones.length > 0 ? (
              <div className="divide-y divide-gray-100 dark:divide-slate-800/50">
                {filteredMilestones.map((item) => {
                  const clientName = item.clientNames.join(" & ");
                  const initials = getInitials(item.clientNames[0] || "");
                  const config = getCategoryConfig(item.category);
                  const IconComponent = config.icon;

                  return (
                    <div
                      key={item.eventId}
                      className="flex items-center justify-between p-5 sm:px-6 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-gray-900 dark:text-slate-100 text-sm sm:text-base truncate">
                              {clientName}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.bgClass}`}
                            >
                              <IconComponent className="size-3" />
                              {config.label}
                            </span>
                          </div>
                          <span className="block text-xs text-gray-400 dark:text-slate-500 font-medium mt-1">
                            {dayjs(item.date).format("MMMM D")}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <span className="inline-flex items-center rounded-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 px-2.5 py-0.5 text-xs font-medium text-gray-500 dark:text-slate-400">
                          {getRelativeDays(item.date)}
                        </span>
                        <button className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-all cursor-pointer">
                          <IoChatbubbleOutline className="size-4.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <p className="text-sm text-gray-400 dark:text-slate-500 font-medium">
                  No upcoming milestones found
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Today's Events */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100 font-serif">
              Today's events
            </h2>
            <div className="rounded-[2rem] border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
              {isLoading ? (
                <div className="p-5 space-y-4">
                  {[1, 2].map((n) => (
                    <div
                      key={n}
                      className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-slate-800/50 last:border-0 animate-pulse"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-slate-800 shrink-0" />
                        <div className="space-y-2">
                          <div className="h-4 w-28 bg-gray-100 dark:bg-slate-800 rounded" />
                          <div className="h-3 w-16 bg-gray-100 dark:bg-slate-800 rounded" />
                        </div>
                      </div>
                      <div className="h-8 w-8 bg-gray-100 dark:bg-slate-800 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : todaysEvents.length > 0 ? (
                <div className="divide-y divide-gray-100 dark:divide-slate-800/50">
                  {todaysEvents.map((event) => {
                    const clientName = getClientNamesFromEvent(event);
                    const firstClientName = getFirstClientFromEvent(event);
                    const initials = getInitials(firstClientName);
                    const config = getCategoryConfig(event.category);
                    const IconComponent = config.icon;

                    return (
                      <div
                        key={event.eventId}
                        className="flex items-center justify-between p-5 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-gray-900 dark:text-slate-100 text-sm truncate">
                                {clientName}
                              </span>
                              <span
                                className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold ${config.bgClass}`}
                              >
                                <IconComponent className="size-2.5" />
                                {config.label}
                              </span>
                            </div>
                            <span className="block text-xs text-gray-400 dark:text-slate-500 font-medium mt-1">
                              {todaysOutreachDate
                                ? dayjs(todaysOutreachDate).format("MMMM D")
                                : dayjs().format("MMMM D")}
                            </span>
                          </div>
                        </div>

                        <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-all cursor-pointer">
                          <IoChatbubbleOutline className="size-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <p className="text-sm text-gray-400 dark:text-slate-500 font-medium">
                    No outreach events for today
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100 font-serif">
              Recent Activity
            </h2>
            <div className="rounded-[2rem] border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
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
      </div>
    </>
  );
}
