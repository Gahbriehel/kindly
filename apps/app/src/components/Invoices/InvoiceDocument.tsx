"use client";

import type { JSX, ReactNode } from "react";
import { FiImage } from "react-icons/fi";
import { formatCurrency } from "@/src/helpers/formatCurrency";
import { formatDate } from "@/src/helpers/formatDate";
import type { InvoiceBusiness } from "./invoiceBusiness";

export interface InvoiceDocumentData {
  business: InvoiceBusiness;
  /** `null` before the invoice is saved. */
  invoiceNumber: string | null;
  /** Shown as-is, e.g. "Sep 21, 2026" or "On send". */
  issuedLabel: string;
  /** `YYYY-MM-DD` or an ISO date at UTC midnight. */
  dueDate: string | null;
  clientName: string;
  clientEmail?: string | null;
  description: string;
  event: { title: string; date: string } | null;
  currency: string;
  items: {
    item: string;
    quantity: number;
    priceEach: number;
    lineTotal: number;
  }[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  total: number;
  /** Shown under the total once the invoice has been sent. */
  payment?: { amountPaid: number; balanceDue: number };
  note?: string | null;
}

function Label({ children }: { children: ReactNode }): JSX.Element {
  return (
    <span className="block text-[11px] font-medium tracking-wide text-gray-400 dark:text-slate-500">
      {children}
    </span>
  );
}

/** The invoice as the client sees it. Used by the create preview and the details view. */
export function InvoiceDocument({
  data,
}: {
  data: InvoiceDocumentData;
}): JSX.Element {
  const { business } = data;
  const money = (amount: number) => formatCurrency(amount, data.currency);
  const payTo = [
    business.bankAccountName,
    business.bankName,
    business.bankAccountNumber,
  ].filter(Boolean);
  const businessLines = [
    business.billingAddress,
    business.country,
    business.phoneNumber,
  ].filter(Boolean);
  const note = data.note?.trim();

  return (
    <article className="flex flex-col gap-6 rounded-2xl border border-gray-200 p-5 dark:border-slate-700">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 dark:bg-slate-800">
            {business.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={business.logoUrl}
                alt={`${business.businessName} logo`}
                className="h-full w-full object-contain"
              />
            ) : (
              <FiImage className="size-5 text-gray-300 dark:text-slate-600" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-gray-900 dark:text-slate-100">
              {business.businessName}
            </h3>
            {businessLines.map((line) => (
              <p
                key={line}
                className="text-xs leading-relaxed text-gray-500 dark:text-slate-400"
              >
                {line}
              </p>
            ))}
          </div>
        </div>
        <div className="text-right">
          <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">
            Invoice
          </h3>
          <p className="text-xs font-semibold text-theme-primary">
            {data.invoiceNumber ?? "Assigned on save"}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
            Issued{" "}
            <span className="font-semibold text-gray-800 dark:text-slate-200">
              {data.issuedLabel}
            </span>
          </p>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Due{" "}
            <span className="font-semibold text-gray-800 dark:text-slate-200">
              {data.dueDate
                ? formatDate({ date: data.dueDate, showTime: false })
                : "—"}
            </span>
          </p>
        </div>
      </header>

      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <Label>Billed to</Label>
          <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-slate-100">
            {data.clientName}
          </p>
          {data.clientEmail && (
            <p className="text-xs text-gray-500 dark:text-slate-400">
              {data.clientEmail}
            </p>
          )}
        </div>
        <div className="sm:text-right">
          <Label>For the occasion</Label>
          <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-slate-100">
            {data.description}
          </p>
          {data.event ? (
            <p className="text-xs text-gray-500 dark:text-slate-400">
              {[
                data.event.title,
                formatDate({ date: data.event.date, showTime: false }),
              ].join(" · ")}
            </p>
          ) : (
            <p className="text-xs italic text-gray-400 dark:text-slate-500">
              No event linked
            </p>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-700">
        <table className="w-full min-w-[420px] text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 dark:bg-slate-800/60 dark:text-slate-400">
            <tr>
              <th className="px-4 py-2.5 text-left font-medium">Description</th>
              <th className="px-2 py-2.5 text-center font-medium">Qty</th>
              <th className="px-2 py-2.5 text-right font-medium">Price</th>
              <th className="px-4 py-2.5 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
            {data.items.map((item, index) => (
              <tr key={index} className="text-gray-700 dark:text-slate-300">
                <td className="px-4 py-3">{item.item}</td>
                <td className="px-2 py-3 text-center">{item.quantity}</td>
                <td className="px-2 py-3 text-right">
                  {money(item.priceEach)}
                </td>
                <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-slate-100">
                  {money(item.lineTotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className="ml-auto flex w-full max-w-xs flex-col gap-2 text-sm">
        <div className="flex justify-between text-gray-600 dark:text-slate-400">
          <dt>Subtotal</dt>
          <dd>{money(data.subtotal)}</dd>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-slate-400">
          <dt>
            Discount{data.discountPercent ? ` (${data.discountPercent}%)` : ""}
          </dt>
          <dd className="text-emerald-600 dark:text-emerald-400">
            − {money(data.discountAmount)}
          </dd>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-slate-400">
          <dt>Tax{data.taxPercent ? ` (${data.taxPercent}%)` : ""}</dt>
          <dd>{money(data.taxAmount)}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-2 dark:border-slate-700">
          <dt className="font-bold text-gray-900 dark:text-slate-100">
            Total due
          </dt>
          <dd className="text-xl font-bold text-indigo-950 dark:text-indigo-200">
            {money(data.total)}
          </dd>
        </div>
        {data.payment && (
          <>
            <div className="flex justify-between text-gray-600 dark:text-slate-400">
              <dt>Amount paid</dt>
              <dd className="text-emerald-600 dark:text-emerald-400">
                {money(data.payment.amountPaid)}
              </dd>
            </div>
            <div className="flex justify-between font-semibold text-gray-900 dark:text-slate-100">
              <dt>Balance due</dt>
              <dd>{money(data.payment.balanceDue)}</dd>
            </div>
          </>
        )}
      </dl>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label>How to pay</Label>
          <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-slate-300">
            {payTo.length ? payTo.join(" · ") : "No payout details yet"}
          </p>
        </div>
        {note && (
          <div>
            <Label>Note</Label>
            <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-gray-700 dark:text-slate-300">
              {note}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
