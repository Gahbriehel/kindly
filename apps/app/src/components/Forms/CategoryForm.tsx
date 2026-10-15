"use client";

import { JSX, useState, useMemo } from "react";
import { FiPlus } from "react-icons/fi";
import { BaseButton } from "@/src/components/UI/Buttons";
import { Table } from "@/src/components/UI/Table";
import { ActionsList } from "@/src/components/UI/ActionsList";
import { CategoryDrawer } from "@/src/components/Forms/CategoryDrawer";
import {
  useCategoriesQuery,
  useDeleteCategory,
} from "@/src/hooks/useCategoryQuery";
import type { ICategory } from "@/src/models/categories";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { capitalizeFirstLetter } from "@/src/helpers/capitalizeFirstLetter";

export function CategoryForm(): JSX.Element {
  const {
    data: apiData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useCategoriesQuery();
  const categories: ICategory[] = useMemo(
    () => apiData?.data ?? [],
    [apiData?.data],
  );

  // Search & Pagination (client-side filtering over API results)
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    const q = searchQuery.toLowerCase();
    return categories.filter((item) => item.name.toLowerCase().includes(q));
  }, [categories, searchQuery]);

  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCategories.slice(start, start + pageSize);
  }, [filteredCategories, currentPage, pageSize]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / pageSize),
  );

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(
    null,
  );

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingCategory(null);
  };

  const deleteMutation = useDeleteCategory({});

  const openAddDrawer = () => {
    setEditingCategory(null);
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (category: ICategory) => {
    setEditingCategory(category);
    setIsDrawerOpen(true);
  };

  const columnHelper = createColumnHelper<ICategory>();

  const columns = [
    columnHelper.accessor("name", {
      id: "name",
      header: "Category Name",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-theme-primary/10 text-theme-primary font-bold text-sm tracking-wide">
              {item.name.substring(0, 2).toUpperCase()}
            </div>
            <span className="font-semibold text-gray-900 dark:text-slate-100 text-[0.9rem]">
              {capitalizeFirstLetter(item.name)}
            </span>
          </div>
        );
      },
    }),
    columnHelper.accessor("isSystem", {
      id: "type",
      header: "Type",
      cell: ({ row }) =>
        row.original.isSystem ? (
          <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30 px-2.5 py-0.5 text-xs font-semibold">
            System
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30 px-2.5 py-0.5 text-xs font-semibold">
            Custom
          </span>
        ),
    }),
    columnHelper.accessor("templateCount", {
      id: "templates",
      header: "Templates",
      cell: ({ row }) => {
        const n = row.original.templateCount;
        return (
          <span className="text-gray-600 dark:text-slate-300 font-medium">
            {n} template{n !== 1 ? "s" : ""}
          </span>
        );
      },
    }),
    columnHelper.accessor("eventCount", {
      id: "events",
      header: "Events Triggered",
      cell: ({ row }) => {
        const n = row.original.eventCount;
        return (
          <span className="text-gray-500 dark:text-slate-400 font-medium">
            {n} event{n !== 1 ? "s" : ""}
          </span>
        );
      },
    }),
    columnHelper.accessor((rowData) => rowData, {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <ActionsList
            actions={[
              {
                title: "Edit",
                fn: () => openEditDrawer(item),
                disabled: item.isSystem,
              },
              {
                title: "Delete",
                fn: () => deleteMutation.mutate(item.id),
                disabled: item.isSystem,
              },
            ]}
          />
        );
      },
    }),
  ] as Array<ColumnDef<ICategory>>;

  return (
    <>
      <div className="rounded-3xl border border-gray-100/80 bg-white/50 backdrop-blur-xl p-8 ring-1 ring-gray-900/5 dark:border-slate-700/50 dark:bg-slate-800/50 dark:ring-slate-100/10">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
            Categories
          </h2>
        </div>

        <Table
          data={paginatedCategories}
          columns={columns as Array<ColumnDef<ICategory>>}
          loading={isLoading}
          error={!!error}
          onRefetch={() => void refetch()}
          isRefetching={isFetching}
          searchPlaceholder="Search categories..."
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setCurrentPage(1);
          }}
          supportedViews={["list"]}
          pagination={{
            currentPage,
            totalPages,
            totalResults: filteredCategories.length,
            pageSize,
            onPageChange: (page) => setCurrentPage(page),
            onPageSizeChange: (size) => {
              setPageSize(size);
              setCurrentPage(1);
            },
          }}
        >
          <BaseButton
            onClick={openAddDrawer}
            color="primary"
            text="Add Category"
            icon={<FiPlus className="size-4" />}
            className="h-12 px-4.5 rounded-2xl text-sm font-medium transition-all"
          />
        </Table>
      </div>

      {isDrawerOpen && (
        <CategoryDrawer category={editingCategory} close={closeDrawer} />
      )}
    </>
  );
}
