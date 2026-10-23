"use client";

import { useState, useMemo, type JSX } from "react";
import { LuCake, LuCalendar } from "react-icons/lu";
import { FiHeart, FiGift } from "react-icons/fi";
import { Table } from "@/src/components/UI/Table";
import { NotAvailable } from "@/src/components/UI/NotAvailable";
import { InvoiceStatusBadge } from "@/src/components/UI/InvoiceStatusBadge";
import { useInvoicesQuery } from "@/src/hooks/useInvoiceQuery";
import { getInitials } from "@/src/helpers/stringHelpers";
import { formatDate } from "@/src/helpers/formatDate";
import { formatCurrency } from "@/src/helpers/formatCurrency";
import { INVOICE_STATUS_OPTIONS } from "@/src/helpers/invoiceConfig";
import type { ColumnDef } from "@tanstack/react-table";
import type { IInvoice, InvoiceStatus } from "@/src/models/invoice";

/**
 * Renders event title with an appropriate icon (Cake/Heart/Gift)
 * and formatted date.
 */
function InvoiceEventInfo({ invoice }: { invoice: IInvoice }): JSX.Element {
  const event = invoice.event;
  const title = event?.title || invoice.eventNameSnapshot;
  const rawDate = event?.date || invoice.eventDateSnapshot;

  if (!title) {
    return <NotAvailable />;
  }

  const isAnniversary = title.toLowerCase().includes("anniversary");
  const isBirthday = title.toLowerCase().includes("birthday");
  const formattedDate = rawDate
    ? formatDate({ date: rawDate, showTime: false, utc: false })
    : null;

  return (
    <div className="flex flex-col gap-1 text-[0.8rem]">
      <span className="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-slate-100">
        {isBirthday ? (
          <LuCake className="size-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
        ) : isAnniversary ? (
          <FiHeart className="size-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
        ) : (
          <FiGift className="size-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
        )}
        <span className="truncate">{title}</span>
      </span>
      {formattedDate && (
        <span className="flex items-center gap-1.5 text-gray-400 dark:text-slate-500 font-normal">
          <LuCalendar className="size-3.5 text-gray-400 dark:text-slate-500 shrink-0" />
          {formattedDate}
        </span>
      )}
    </div>
  );
}

export default function InvoicesPage(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, error, refetch, isFetching } = useInvoicesQuery({
    page: currentPage,
    limit: pageSize,
    status: statusFilter || undefined,
    search: searchQuery.trim() || undefined,
  });

  const invoices = useMemo<IInvoice[]>(() => {
    if (!data) return [];
    if (Array.isArray(data.data)) return data.data;
    if (
      data.data &&
      typeof data.data === "object" &&
      "invoice" in (data.data as Record<string, unknown>)
    ) {
      return [(data.data as unknown as { invoice: IInvoice }).invoice];
    }
    return [];
  }, [data]);

  const totalInvoicesCount = data?.pagination?.total ?? invoices.length;

  const columns = useMemo<ColumnDef<IInvoice>[]>(
    () => [
      {
        id: "clientName",
        header: "Client Name",
        cell: ({ row }) => {
          const invoice = row.original;
          const fullName =
            invoice.client?.fullName || invoice.clientNameSnapshot || "";
          const initials = getInitials(fullName) || "CL";

          return (
            <div className="flex items-center gap-3 text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 dark:bg-slate-800 text-[0.8rem] font-semibold text-indigo-600 dark:text-indigo-400">
                {initials}
              </div>
              <span className="font-semibold text-gray-900 dark:text-slate-100 text-[0.9rem] leading-tight">
                {fullName || <NotAvailable />}
              </span>
            </div>
          );
        },
      },
      {
        id: "invoice",
        header: "Invoice",
        cell: ({ row }) => {
          const invoice = row.original;
          const issuedDate = invoice.issuedAt || invoice.createdAt;
          const formattedIssuedDate = issuedDate
            ? formatDate({ date: issuedDate, showTime: false, utc: false })
            : null;

          return (
            <div className="flex flex-col gap-1 text-[0.8rem]">
              <span className="font-semibold text-gray-900 dark:text-slate-100 text-[0.875rem]">
                {invoice.invoiceNumber || <NotAvailable />}
              </span>
              {formattedIssuedDate && (
                <span className="text-xs text-gray-400 dark:text-slate-500 font-normal">
                  Issued {formattedIssuedDate}
                </span>
              )}
            </div>
          );
        },
      },
      {
        id: "event",
        header: "Event",
        cell: ({ row }) => <InvoiceEventInfo invoice={row.original} />,
      },
      {
        id: "due",
        header: "Due",
        cell: ({ row }) => {
          const invoice = row.original;
          if (!invoice.dueDate) return <NotAvailable />;
          return (
            <span className="text-sm text-gray-600 dark:text-slate-300">
              {formatDate({
                date: invoice.dueDate,
                showTime: false,
                utc: false,
              })}
            </span>
          );
        },
      },
      {
        id: "amount",
        header: "Amount",
        cell: ({ row }) => {
          const invoice = row.original;
          return (
            <span className="font-bold text-gray-900 dark:text-slate-100 text-[0.95rem]">
              {formatCurrency(invoice.total, invoice.currency)}
            </span>
          );
        },
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const invoice = row.original;
          return (
            <InvoiceStatusBadge
              status={invoice.effectiveStatus || invoice.status}
            />
          );
        },
      },
    ],
    [],
  );

  const renderGridItem = (invoice: IInvoice) => {
    const clientName =
      invoice.client?.fullName || invoice.clientNameSnapshot || "";
    const initials = getInitials(clientName) || "CL";
    const issuedDate = invoice.issuedAt || invoice.createdAt;
    const eventTitle = invoice.event?.title || invoice.eventNameSnapshot;
    const eventDate = invoice.event?.date || invoice.eventDateSnapshot;

    return (
      <div className="group relative rounded-3xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-theme-surface p-6 transition-all duration-200 hover:-translate-y-1 shadow-xs flex flex-col justify-between h-full min-h-[240px]">
        <div>
          {/* Card Header: Client & Status */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50 dark:bg-slate-800 text-[0.85rem] font-semibold text-indigo-600 dark:text-indigo-400">
                {initials}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-slate-100 text-[0.95rem] line-clamp-1">
                  {clientName || "—"}
                </h3>
                <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">
                  {invoice.invoiceNumber}
                </span>
              </div>
            </div>
            <InvoiceStatusBadge
              status={invoice.effectiveStatus || invoice.status}
            />
          </div>

          <div className="my-4 border-t border-gray-50 dark:border-slate-800/50" />

          {/* Event and Dates */}
          <div className="flex flex-col gap-2 text-[0.8rem]">
            {eventTitle ? (
              <div className="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-slate-100">
                <LuCake className="size-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="truncate">{eventTitle}</span>
                {eventDate && (
                  <span className="font-normal text-gray-400 dark:text-slate-500 text-xs ml-auto">
                    {formatDate({
                      date: eventDate,
                      showTime: false,
                      utc: false,
                    })}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-gray-400 dark:text-slate-500 italic text-xs">
                No linked event
              </span>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 mt-2">
              <span>
                Issued:{" "}
                {issuedDate
                  ? formatDate({
                      date: issuedDate,
                      showTime: false,
                      utc: false,
                    })
                  : "—"}
              </span>
              <span>
                Due:{" "}
                {invoice.dueDate
                  ? formatDate({
                      date: invoice.dueDate,
                      showTime: false,
                      utc: false,
                    })
                  : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer: Total Amount */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-50 dark:border-slate-800/50 pt-3">
          <span className="text-xs font-medium text-gray-400 dark:text-slate-500 uppercase tracking-wider">
            Total Amount
          </span>
          <span className="font-bold text-gray-900 dark:text-slate-100 text-base">
            {formatCurrency(invoice.total, invoice.currency)}
          </span>
        </div>
      </div>
    );
  };

  const filterPopoverContent = (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-2">
        <span className="text-xs font-bold text-gray-900 dark:text-slate-100 uppercase tracking-wider">
          Filter by Status
        </span>
        {statusFilter && (
          <button
            type="button"
            onClick={() => {
              setStatusFilter(null);
              setCurrentPage(1);
            }}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setStatusFilter(null);
            setCurrentPage(1);
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            !statusFilter
              ? "bg-theme-primary text-white"
              : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
          }`}
        >
          All
        </button>
        {INVOICE_STATUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              setStatusFilter(option.value);
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === option.value
                ? "bg-theme-primary text-white"
                : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Manage and track your invoices
            {data
              ? ` · ${totalInvoicesCount} total invoice${totalInvoicesCount === 1 ? "" : "s"}`
              : ""}
          </p>
        </div>
      </div>

      {/* Table Container */}
      <Table
        data={invoices}
        columns={columns}
        loading={isLoading}
        error={!!error}
        onRefetch={() => void refetch()}
        isRefetching={isFetching}
        searchPlaceholder="Search"
        searchQuery={searchQuery}
        onSearchChange={(query) => {
          setSearchQuery((prev) => {
            if (prev === query) return prev;
            setCurrentPage(1);
            return query;
          });
        }}
        filterContent={filterPopoverContent}
        filterActiveCount={statusFilter ? 1 : 0}
        renderGridItem={renderGridItem}
        pagination={{
          currentPage,
          totalPages: data?.pagination?.totalPages ?? 1,
          totalResults: totalInvoicesCount,
          pageSize,
          onPageChange: (page: number) => setCurrentPage(page),
          onPageSizeChange: (size) => {
            setPageSize(size);
            setCurrentPage(1);
          },
        }}
      />
    </div>
  );
}
