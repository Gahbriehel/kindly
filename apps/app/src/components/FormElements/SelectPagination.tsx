import { type JSX, type MouseEvent } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface SelectPaginationProps {
  currentPage: number;
  totalCount: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export function SelectPagination({
  currentPage,
  totalCount,
  limit,
  onPageChange,
}: SelectPaginationProps): JSX.Element {
  const totalPages = Math.ceil(totalCount / limit);

  if (totalPages <= 1) return <></>;

  const buttonClass =
    "flex items-center gap-0.5 cursor-pointer rounded-md px-2 py-1 font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent dark:text-slate-200 dark:hover:bg-slate-700";

  // mousedown is cancelled so the search input keeps focus and the list stays open.
  const handle = (page: number) => ({
    onMouseDown: (e: MouseEvent<HTMLButtonElement>) => e.preventDefault(),
    onClick: (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onPageChange(page);
    },
  });

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-gray-100 bg-white px-3 py-2 text-xs text-gray-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
      <button
        type="button"
        disabled={currentPage <= 1}
        {...handle(currentPage - 1)}
        className={buttonClass}
      >
        <FiChevronLeft className="h-3 w-3" />
        Prev
      </button>
      <span className="text-center">
        Page {currentPage} of {totalPages}
        <span className="hidden sm:inline"> ({totalCount} items)</span>
      </span>
      <button
        type="button"
        disabled={currentPage >= totalPages}
        {...handle(currentPage + 1)}
        className={buttonClass}
      >
        Next
        <FiChevronRight className="h-3 w-3" />
      </button>
    </div>
  );
}
