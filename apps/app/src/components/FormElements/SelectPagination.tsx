import { type JSX } from "react";
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

  return (
    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2 text-xs text-gray-500 dark:border-slate-700 dark:text-slate-400">
      <span>
        Page {currentPage} of {totalPages} ({totalCount} items)
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={(e) => {
            e.stopPropagation();
            onPageChange(currentPage - 1);
          }}
          className="rounded p-1 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50"
        >
          <FiChevronLeft className="h-3 w-3" />
        </button>
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={(e) => {
            e.stopPropagation();
            onPageChange(currentPage + 1);
          }}
          className="rounded p-1 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50"
        >
          <FiChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
