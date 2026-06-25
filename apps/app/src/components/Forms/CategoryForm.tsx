"use client";

import { JSX, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { BaseButton, DeleteButton } from "@/src/components/UI/Buttons";
import { Input } from "@/src/components/FormElements/Input";
import { Table } from "@/src/components/UI/Table";
import { ActionsList } from "@/src/components/UI/ActionsList";
import { SidebarModal } from "@/src/components/UI/SidebarModal";
import {
  useAddCategory,
  useCategoriesQuery,
  useDeleteCategory,
  useUpdateCategory,
} from "@/src/hooks/useCategoryQuery";
import type { ICategory } from "@/src/models/categories";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";

interface CategoryFormValues {
  name: string;
}

export function CategoryForm(): JSX.Element {
  const { data: apiData, isLoading, error } = useCategoriesQuery();
  const categories: ICategory[] = apiData?.data?.categories ?? [];

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

  const { control, handleSubmit, reset } = useForm<CategoryFormValues>({
    defaultValues: { name: "" },
  });

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingCategory(null);
    reset({ name: "" });
  };

  const addMutation = useAddCategory({ onSuccess: closeDrawer });
  const updateMutation = useUpdateCategory({ onSuccess: closeDrawer });
  const deleteMutation = useDeleteCategory({ onSuccess: closeDrawer });

  const openAddDrawer = () => {
    setEditingCategory(null);
    reset({ name: "" });
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (category: ICategory) => {
    setEditingCategory(category);
    reset({ name: category.name });
    setIsDrawerOpen(true);
  };

  const onSubmit = ({ name }: CategoryFormValues) => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, payload: { name } });
    } else {
      addMutation.mutate({ name });
    }
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
              {item.name}
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

  const isSubmitting = addMutation.isPending || updateMutation.isPending;

  return (
    <>
      <div className="rounded-3xl border border-gray-100/80 bg-white/50 backdrop-blur-xl p-8 shadow-sm ring-1 ring-gray-900/5 dark:border-slate-700/50 dark:bg-slate-800/50 dark:ring-slate-100/10">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
            Template Categories
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Group templates and trigger logic under specific categories
          </p>
        </div>

        <Table
          data={paginatedCategories}
          columns={columns as Array<ColumnDef<ICategory>>}
          loading={isLoading}
          error={!!error}
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
            className="h-12 px-4.5 rounded-2xl text-sm font-medium shadow-sm transition-all"
          />
        </Table>
      </div>

      <SidebarModal
        display={isDrawerOpen}
        close={closeDrawer}
        title={editingCategory ? "Edit Category" : "Add Template Category"}
        footer={
          <fieldset className="w-full grid grid-cols-2 gap-6 py-4 px-0">
            {editingCategory ? (
              <>
                <DeleteButton
                  text="Delete"
                  title="Delete Category"
                  loading={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(editingCategory.id)}
                />
                <BaseButton
                  onClick={handleSubmit(onSubmit)}
                  color="primary"
                  text="Save Changes"
                  loading={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-sm"
                />
              </>
            ) : (
              <>
                <BaseButton
                  onClick={closeDrawer}
                  color="outline"
                  text="Cancel"
                  className="px-5 py-2.5 rounded-xl text-sm"
                />
                <BaseButton
                  onClick={handleSubmit(onSubmit)}
                  color="primary"
                  text="Create Category"
                  loading={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-sm"
                />
              </>
            )}
          </fieldset>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="name"
            control={control}
            rules={{ required: "Category name is required" }}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                id="drawer-category-name"
                label="Category Name"
                placeholder="e.g. Activity Checkups"
                error={fieldState.error?.message}
                required
                autoFocus
              />
            )}
          />

          {editingCategory && (
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800/50 text-xs text-gray-500 dark:text-slate-400 space-y-1">
              <p>
                <strong>Templates Linked:</strong>{" "}
                {editingCategory.templateCount}
              </p>
              <p>
                <strong>Events Count:</strong> {editingCategory.eventCount}
              </p>
            </div>
          )}
        </form>
      </SidebarModal>
    </>
  );
}
