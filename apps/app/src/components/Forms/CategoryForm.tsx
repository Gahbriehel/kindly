"use client";

import { JSX, useState, useMemo } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { BaseButton } from "@/src/components/UI/Buttons";
import { Input } from "@/src/components/FormElements/Input";
import { Table } from "@/src/components/UI/Table";
import { ConfirmActionModal } from "@/src/components/Modals/ConfirmActionModal";
import { Drawer } from "@/src/components/Modals/Drawer";
import { useCategoriesQuery } from "@/src/hooks/useCategoryQuery";
import type { ICategory } from "@/src/models/categories";
import type { ColumnDef } from "@tanstack/react-table";

export function CategoryForm(): JSX.Element {
  const { data: apiData, isLoading, error } = useCategoriesQuery();

  // Use API data when available, otherwise empty list
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
  const [categoryName, setCategoryName] = useState("");
  const [nameError, setNameError] = useState("");

  // Delete confirmation state
  const [categoryToDelete, setCategoryToDelete] = useState<ICategory | null>(
    null,
  );

  const openAddDrawer = () => {
    setEditingCategory(null);
    setCategoryName("");
    setNameError("");
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (category: ICategory) => {
    if (category.isSystem) return;
    setEditingCategory(category);
    setCategoryName(category.name);
    setNameError("");
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => setIsDrawerOpen(false);

  const handleDrawerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = categoryName.trim();

    if (!name) {
      setNameError("Category name is required");
      return;
    }

    if (editingCategory) {
      // TODO: wire up PATCH /categories/:id
      console.log("Update category:", { id: editingCategory.id, name });
    } else {
      // TODO: wire up POST /categories
      console.log("Create category:", { name });
    }

    closeDrawer();
  };

  const handleDelete = (id: string) => {
    // TODO: wire up DELETE /categories/:id
    console.log("Delete category:", id);
    setCategoryToDelete(null);
  };

  const columns = useMemo<ColumnDef<ICategory>[]>(
    () => [
      {
        id: "name",
        header: "Category Name",
        accessorKey: "name",
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
      },
      {
        id: "type",
        header: "Type",
        accessorKey: "isSystem",
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
      },
      {
        id: "templates",
        header: "Templates",
        accessorKey: "templateCount",
        cell: ({ row }) => {
          const n = row.original.templateCount;
          return (
            <span className="text-gray-600 dark:text-slate-300 font-medium">
              {n} template{n !== 1 ? "s" : ""}
            </span>
          );
        },
      },
      {
        id: "events",
        header: "Events Triggered",
        accessorKey: "eventCount",
        cell: ({ row }) => {
          const n = row.original.eventCount;
          return (
            <span className="text-gray-500 dark:text-slate-400 font-medium">
              {n} event{n !== 1 ? "s" : ""}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openEditDrawer(item)}
                disabled={item.isSystem}
                className="flex h-8 w-8 items-center justify-center rounded-full text-theme-primary hover:bg-theme-primary/10 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-transparent"
                title={
                  item.isSystem
                    ? "System categories cannot be edited"
                    : "Edit Category"
                }
              >
                <FiEdit2 className="size-4" />
              </button>

              <button
                onClick={() => !item.isSystem && setCategoryToDelete(item)}
                disabled={item.isSystem}
                className="flex h-8 w-8 items-center justify-center rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:text-gray-300 dark:disabled:text-slate-700 disabled:hover:bg-transparent"
                title={
                  item.isSystem
                    ? "System categories cannot be deleted"
                    : "Delete Category"
                }
              >
                <FiTrash2 className="size-4" />
              </button>
            </div>
          );
        },
      },
    ],
    [],
  );

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
          columns={columns}
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

      {/* Add / Edit Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title={editingCategory ? "Edit Category" : "Add Template Category"}
        footer={
          <fieldset className="w-full grid grid-cols-2 gap-6 py-4 px-0">
            <BaseButton
              onClick={closeDrawer}
              color="outline"
              text="Cancel"
              className="px-5 py-2.5 rounded-xl text-sm"
            />
            <BaseButton
              onClick={handleDrawerSubmit}
              color="primary"
              text={editingCategory ? "Save Changes" : "Create Category"}
              className="px-5 py-2.5 rounded-xl text-sm"
            />
          </fieldset>
        }
      >
        <form onSubmit={handleDrawerSubmit} className="space-y-6">
          <Input
            id="drawer-category-name"
            label="Category Name"
            placeholder="e.g. Activity Checkups"
            value={categoryName}
            onChange={(e) => {
              setCategoryName(e.target.value);
              if (nameError) setNameError("");
            }}
            error={nameError}
            required
            autoFocus
          />

          {editingCategory && (
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800/50 text-xs text-gray-500 dark:text-slate-400 space-y-1">
              <p>
                <strong>ID:</strong> {editingCategory.id}
              </p>
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
      </Drawer>

      {/* Delete Confirmation */}
      <ConfirmActionModal
        actionName="Delete"
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"? This cannot be undone.`}
        display={!!categoryToDelete}
        close={() => setCategoryToDelete(null)}
        fn={() => categoryToDelete && handleDelete(categoryToDelete.id)}
      />
    </>
  );
}
