"use client";

import { JSX, ReactNode, useState } from "react";
import { BaseButton } from "@/src/components/UI/Buttons";
import { Table } from "@/src/components/UI/Table";
import {
  FiPlus,
  FiMail,
  FiMessageSquare,
  FiMessageCircle,
  FiFileText,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

import {
  useTemplatesQuery,
  useDeleteTemplate,
} from "@/src/hooks/useTemplateQuery";
import { useDebounce } from "@/src/hooks/useDebounce";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { ITemplate } from "@/src/models/template";
import { TemplateForm } from "@/src/components/Forms/TemplateForm";
import { ConfirmActionModal } from "@/src/components/Modals/ConfirmActionModal";
import { customToast } from "@/src/helpers/customToast";

export default function TemplatesPage(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const debouncedSearchQuery = useDebounce(searchQuery);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ITemplate | null>(
    null,
  );
  const [deletingTemplateId, setDeletingTemplateId] = useState<string | null>(
    null,
  );

  const { data, isLoading, error } = useTemplatesQuery({
    page: currentPage,
    limit: pageSize,
    search: debouncedSearchQuery,
  });

  const deleteMutation = useDeleteTemplate({
    onSuccess: () => {
      customToast.success("Template deleted successfully");
      setDeletingTemplateId(null);
    },
  });

  const columnHelper = createColumnHelper<ITemplate>();
  const columns = [
    columnHelper.accessor("title", {
      header: "Title",
      cell: (info) => (
        <span className="font-semibold text-gray-900 dark:text-slate-100 text-[0.9rem]">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("type", {
      header: "Type",
      cell: (info) => (
        <span className="capitalize font-semibold text-gray-700 dark:text-slate-200 text-xs">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("isActive", {
      header: "Active",
      cell: (info) =>
        info.getValue() ? (
          <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30 px-2.5 py-0.5 text-xs font-semibold">
            Active
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-700 px-2.5 py-0.5 text-xs font-semibold">
            Inactive
          </span>
        ),
    }),
    columnHelper.accessor("category", {
      header: "Category",
      cell: (info) => (
        <span className="inline-flex items-center rounded-full bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-slate-700 px-2.5 py-0.5 text-xs font-medium">
          {info.getValue()?.name ?? "Uncategorized"}
        </span>
      ),
    }),
  ];

  const renderGridItem = (item: ITemplate) => {
    // Map template type to icons and background colors
    const typeIcons: Record<
      string,
      { icon: ReactNode; bg: string; text: string }
    > = {
      email: {
        icon: <FiMail className="size-4" />,
        bg: "bg-blue-50 dark:bg-blue-950/40",
        text: "text-blue-600 dark:text-blue-400",
      },
      sms: {
        icon: <FiMessageSquare className="size-4" />,
        bg: "bg-emerald-50 dark:bg-emerald-950/40",
        text: "text-emerald-600 dark:text-emerald-400",
      },
      whatsapp: {
        icon: <FiMessageCircle className="size-4" />,
        bg: "bg-green-50 dark:bg-green-950/40",
        text: "text-green-600 dark:text-green-400",
      },
    };

    const typeLower = item.type.toLowerCase();
    const typeCfg = typeIcons[typeLower] || {
      icon: <FiFileText className="size-4" />,
      bg: "bg-gray-100 dark:bg-slate-800",
      text: "text-gray-600 dark:text-slate-300",
    };

    return (
      <div className="group relative rounded-[2rem] border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-slate-900/40 hover:-translate-y-1 flex flex-col justify-between h-full min-h-[220px]">
        <div>
          {/* Card Header */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${typeCfg.bg} ${typeCfg.text}`}
              >
                {typeCfg.icon}
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-900 dark:text-slate-100 text-[0.95rem] line-clamp-1">
                  {item.title}
                </span>
                <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-indigo-100 dark:border-slate-700 px-2.5 py-0.5 text-xs font-medium max-w-[120px] truncate">
                  {item.category.name}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setEditingTemplate(item);
                  setIsSidebarOpen(true);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-500 dark:hover:text-indigo-400 dark:hover:bg-slate-800 transition-colors"
                title="Edit Template"
              >
                <FiEdit2 className="size-4" />
              </button>
              <button
                onClick={() => setDeletingTemplateId(item.id)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 dark:text-slate-500 dark:hover:text-red-400 dark:hover:bg-red-950/40 transition-colors"
                title="Delete Template"
              >
                <FiTrash2 className="size-4" />
              </button>
            </div>
          </div>

          <div className="my-4" />

          {/* Template Title & Message Preview */}
          <div className="space-y-2">
            <div
              className="text-xs text-gray-500 dark:text-slate-400 font-normal leading-relaxed line-clamp-3 bg-gray-50/50 dark:bg-slate-800/20 p-2.5 rounded-xl border border-gray-100/50 dark:border-slate-800/50 break-words font-mono ql-editor-preview"
              dangerouslySetInnerHTML={{ __html: item.message }}
            />
          </div>
        </div>

        {/* Card Footer */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-50 dark:border-slate-800/50 pt-3">
          <div className="flex items-center gap-2">
            {item.isActive ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30 px-2.5 py-0.5 text-xs font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-700 px-2.5 py-0.5 text-xs font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                Inactive
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 w-full sm:w-auto">
            <BaseButton
              text="Use Template"
              onClick={() => console.log("Use template", item.id)}
              className="!h-8 sm:!h-9 px-3 sm:px-4 w-full sm:w-auto rounded-lg text-xs sm:text-sm font-medium shadow-sm transition-all"
            />
          </div>
        </div>
      </div>
    );
  };

  const templates = data?.data ?? [];

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-y-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
            Templates
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Manage and configure message templates for automated or manual
            triggers
          </p>
        </div>

        <BaseButton
          type="button"
          text="New Template"
          icon={<FiPlus className="size-4" />}
          position="icon-first"
          color="primary"
          className="h-12 px-4.5 rounded-2xl text-sm font-medium shadow-sm transition-all"
          onClick={() => {
            setEditingTemplate(null);
            setIsSidebarOpen(true);
          }}
          disabled={isLoading}
        />
      </div>

      <div className="rounded-3xl border border-gray-100/80 bg-white/50 backdrop-blur-xl p-4 sm:p-6 lg:p-8 shadow-sm ring-1 ring-gray-900/5 dark:border-slate-700/50 dark:bg-slate-800/50 dark:ring-slate-100/10">
        <Table
          data={templates}
          columns={columns as Array<ColumnDef<ITemplate>>}
          loading={isLoading}
          error={!!error}
          supportedViews={["grid"]}
          searchPlaceholder="Search template"
          searchQuery={searchQuery}
          onSearchChange={(query) => {
            setSearchQuery(query);
            setCurrentPage(1);
          }}
          renderGridItem={renderGridItem}
          pagination={{
            currentPage,
            totalPages: data?.pagination?.totalPages ?? 0,
            totalResults: data?.pagination?.total ?? 0,
            pageSize: data?.pagination?.limit ?? 0,
            onPageChange: (page: number) => setCurrentPage(page),
            onPageSizeChange: (size) => {
              setPageSize(size);
              setCurrentPage(1);
            },
          }}
        ></Table>
      </div>

      {/* Template Form Sidebar Modal */}
      <TemplateForm
        isOpen={isSidebarOpen}
        onClose={() => {
          setIsSidebarOpen(false);
          setEditingTemplate(null);
        }}
        editingTemplate={editingTemplate}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmActionModal
        actionName="Delete"
        title="Delete Template"
        message="Are you sure you want to delete this template? This action cannot be undone."
        display={!!deletingTemplateId}
        close={() => setDeletingTemplateId(null)}
        loading={deleteMutation.isPending}
        fn={() => {
          if (deletingTemplateId) {
            deleteMutation.mutate(deletingTemplateId);
          }
        }}
      />
    </>
  );
}
