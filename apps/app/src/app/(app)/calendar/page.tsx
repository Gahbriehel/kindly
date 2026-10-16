"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type JSX,
} from "react";
import dayjs from "dayjs";
import { FiChevronLeft, FiChevronRight, FiPlus } from "react-icons/fi";
import { BaseButton } from "@/src/components/UI/Buttons";
import { CalendarGrid } from "@/src/components/Calendar/CalendarGrid";
import { CalendarSidePanel } from "@/src/components/Calendar/CalendarSidePanel";
import { CategoryChips } from "@/src/components/Calendar/CategoryChips";
import { MonthPicker } from "@/src/components/Calendar/MonthPicker";
import { EventFormDrawer } from "@/src/components/Forms/EventFormDrawer";
import { useCategoriesQuery } from "@/src/hooks/useCategoryQuery";
import { useCalendarEventsQuery } from "@/src/hooks/useEventQuery";
import {
  addMonths,
  groupEventsByDate,
  monthKey,
  monthRange,
  todayKey,
  type DateKey,
} from "@/src/helpers/calendarHelpers";

const iconButton =
  "flex size-9 cursor-pointer items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800";

export default function CalendarPage(): JSX.Element {
  const [month, setMonth] = useState<DateKey>(() =>
    dayjs().startOf("month").format("YYYY-MM-DD"),
  );
  const [selected, setSelected] = useState<DateKey | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [adding, setAdding] = useState<{ date?: DateKey } | null>(null);
  const panelRef = useRef<HTMLElement>(null);

  const { data: categoriesData } = useCategoriesQuery();
  const categories = categoriesData?.data ?? [];

  const { start, end } = useMemo(() => monthRange(month), [month]);
  const { data, isLoading, isFetching, isError, refetch } =
    useCalendarEventsQuery({
      start,
      end,
      categoryId: categoryId || undefined,
    });

  const events = useMemo(() => data?.data ?? [], [data]);
  const eventsByDate = useMemo(() => groupEventsByDate(events), [events]);

  // Changing month clears the selected day, returning the panel to the overview.
  const changeMonth = useCallback((next: DateKey) => {
    setMonth(next);
    setSelected(null);
  }, []);

  const handleSelect = (date: DateKey) => {
    setSelected((prev) => (prev === date ? null : date));
  };

  // Below lg the panel sits under the grid, so bring it into view.
  useEffect(() => {
    if (selected && window.innerWidth < 1024) {
      panelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selected]);

  const isCurrentMonth = monthKey(month) === monthKey(todayKey());

  return (
    <div className="flex flex-1 flex-col gap-4 lg:gap-6">
      <div className="grid flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-6">
        <section className="flex min-w-0 flex-col rounded-2xl border border-gray-100 bg-white p-4 dark:border-slate-800 dark:bg-theme-surface md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-1">
              <button
                type="button"
                className={iconButton}
                onClick={() => changeMonth(addMonths(month, -1))}
                aria-label="Previous month"
              >
                <FiChevronLeft className="size-5" />
              </button>
              <MonthPicker month={month} onChange={changeMonth} />
              <button
                type="button"
                className={iconButton}
                onClick={() => changeMonth(addMonths(month, 1))}
                aria-label="Next month"
              >
                <FiChevronRight className="size-5" />
              </button>
              {!isCurrentMonth && (
                <button
                  type="button"
                  onClick={() =>
                    changeMonth(dayjs().startOf("month").format("YYYY-MM-DD"))
                  }
                  className="ml-1 cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-semibold text-theme-primary hover:bg-theme-primary/10"
                >
                  Today
                </button>
              )}
            </div>
            <BaseButton
              color="primary"
              icon={<FiPlus className="size-4" />}
              text="Add Event"
              onClick={() => setAdding({ date: selected ?? undefined })}
              className="shrink-0 max-sm:size-10 max-sm:px-0 max-sm:[&>span]:hidden"
              aria-label="Add event"
            />
          </div>

          <div className="mt-4">
            <CategoryChips
              categories={categories}
              value={categoryId}
              onChange={(id) => {
                setCategoryId(id);
                setSelected(null);
              }}
            />
          </div>

          {isError ? (
            <div className="flex flex-1 items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3 text-center">
                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Couldn&apos;t load events for this month.
                </p>
                <BaseButton
                  color="outline"
                  text="Try again"
                  onClick={() => void refetch()}
                />
              </div>
            </div>
          ) : (
            <div className="mt-4 flex min-h-0 flex-1 flex-col md:mt-6">
              <CalendarGrid
                month={month}
                eventsByDate={eventsByDate}
                selected={selected}
                loading={isLoading || isFetching}
                onSelect={handleSelect}
              />
            </div>
          )}
        </section>

        <CalendarSidePanel
          panelRef={panelRef}
          month={month}
          monthEvents={events}
          selected={selected}
          dayEvents={selected ? (eventsByDate.get(selected) ?? []) : []}
          loading={isLoading}
          onClear={() => setSelected(null)}
          onAdd={(date) => setAdding({ date })}
        />
      </div>

      {adding && (
        <EventFormDrawer
          defaultDate={adding.date}
          close={() => setAdding(null)}
        />
      )}
    </div>
  );
}
