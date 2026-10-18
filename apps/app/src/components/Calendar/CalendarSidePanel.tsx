"use client";

import type { JSX, Ref } from "react";
import dayjs from "dayjs";
import { clsx } from "clsx";
import { FiArrowLeft, FiChevronRight, FiPlus, FiRepeat } from "react-icons/fi";
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
  onAdd: (date: DateKey) => void;
  onEventClick?: (event: IEvent) => void;
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
}: Props): JSX.Element {
  const isDay = selected !== null;
  const events = isDay ? dayEvents : monthEvents;
  const isCurrentMonth = month.slice(0, 7) === todayKey().slice(0, 7);

  return (
    <aside ref={panelRef} className="relative min-w-0">
      <div className="flex max-h-[28rem] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-slate-800 dark:bg-theme-surface lg:absolute lg:inset-0 lg:max-h-none">
        <div className="flex shrink-0 items-center justify-between gap-2 px-5 pb-3 pt-5">
          {isDay ? (
            <div className="flex min-w-0 items-center gap-2">
              <button
                type="button"
                onClick={onClear}
                aria-label="Back to month overview"
                className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <FiArrowLeft />
              </button>
              <h2 className="truncate text-sm font-semibold text-gray-900 dark:text-slate-100">
                {dayjs(selected).format("dddd, MMMM D")}
              </h2>
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
                {isDay ? "No events on this day" : "No events this month"}
              </p>
              {isDay && (
                <button
                  type="button"
                  onClick={() => onAdd(selected)}
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
                showDate={!isDay}
                onClick={onEventClick ? () => onEventClick(event) : undefined}
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
}: {
  event: IEvent;
  showDate: boolean;
  onClick?: () => void;
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
      {onClick && (
        <FiChevronRight className="size-4 shrink-0 text-indigo-400 opacity-0 transition-all duration-150 group-hover:translate-x-0.5 group-hover:opacity-100 dark:text-indigo-400" />
      )}
    </li>
  );
}
