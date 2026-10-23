import type { JSX } from "react";
import { NotAvailable } from "./NotAvailable";
import { getInvoiceStatusConfig } from "@/src/helpers/invoiceConfig";
import type { InvoiceStatus } from "@/src/models/invoice";

interface Props {
  status?: InvoiceStatus | string | null;
  className?: string;
}

export function InvoiceStatusBadge({
  status,
  className = "",
}: Props): JSX.Element {
  if (!status) return <NotAvailable />;

  const config = getInvoiceStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold shrink-0 ${config.classes} ${className}`}
    >
      {config.label}
    </span>
  );
}
