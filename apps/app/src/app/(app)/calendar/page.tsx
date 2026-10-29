"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type JSX,
} from "react";
import { useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import { FiChevronLeft, FiChevronRight, FiPlus } from "react-icons/fi";
import { BaseButton } from "@/src/components/UI/Buttons";
import { PageLoader } from "@/src/components/UI/PageLoader";
import { CalendarGrid } from "@/src/components/Calendar/CalendarGrid";
import { CalendarSidePanel } from "@/src/components/Calendar/CalendarSidePanel";
import { CategoryChips } from "@/src/components/Calendar/CategoryChips";
import { MonthPicker } from "@/src/components/Calendar/MonthPicker";
import { EventFormDrawer } from "@/src/components/Forms/EventFormDrawer";
import { EventViewModal } from "@/src/components/Modals/EventViewModal";
import { ConfirmActionModal } from "@/src/components/Modals/ConfirmActionModal";
import { useCategoriesQuery } from "@/src/hooks/useCategoryQuery";
import {
  useCalendarEventsQuery,
  useDeleteEvent,
} from "@/src/hooks/useEventQuery";
import { customToast } from "@/src/helpers/customToast";
import {
  addMonths,
  groupEventsByDate,
  monthKey,
  monthRange,
  todayKey,
  type DateKey,
} from "@/src/helpers/calendarHelpers";
import type { IEvent } from "@/src/models/event";
import { usePermissions } from "@/src/hooks/usePermissions";

const iconButton =
  "flex size-9 cursor-pointer items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800";

function CalendarContent({
  dateParam,
}: {
  dateParam: string | null;
}): JSX.Element {
  const [month, setMonth] = useState<DateKey>(() => {
    if (dateParam && dayjs(dateParam).isValid()) {
      return dayjs(dateParam).startOf("month").format("YYYY-MM-DD");
    }
    return dayjs().startOf("month").format("YYYY-MM-DD");
  });
  const [selected, setSelected] = useState<DateKey | null>(() => {
    if (dateParam && dayjs(dateParam).isValid()) {
      return dayjs(dateParam).format("YYYY-MM-DD");
    }
    return null;
  });
  const [categoryId, setCategoryId] = useState("");
  const [viewingSnapshot, setViewingEvent] = useState<IEvent | null>(null);
  const [returnToView, setReturnToView] = useState<IEvent | null>(null);
  const [drawerState, setDrawerState] = useState<{
    defaultDate?: DateKey;
    event?: IEvent | null;
  } | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

  const panelRef = useRef<HTMLElement>(null);

  const { data: categoriesData } = useCategoriesQuery();
  const categories = categoriesData?.data ?? [];

  const { start, end } = useMemo(() => monthRange(month), [month]);
  const { data, isLoading, isFetching, isPlaceholderData, isError, refetch } =
    useCalendarEventsQuery({
      start,
      end,
      categoryId: categoryId || undefined,
    });

  const events = useMemo(() => data?.data ?? [], [data]);
  const eventsByDate = useMemo(() => groupEventsByDate(events), [events]);

  // Keep viewingEvent updated if query data updates
  const viewingEvent = viewingSnapshot
    ? (events.find((e) => e.id === viewingSnapshot.id) ?? viewingSnapshot)
    : null;

  const deleteMutation = useDeleteEvent({
    onSuccess: () => {
      customToast.success("Event deleted successfully");
      setDeletingEventId(null);
      setViewingEvent(null);
    },
  });

  const { can } = usePermissions();
  const canCreate = can("EVENT_CREATE");
  const canEdit = can("EVENT_UPDATE");

  const openAdd = (date?: DateKey) => {
    setDrawerState({ defaultDate: date ?? selected ?? undefined });
  };

  const openEdit = (event: IEvent) => {
    setReturnToView(null);
    setViewingEvent(null);
    setDrawerState({ event });
  };

  const openEditFromView = (event: IEvent) => {
    setReturnToView(event);
    setViewingEvent(null);
    setDrawerState({ event });
  };

  const closeForm = () => {
    setDrawerState(null);
    if (returnToView) {
      setViewingEvent(returnToView);
      setReturnToView(null);
    }
  };

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
            {canCreate && (
              <BaseButton
                color="primary"
                icon={<FiPlus className="size-4" />}
                onClick={() => openAdd(selected ?? undefined)}
                className="shrink-0 max-sm:size-10 max-sm:px-0"
                aria-label="Add event"
              >
                <span className="hidden sm:inline">Add Event</span>
              </BaseButton>
            )}
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
                loading={isLoading || isPlaceholderData}
                fetching={isFetching}
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
          onAdd={canCreate ? (date) => openAdd(date) : undefined}
          onEventClick={setViewingEvent}
          onEdit={canEdit ? openEdit : undefined}
          onDelete={can("EVENT_DELETE") ? setDeletingEventId : undefined}
        />
      </div>

      <EventViewModal
        event={viewingEvent}
        close={() => setViewingEvent(null)}
        onEdit={canEdit ? openEditFromView : undefined}
      />

      {drawerState && (
        <EventFormDrawer
          key={drawerState.event?.id ?? "new"}
          defaultDate={drawerState.defaultDate}
          event={drawerState.event}
          close={closeForm}
        />
      )}

      <ConfirmActionModal
        actionName="Delete"
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        display={!!deletingEventId}
        close={() => setDeletingEventId(null)}
        loading={deleteMutation.isPending}
        fn={() => {
          if (deletingEventId) {
            deleteMutation.mutate(deletingEventId);
          }
        }}
      />
    </div>
  );
}

function CalendarParamWrapper(): JSX.Element {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");
  return <CalendarContent key={dateParam || "default"} dateParam={dateParam} />;
}

export default function CalendarPage(): JSX.Element {
  return (
    <Suspense fallback={<PageLoader />}>
      <CalendarParamWrapper />
    </Suspense>
  );
}
