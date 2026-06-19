import { clsx } from "clsx";
import type { JSX } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalResults: number;
  pageSize: number;
  onPageSizeChange?: (size: number) => void;
}

/** Trim the page list to a sliding window around the current page. */
function getPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "…")[] = [1];

  if (current > 3) pages.push("…");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("…");

  pages.push(total);
  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalResults,
  pageSize,
  onPageSizeChange,
}: Props): JSX.Element {
  const start = totalResults > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const end = Math.min(currentPage * pageSize, totalResults);
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex flex-col items-center justify-between gap-4 px-6 py-4 sm:flex-row">
      {/* Left: result count + rows-per-page */}
      <div className="flex items-center gap-5">
        <p className="text-xs text-gray-400 dark:text-slate-500 tabular-nums">
          <span className="font-semibold text-gray-700 dark:text-slate-200">
            {start}–{end}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-700 dark:text-slate-200">
            {totalResults.toLocaleString()}
          </span>
        </p>

        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 dark:text-slate-500 whitespace-nowrap">
              Rows
            </span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-7 rounded-lg border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-2 pr-6 text-xs font-medium text-gray-700 dark:text-slate-200 outline-none transition-colors cursor-pointer focus:ring-2 focus:ring-indigo-500/20 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1rem_1rem] bg-[right_0.25rem_center] bg-no-repeat"
            >
              {[5, 10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: page controls */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 dark:text-slate-500 transition-colors hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none"
        >
          <HiChevronLeft className="h-4 w-4" />
        </button>

        {/* Page numbers */}
        {pages.map((page, i) =>
          page === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className="flex h-8 w-8 items-center justify-center text-xs text-gray-400 dark:text-slate-500 select-none"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={clsx(
                "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-all",
                currentPage === page
                  ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-sm shadow-indigo-200 dark:shadow-indigo-900/40"
                  : "text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800",
              )}
            >
              {page}
            </button>
          ),
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 dark:text-slate-500 transition-colors hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none"
        >
          <HiChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
