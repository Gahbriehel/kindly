"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { useState, type JSX, type ReactNode } from "react";
import { Pagination } from "./Pagination";
import { SearchInput } from "./SearchInput";
import { PageLoader } from "../PageLoader";
import { NotAvailable } from "../NotAvailable";
import { FiList, FiGrid, FiFilter } from "react-icons/fi";

interface Props<T> {
  data: T[];
  columns: Array<ColumnDef<T>>;
  title?: string;
  loading?: boolean;
  error?: boolean;
  searchPlaceholder?: string;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
  };
  children?: ReactNode;

  // Custom props for list/grid toggle & filter
  /** Which views to support. Defaults to both. Pass a single-element array to lock to that view (hides the toggle). */
  supportedViews?: ("list" | "grid")[];
  viewMode?: "list" | "grid";
  onViewModeChange?: (mode: "list" | "grid") => void;
  renderGridItem?: (item: T) => ReactNode;
  onFilterClick?: () => void;
}

export function Table<T>({
  data,
  columns,
  title,
  loading,
  error,
  searchPlaceholder,
  searchQuery = "",
  onSearchChange,
  pagination,
  children,
  supportedViews = ["list", "grid"],
  viewMode,
  onViewModeChange,
  renderGridItem,
  onFilterClick,
}: Props<T>): JSX.Element {
  const defaultView = supportedViews[0] ?? "list";
  const [internalViewMode, setInternalViewMode] = useState<"list" | "grid">(
    defaultView,
  );
  const view = viewMode ?? internalViewMode;
  const setView = onViewModeChange ?? setInternalViewMode;
  const showToggle = supportedViews.length > 1;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Title block if present (above the toolbar) */}
      {title && (
        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-slate-100">
          {title}
        </h2>
      )}

      {/* Toolbar Section */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row w-full">
        {/* Search input (left-aligned) */}
        <div className="flex flex-1 w-full sm:max-w-md">
          {onSearchChange && (
            <SearchInput
              value={searchQuery}
              onChange={onSearchChange}
              placeholder={searchPlaceholder}
            />
          )}
        </div>

        {/* Action controls (right-aligned) */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {children}
          {onFilterClick && (
            <button
              onClick={onFilterClick}
              className="flex h-12 items-center gap-2 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 text-sm font-medium text-gray-600 dark:text-slate-300 shadow-sm transition-all hover:bg-gray-50 dark:hover:bg-slate-800/80 cursor-pointer"
            >
              <FiFilter className="size-4 text-gray-400 dark:text-slate-500 animate-pulse" />
              <span>Filter</span>
            </button>
          )}

          {/* View Mode Toggle — only rendered when both views are supported */}
          {showToggle && (
            <div className="flex h-12 items-center gap-1 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 shadow-sm">
              {supportedViews.includes("list") && (
                <button
                  onClick={() => setView("list")}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all cursor-pointer ${
                    view === "list"
                      ? "bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-sky-400"
                      : "text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
                  }`}
                  title="List View"
                >
                  <FiList size={20} />
                </button>
              )}
              {supportedViews.includes("grid") && (
                <button
                  onClick={() => setView("grid")}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all cursor-pointer ${
                    view === "grid"
                      ? "bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-sky-400"
                      : "text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
                  }`}
                  title="Grid View"
                >
                  <FiGrid size={20} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {view === "list" ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden rounded-[2.5rem] bg-white dark:bg-slate-900 p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-slate-900/50 border border-gray-50 dark:border-slate-800 transition-colors duration-200"
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr
                      key={uuidv4()}
                      className="bg-gray-50/80 dark:bg-slate-800/40 border-b border-gray-100 dark:border-slate-800/50"
                    >
                      {headerGroup.headers.map((header) => (
                        <th
                          key={uuidv4()}
                          className="px-6 py-4.5 text-left text-[0.8rem] font-semibold text-gray-500 dark:text-slate-400 capitalize whitespace-nowrap"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="relative min-h-[200px]">
                  {loading ? (
                    <tr key="loading">
                      <td colSpan={columns.length} className="py-20">
                        <PageLoader text="Fetching records..." />
                      </td>
                    </tr>
                  ) : error ? (
                    <tr key="error">
                      <td
                        colSpan={columns.length}
                        className="py-20 text-center"
                      >
                        <div className="flex flex-col items-center gap-2 text-red-500">
                          <span className="text-sm font-medium">
                            Failed to load data
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr key="empty">
                      <td
                        colSpan={columns.length}
                        className="py-20 text-center"
                      >
                        <span className="text-sm text-gray-400 dark:text-slate-500">
                          No records found
                        </span>
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map((row, index) => (
                      <motion.tr
                        key={uuidv4()}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="group border-b border-gray-50 dark:border-slate-800/30 transition-colors last:border-0 hover:bg-gray-50/30 dark:hover:bg-slate-800/30"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={uuidv4()}
                            className="px-6 py-5 text-[0.85rem] font-normal text-gray-600 dark:text-slate-300 whitespace-nowrap"
                          >
                            {/* Only show NotAvailable for accessor-backed columns with an empty value.
                                Display-only columns (no accessorKey/accessorFn) always render their cell. */}
                            {"accessorKey" in cell.column.columnDef &&
                            (cell.getValue() === null ||
                              cell.getValue() === undefined ||
                              cell.getValue() === "") ? (
                              <NotAvailable />
                            ) : (
                              flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )
                            )}
                          </td>
                        ))}
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer / Pagination */}
            {!loading && !error && data.length > 0 && pagination && (
              <div className="border-t border-gray-100 dark:border-slate-800 mt-2">
                <Pagination {...pagination} />
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-6"
          >
            {loading ? (
              <div className="py-20 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-gray-50 dark:border-slate-800">
                <PageLoader text="Fetching records..." />
              </div>
            ) : error ? (
              <div className="py-20 text-center rounded-[2.5rem] bg-white dark:bg-slate-900 border border-gray-50 dark:border-slate-800">
                <div className="flex flex-col items-center gap-2 text-red-500">
                  <span className="text-sm font-medium">
                    Failed to load data
                  </span>
                </div>
              </div>
            ) : data.length === 0 ? (
              <div className="py-20 text-center rounded-[2.5rem] bg-white dark:bg-slate-900 border border-gray-50 dark:border-slate-800">
                <span className="text-sm text-gray-400 dark:text-slate-500">
                  No records found
                </span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {table.getRowModel().rows.map((row, index) => (
                    <motion.div
                      key={uuidv4()}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.02 }}
                    >
                      {renderGridItem ? (
                        renderGridItem(row.original)
                      ) : (
                        // Default Fallback Grid Card
                        <div className="rounded-3xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-slate-900/40">
                          <div className="flex flex-col gap-4">
                            {row.getVisibleCells().map((cell) => {
                              const header = cell.column.columnDef.header;
                              const headerStr =
                                typeof header === "string"
                                  ? header
                                  : cell.column.id;
                              return (
                                <div
                                  key={uuidv4()}
                                  className="flex justify-between items-start border-b border-gray-50 dark:border-slate-800/50 pb-2 last:border-0 last:pb-0"
                                >
                                  <span className="text-xs font-semibold text-gray-400 dark:text-slate-500 capitalize">
                                    {headerStr}
                                  </span>
                                  <span className="text-sm text-gray-700 dark:text-slate-200">
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext(),
                                    )}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Footer / Pagination */}
                {!loading && !error && data.length > 0 && pagination && (
                  <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 border border-gray-50 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <Pagination {...pagination} />
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
