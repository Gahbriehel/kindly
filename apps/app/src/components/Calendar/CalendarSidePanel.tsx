"use client";

import { useMemo, useState, type JSX, type Ref } from "react";
import dayjs from "dayjs";
import { clsx } from "clsx";
import {
  FiArrowLeft,
  FiChevronRight,
  FiEdit2,
  FiPlus,
  FiRepeat,
  FiTrash2,
} from "react-icons/fi";
import {
  eventDateKey,
  getEventDisplayName,
  todayKey,
  type DateKey,
} from "@/src/helpers/calendarHelpers";
import { getCategoryConfig } from "@/src/helpers/categoryConfig";
import { Skeleton } from "@/src/components/UI/Skeleton";
import type { IEvent } from "@/src/models/event";

interface Props {
  panelRef?: Ref<HTMLElement>;
  month: DateKey;
  /** Every event in the viewed month. */
  monthEvents: IEvent[];
  selected: DateKey | null;
  /** Events on the selected day. */
  dayEvents: IEvent[];
  loading?: boolean;
  onClear: () => void;
  /** Omitted when the user can't create events. */
  onAdd?: (date: DateKey) => void;
  onEventClick?: (event: IEvent) => void;
  onEdit?: (event: IEvent) => void;
  onDelete?: (id: string) => void;
}

/**
 * Month overview, or the selected day's events. On lg+ it is pinned to the
 * height of the calendar card and the list scrolls inside it.
 */
export function CalendarSidePanel({
  panelRef,
  month,
  monthEvents,
  selected,
  dayEvents,
  loading,
  onClear,
  onAdd,
  onEventClick,
  onEdit,
  onDelete,
}: Props): JSX.Element {
  const isDay = selected !== null;
  const today = todayKey();
  const isCurrentMonth = month.slice(0, 7) === today.slice(0, 7);

  const todayEvents = useMemo(() => {
    if (!isCurrentMonth) return [];
    return monthEvents.filter((event) => eventDateKey(event) === today);
  }, [isCurrentMonth, monthEvents, today]);

  const hasTodayEvents = todayEvents.length > 0;

  const [activeTab, setActiveTab] = useState<"today" | "month" | null>(null);
  const [viewedMonth, setViewedMonth] = useState(month);

  // Reset tab selection when month prop changes
  if (viewedMonth !== month) {
    setViewedMonth(month);
    setActiveTab(null);
  }

  const viewMode = activeTab ?? (hasTodayEvents ? "today" : "month");
  const showToday = !isDay && hasTodayEvents && viewMode === "today";
  const events = isDay ? dayEvents : showToday ? todayEvents : monthEvents;
  const isSingleDay = isDay || showToday;

  return (
    <aside ref={panelRef} className="relative min-w-0">
      <div className="flex max-h-[28rem] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-slate-800 dark:bg-theme-surface lg:absolute lg:inset-0 lg:max-h-none">
        <div className="flex shrink-0 items-center justify-between gap-2 px-5 pb-3 pt-5">
          {isDay ? (
            <div className="flex min-w-0 items-center gap-2">
              <button
                type="button"
                onClick={onClear}
                aria-label="Back to overview"
                className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <FiArrowLeft />
              </button>
              <h2 className="truncate text-sm font-semibold text-gray-900 dark:text-slate-100">
                {dayjs(selected).format("dddd, MMMM D")}
              </h2>
            </div>
          ) : hasTodayEvents ? (
            <div
              role="tablist"
              className="flex items-center rounded-xl bg-gray-100 p-0.5 dark:bg-slate-800/80"
            >
              <button
                type="button"
                role="tab"
                aria-selected={viewMode === "today"}
                onClick={() => setActiveTab("today")}
                className={clsx(
                  "flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all",
                  viewMode === "today"
                    ? "bg-white text-gray-900 shadow-xs dark:bg-theme-surface dark:text-white"
                    : "text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white",
                )}
              >
                <span className="size-1.5 rounded-full bg-theme-primary" />
                Today
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={viewMode === "month"}
                onClick={() => setActiveTab("month")}
                className={clsx(
                  "cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold transition-all",
                  viewMode === "month"
                    ? "bg-white text-gray-900 shadow-xs dark:bg-theme-surface dark:text-white"
                    : "text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white",
                )}
              >
                This Month
              </button>
            </div>
          ) : (
            <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
              {isCurrentMonth ? "This Month" : dayjs(month).format("MMMM YYYY")}
            </h2>
          )}
          <span className="shrink-0 text-xs text-gray-500 dark:text-slate-400">
            {loading
              ? ""
              : `${events.length} ${events.length === 1 ? "event" : "events"}`}
          </span>
        </div>

        <ul className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 pb-5 custom-scrollbar">
          {loading && events.length === 0 ? (
            [1, 2, 3, 4].map((n) => (
              <li key={n}>
                <Skeleton className="h-[72px] w-full rounded-xl" />
              </li>
            ))
          ) : events.length === 0 ? (
            <li className="flex flex-col items-center justify-center gap-3 py-10 text-center">
              <p className="text-sm font-medium text-gray-400 dark:text-slate-500">
                {isDay
                  ? "No events on this day"
                  : showToday
                    ? "No events today"
                    : "No events this month"}
              </p>
              {onAdd && (isDay || showToday) && (
                <button
                  type="button"
                  onClick={() => onAdd(selected ?? today)}
                  className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <FiPlus className="size-3.5" />
                  Add event
                </button>
              )}
            </li>
          ) : (
            events.map((event) => (
              <EventItem
                key={event.id + event.occurrenceDate}
                event={event}
                showDate={!isSingleDay}
                onClick={onEventClick ? () => onEventClick(event) : undefined}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </ul>
      </div>
    </aside>
  );
}

function EventItem({
  event,
  showDate,
  onClick,
  onEdit,
  onDelete,
}: {
  event: IEvent;
  showDate: boolean;
  onClick?: () => void;
  onEdit?: (event: IEvent) => void;
  onDelete?: (id: string) => void;
}): JSX.Element {
  const key = eventDateKey(event);
  const name = getEventDisplayName(event);
  const config = getCategoryConfig(event.category?.name ?? "");
  const Icon = config.icon;
  const isToday = key === todayKey();

  return (
    <li
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          if (e.target !== e.currentTarget) return;
          e.preventDefault();
          onClick();
        }
      }}
      className={clsx(
        "group flex items-center gap-4 rounded-2xl border p-3.5 transition-all duration-150 outline-none",
        onClick &&
          "cursor-pointer hover:border-indigo-200 hover:bg-indigo-50/30 hover:shadow-xs focus-visible:ring-2 focus-visible:ring-indigo-500/30 dark:hover:border-indigo-800/60 dark:hover:bg-indigo-950/20",
        isToday && showDate
          ? "border-indigo-100 bg-indigo-50/70 dark:border-indigo-900/40 dark:bg-indigo-950/30"
          : "border-gray-100 dark:border-slate-800 bg-white dark:bg-theme-surface",
      )}
    >
      {showDate && (
        <div className="w-10 shrink-0 text-center leading-tight">
          <div
            className={clsx(
              "text-[11px] font-medium uppercase tracking-wider",
              isToday
                ? "font-semibold text-indigo-600 dark:text-indigo-400"
                : "text-gray-400 dark:text-slate-500",
            )}
          >
            {dayjs(key).format("MMM")}
          </div>
          <div
            className={clsx(
              "text-xl",
              isToday
                ? "font-bold text-indigo-600 dark:text-indigo-400"
                : "font-semibold text-gray-900 dark:text-slate-100",
            )}
          >
            {dayjs(key).date()}
          </div>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p
          title={name}
          className="truncate text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors dark:text-slate-100 dark:group-hover:text-indigo-400"
        >
          {name}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span
            className={clsx(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
              config.bgClass,
            )}
          >
            <Icon className="size-3" />
            {config.label}
          </span>
          {event.isRecurring && (
            <span className="inline-flex items-center gap-1 rounded-full border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600 dark:border-indigo-800/40 dark:bg-indigo-950/40 dark:text-indigo-400">
              <FiRepeat className="size-3" />
              Annual
            </span>
          )}
        </div>
        {!showDate && event.notes && (
          <p className="mt-1.5 line-clamp-2 text-xs text-gray-500 dark:text-slate-400">
            {event.notes}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2 text-gray-500 dark:text-slate-400">
        {(onEdit || onDelete) && (
          <span className="flex w-auto items-center justify-end gap-2 opacity-100 transition-all duration-200 lg:w-0 lg:overflow-hidden lg:opacity-0 lg:group-hover:w-14 lg:group-hover:opacity-100 lg:group-focus-within:w-14 lg:group-focus-within:opacity-100">
            {onEdit && (
              <button
                type="button"
                aria-label="Edit event"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(event);
                }}
                className="cursor-pointer p-1 text-gray-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
              >
                <FiEdit2 className="size-4" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                aria-label="Delete event"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(event.id);
                }}
                className="cursor-pointer p-1 text-gray-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
              >
                <FiTrash2 className="size-4" />
              </button>
            )}
          </span>
        )}
        {onClick && (
          <FiChevronRight className="size-4 shrink-0 text-indigo-400 opacity-0 transition-all duration-150 group-hover:translate-x-0.5 group-hover:opacity-100 dark:text-indigo-400" />
        )}
      </div>
    </li>
  );
}
