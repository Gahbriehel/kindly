import dayjs from "dayjs";

/**
 * Returns a human-readable relative label for a date.
 * e.g. "Today", "in 2d", "3d ago"
 */
export function getRelativeDays(dateStr: string): string {
  if (!dateStr) return "";
  const target = dayjs(dateStr).startOf("day");
  const today = dayjs().startOf("day");
  const diff = target.diff(today, "day");

  if (diff === 0) return "Today";
  if (diff === 1) return "in 1d";
  if (diff > 1) return `in ${diff}d`;
  if (diff === -1) return "1d ago";
  if (diff < -1) return `${Math.abs(diff)}d ago`;
  return "";
}

/**
 * Returns a human-readable relative time string for a datetime.
 * e.g. "Just now", "5m ago", "2 hours ago", "Yesterday", "Jun 12, 2025"
 */
export function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return "";
  const date = dayjs(dateStr);
  const now = dayjs();
  const diffInMins = now.diff(date, "minute");
  const diffInHours = now.diff(date, "hour");
  const diffInDays = now.diff(date, "day");

  if (diffInMins < 1) return "Just now";
  if (diffInMins < 60) return `${diffInMins}m ago`;
  if (diffInHours < 24) {
    return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
  }
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  return date.format("MMM DD, YYYY");
}

/** Today's date as a `YYYY-MM-DD` string, for `<input type="date" max>`. */
export function todayInputValue(): string {
  return dayjs().format("YYYY-MM-DD");
}

/** Form validator: passes for empty values or dates that are not in the future. */
export function validateNotFutureDate(
  value: unknown,
  message = "Date cannot be in the future",
): true | string {
  return !value || (value as string) <= todayInputValue() || message;
}
