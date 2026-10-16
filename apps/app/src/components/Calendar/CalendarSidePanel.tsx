"use client";

import type { JSX, Ref } from "react";
import dayjs from "dayjs";
import { clsx } from "clsx";
import { FiArrowLeft, FiPlus, FiRepeat } from "react-icons/fi";
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
}: {
  event: IEvent;
  showDate: boolean;
}): JSX.Element {
  const key = eventDateKey(event);
  const name = getEventDisplayName(event);
  const config = getCategoryConfig(event.category?.name ?? "");
  const Icon = config.icon;
  const isToday = key === todayKey();

  return (
    <li
      className={clsx(
        "flex items-center gap-4 rounded-xl border p-3",
        isToday && showDate
          ? "border-transparent bg-theme-primary/10 dark:bg-theme-primary/20"
          : "border-gray-100 dark:border-slate-800",
      )}
    >
      {showDate && (
        <div className="w-10 shrink-0 text-center leading-tight">
          <div className="text-[11px] text-gray-500 dark:text-slate-400">
            {dayjs(key).format("MMM")}
          </div>
          <div className="text-xl font-medium text-gray-900 dark:text-slate-100">
            {dayjs(key).date()}
          </div>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p
          title={name}
          className="truncate text-sm font-medium text-gray-900 dark:text-slate-100"
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
            <FiRepeat
              className="size-3 text-gray-400 dark:text-slate-500"
              aria-label="Recurring"
            />
          )}
        </div>
        {!showDate && event.notes && (
          <p className="mt-1.5 line-clamp-2 text-xs text-gray-500 dark:text-slate-400">
            {event.notes}
          </p>
        )}
      </div>
    </li>
  );
}
