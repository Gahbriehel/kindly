import dayjs from "dayjs";
import type { IEvent } from "../models/event";

/**
 * Event dates arrive as UTC-midnight ISO strings. Everything on the calendar
 * works on `YYYY-MM-DD` keys taken straight from the string, never via a local
 * `Date`, so a birthday on the 7th never shifts to the 6th west of UTC.
 */
export type DateKey = string;

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function toDateKey(iso: string): DateKey {
  return iso.slice(0, 10);
}

export function todayKey(): DateKey {
  return dayjs().format("YYYY-MM-DD");
}

export function monthKey(date: DateKey): string {
  return date.slice(0, 7);
}

export function eventDateKey(event: IEvent): DateKey {
  return toDateKey(event.occurrenceDate ?? event.date);
}

/** First and last day of the month containing `month` (any day of it). */
export function monthRange(month: DateKey): { start: DateKey; end: DateKey } {
  const d = dayjs(month);
  return {
    start: d.startOf("month").format("YYYY-MM-DD"),
    end: d.endOf("month").format("YYYY-MM-DD"),
  };
}

export interface CalendarCell {
  /** `null` for the padding cells before day 1 and after the last day. */
  key: DateKey | null;
  day: number;
}

/** Sunday-first grid for the month, padded to whole weeks. */
export function buildMonthCells(month: DateKey): CalendarCell[] {
  const first = dayjs(month).startOf("month");
  const total = first.daysInMonth();
  const lead = first.day();
  const cells: CalendarCell[] = [];
  for (let i = 0; i < lead; i++) cells.push({ key: null, day: 0 });
  for (let d = 1; d <= total; d++) {
    cells.push({ key: first.date(d).format("YYYY-MM-DD"), day: d });
  }
  while (cells.length % 7 !== 0) cells.push({ key: null, day: 0 });
  return cells;
}

export function addMonths(date: DateKey, amount: number): DateKey {
  return dayjs(date).startOf("month").add(amount, "month").format("YYYY-MM-DD");
}

/** Clients' names joined with "&"; falls back to the event title. */
export function getEventDisplayName(event: IEvent): string {
  const names = (event.participants ?? [])
    .map((p) => p.client?.fullName)
    .filter(Boolean);
  return names.join(" & ") || event.title;
}

export function groupEventsByDate(events: IEvent[]): Map<DateKey, IEvent[]> {
  const map = new Map<DateKey, IEvent[]>();
  for (const event of events) {
    const key = eventDateKey(event);
    const list = map.get(key);
    if (list) list.push(event);
    else map.set(key, [event]);
  }
  return map;
}

/** Formats how far an event date is from today (e.g. "Today", "Tomorrow", "in 5 days", "3 days ago"). */
export function getEventTimingLabel(dateStr: string): string {
  const today = dayjs().startOf("day");
  const eventDay = dayjs(dateStr).startOf("day");
  const diff = eventDay.diff(today, "day");
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff > 1) return `in ${diff} days`;
  return `${Math.abs(diff)} days ago`;
}
