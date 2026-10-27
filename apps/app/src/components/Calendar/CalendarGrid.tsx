"use client";

import { useMemo, type JSX, type KeyboardEvent } from "react";
import dayjs from "dayjs";
import { clsx } from "clsx";
import {
  WEEKDAYS,
  buildMonthCells,
  getEventDisplayName,
  todayKey,
  type DateKey,
} from "@/src/helpers/calendarHelpers";
import { getCategoryDotClass } from "@/src/helpers/categoryConfig";
import { Skeleton } from "@/src/components/UI/Skeleton";
import type { IEvent } from "@/src/models/event";

interface Props {
  month: DateKey;
  eventsByDate: Map<DateKey, IEvent[]>;
  selected: DateKey | null;
  /** No data for this month yet: render placeholder chips in each cell. */
  loading?: boolean;
  /** Background refetch over existing data: just dim the grid. */
  fetching?: boolean;
  onSelect: (date: DateKey) => void;
}

const MAX_CHIPS = 2;
const MAX_DOTS = 3;

/** Sunday-first month grid. Chips on md+, compact dots on small screens. */
export function CalendarGrid({
  month,
  eventsByDate,
  selected,
  loading,
  fetching,
  onSelect,
}: Props): JSX.Element {
  const cells = useMemo(() => buildMonthCells(month), [month]);
  const today = todayKey();

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const key = (e.target as HTMLElement).dataset.date;
    if (!key) return;
    const step =
      e.key === "ArrowLeft"
        ? -1
        : e.key === "ArrowRight"
          ? 1
          : e.key === "ArrowUp"
            ? -7
            : e.key === "ArrowDown"
              ? 7
              : 0;
    if (!step) return;
    e.preventDefault();
    const next = dayjs(key).add(step, "day").format("YYYY-MM-DD");
    e.currentTarget
      .querySelector<HTMLElement>(`[data-date="${next}"]`)
      ?.focus();
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-2 grid grid-cols-7 gap-1.5 md:gap-2">
        {WEEKDAYS.map((day, i) => (
          <div
            key={day}
            className={clsx(
              "py-1 text-center text-[11px] font-semibold md:text-sm",
              i === dayjs(today).day() && monthMatches(month, today)
                ? "text-theme-primary"
                : "text-gray-500 dark:text-slate-400",
            )}
          >
            <span className="md:hidden">{day[0]}</span>
            <span className="hidden md:inline">{day}</span>
          </div>
        ))}
      </div>

      <div
        role="grid"
        aria-busy={loading || fetching}
        onKeyDown={handleKeyDown}
        className={clsx(
          "grid flex-1 auto-rows-fr grid-cols-7 gap-1.5 transition-opacity md:gap-2",
          fetching && !loading && "opacity-60",
        )}
      >
        {cells.map((cell, index) => {
          if (!cell.key) return <div key={`pad-${index}`} aria-hidden />;
          const events = eventsByDate.get(cell.key) ?? [];
          const isToday = cell.key === today;
          const isSelected = cell.key === selected;
          return (
            <button
              key={cell.key}
              type="button"
              data-date={cell.key}
              aria-pressed={isSelected}
              aria-label={
                loading
                  ? dayjs(cell.key).format("MMMM D")
                  : `${dayjs(cell.key).format("MMMM D")}, ${events.length} ${events.length === 1 ? "event" : "events"}`
              }
              onClick={() => onSelect(cell.key as DateKey)}
              className={clsx(
                "flex min-h-[3.25rem] min-w-0 cursor-pointer flex-col items-center rounded-xl border p-1.5 transition-colors md:min-h-[5.5rem] md:items-stretch md:p-2",
                isSelected
                  ? "border-theme-primary bg-theme-primary/5 ring-1 ring-theme-primary"
                  : isToday
                    ? "border-theme-primary/60 bg-white dark:bg-theme-surface"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-slate-800 dark:bg-theme-surface dark:hover:border-slate-700 dark:hover:bg-slate-800/50",
              )}
            >
              <span
                className={clsx(
                  "text-xs font-medium md:text-sm",
                  isToday
                    ? "text-theme-primary"
                    : "text-gray-700 dark:text-slate-300",
                )}
              >
                {cell.day}
              </span>

              {loading ? (
                <CellSkeleton seed={cell.day} />
              ) : (
                <>
                  {/* Small screens: up to three category dots. */}
                  {events.length > 0 && (
                    <span className="mt-1.5 flex items-center gap-0.5 md:hidden">
                      {events.slice(0, MAX_DOTS).map((event) => (
                        <span
                          key={event.id + event.occurrenceDate}
                          className={clsx(
                            "size-1.5 rounded-full",
                            getCategoryDotClass(event.category?.name),
                          )}
                        />
                      ))}
                      {events.length > MAX_DOTS && (
                        <span className="ml-0.5 text-[9px] font-semibold leading-none text-gray-400">
                          +{events.length - MAX_DOTS}
                        </span>
                      )}
                    </span>
                  )}

                  {/* md and up: name chips with an overflow counter. */}
                  <span className="mt-1 hidden min-w-0 flex-col gap-1 md:flex">
                    {events.slice(0, MAX_CHIPS).map((event) => (
                      <span
                        key={event.id + event.occurrenceDate}
                        className="flex min-w-0 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-gray-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      >
                        <span
                          className={clsx(
                            "size-1.5 shrink-0 rounded-full",
                            getCategoryDotClass(event.category?.name),
                          )}
                        />
                        <span className="truncate">
                          {getEventDisplayName(event)}
                        </span>
                      </span>
                    ))}
                    {events.length > MAX_CHIPS && (
                      <span className="px-1 text-[11px] font-semibold text-theme-primary">
                        +{events.length - MAX_CHIPS} more
                      </span>
                    )}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Varies placeholder chip count per day so the grid doesn't look uniform. */
function CellSkeleton({ seed }: { seed: number }): JSX.Element {
  const chips = (seed * 7) % 3;
  return (
    <>
      <Skeleton className="mt-1.5 h-1.5 w-4 rounded-full md:hidden" />
      <span className="mt-1 hidden min-w-0 flex-col gap-1 md:flex">
        {Array.from({ length: chips }, (_, i) => (
          <Skeleton
            key={i}
            className={clsx("h-[18px]", i === 0 ? "w-full" : "w-3/4")}
          />
        ))}
      </span>
    </>
  );
}

function monthMatches(month: DateKey, date: DateKey): boolean {
  return month.slice(0, 7) === date.slice(0, 7);
}
