import type { InvoiceStatus } from "@/src/models/invoice";

export interface InvoiceStatusConfig {
  label: string;
  classes: string;
}

export const INVOICE_STATUS_CONFIG: Record<InvoiceStatus, InvoiceStatusConfig> =
  {
    DRAFT: {
      label: "Draft",
      classes:
        "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700",
    },
    SENT: {
      label: "Sent",
      classes:
        "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/40",
    },
    PAID: {
      label: "Paid",
      classes:
        "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/40",
    },
    OVERDUE: {
      label: "Overdue",
      classes:
        "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-800/40",
    },
    PARTIALLY_PAID: {
      label: "Partially Paid",
      classes:
        "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800/40",
    },
    VOID: {
      label: "Void",
      classes:
        "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-700",
    },
  };

export const INVOICE_STATUS_OPTIONS: Array<{
  label: string;
  value: InvoiceStatus;
}> = [
  { label: "Draft", value: "DRAFT" },
  { label: "Sent", value: "SENT" },
  { label: "Paid", value: "PAID" },
  { label: "Overdue", value: "OVERDUE" },
  { label: "Partially Paid", value: "PARTIALLY_PAID" },
  { label: "Void", value: "VOID" },
];

/**
 * Returns configuration (label and CSS classes) for a given invoice status.
 * Gracefully handles unknown or lowercase status strings.
 */
export function getInvoiceStatusConfig(
  status?: string | null,
): InvoiceStatusConfig {
  const upper = (status || "").toUpperCase() as InvoiceStatus;
  return (
    INVOICE_STATUS_CONFIG[upper] ?? {
      label: status || "Unknown",
      classes:
        "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700",
    }
  );
}
