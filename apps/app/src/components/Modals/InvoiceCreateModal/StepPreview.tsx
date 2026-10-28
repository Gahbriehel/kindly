"use client";

import type { JSX } from "react";
import dayjs from "dayjs";
import { IoMailOutline } from "react-icons/io5";
import { RiWhatsappLine } from "react-icons/ri";
import { InvoiceDocument } from "@/src/components/Invoices/InvoiceDocument";
import type { InvoiceBusiness } from "@/src/components/Invoices/invoiceBusiness";
import type { InvoiceTotals } from "@/src/helpers/invoiceTotals";
import { toNumber, type InvoiceFormValues } from "./types";

interface Props {
  values: InvoiceFormValues;
  business: InvoiceBusiness;
  totals: InvoiceTotals;
  /** Set when editing an existing draft. */
  invoiceNumber?: string | null;
}

/** Step 3: a read-only preview of the document and how it will be sent. */
export function StepPreview({
  values,
  business,
  totals,
  invoiceNumber = null,
}: Props): JSX.Element {
  const clientEmail = values.client?.email?.trim();

  return (
    <div className="flex flex-col gap-5">
      <InvoiceDocument
        data={{
          business,
          invoiceNumber,
          issuedLabel: dayjs().format("MMM DD, YYYY"),
          // Same shape the backend stores, so it formats as the same day.
          dueDate: values.dueDate ? `${values.dueDate}T00:00:00.000Z` : null,
          clientName: values.client?.fullName ?? "",
          clientEmail,
          description: values.description,
          event: values.event,
          currency: values.currency.value._id,
          items: values.items.map((item, index) => ({
            item: item.item,
            quantity: toNumber(item.quantity),
            priceEach: toNumber(item.priceEach),
            lineTotal: totals.lines[index],
          })),
          subtotal: totals.subtotal,
          discountPercent: toNumber(values.discountPercent),
          discountAmount: totals.discountAmount,
          taxPercent: toNumber(values.taxPercent),
          taxAmount: totals.taxAmount,
          total: totals.total,
          note: values.note,
        }}
      />

      <section className="flex flex-col gap-3 rounded-2xl border border-gray-200 p-4 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
          How should we send it?
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            aria-pressed="true"
            className="flex h-12 cursor-default items-center justify-center gap-2 rounded-xl border border-theme-primary/20 bg-indigo-50/70 text-sm font-semibold text-theme-primary shadow-xs dark:border-indigo-800/40 dark:bg-indigo-950/40 dark:text-indigo-300"
          >
            <IoMailOutline className="size-4.5" />
            <span>Email</span>
          </button>
          {/* WhatsApp option disabled for now */}
          <button
            type="button"
            disabled
            className="flex h-12 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-gray-200/60 bg-gray-100/70 text-sm font-semibold text-gray-400 opacity-75 dark:border-slate-800/60 dark:bg-slate-800/50 dark:text-slate-500"
            title="WhatsApp is currently disabled"
          >
            <RiWhatsappLine className="size-4.5" />
            <span>WhatsApp</span>
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-slate-400">
          {clientEmail
            ? `Goes to ${clientEmail} as a PDF attachment.`
            : `${values.client?.fullName ?? "This client"} has no email address yet.`}
        </p>
      </section>
    </div>
  );
}
