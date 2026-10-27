"use client";

import type { JSX, ReactNode } from "react";
import dayjs from "dayjs";
import { FiImage } from "react-icons/fi";
import { IoMailOutline } from "react-icons/io5";
import { RiWhatsappLine } from "react-icons/ri";
import { formatCurrency } from "@/src/helpers/formatCurrency";
import { formatDate } from "@/src/helpers/formatDate";
import type { InvoiceTotals } from "@/src/helpers/invoiceTotals";
import { toNumber, type InvoiceFormValues } from "./types";

/** Business details shown on the document, from invoice settings or the company. */
export interface InvoiceBusiness {
  businessName: string;
  logoUrl: string | null;
  billingAddress: string | null;
  country: string | null;
  phoneNumber: string | null;
  registrationNumber: string | null;
  taxId: string | null;
  bankAccountName: string | null;
  bankAccountNumber: string | null;
  bankName: string | null;
}

interface Props {
  values: InvoiceFormValues;
  business: InvoiceBusiness;
  totals: InvoiceTotals;
}

function Label({ children }: { children: ReactNode }): JSX.Element {
  return (
    <span className="block text-[11px] font-medium tracking-wide text-gray-400 dark:text-slate-500">
      {children}
    </span>
  );
}

/** Step 3: a read-only preview of the document and how it will be sent. */
export function StepPreview({ values, business, totals }: Props): JSX.Element {
  const currency = values.currency.value._id;
  const money = (amount: number) => formatCurrency(amount, currency);
  const discount = toNumber(values.discountPercent);
  const tax = toNumber(values.taxPercent);
  const clientEmail = values.client?.email?.trim();
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

  return (
    <div className="flex flex-col gap-5">
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
              Assigned on save
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
              Issued{" "}
              <span className="font-semibold text-gray-800 dark:text-slate-200">
                {dayjs().format("MMM DD, YYYY")}
              </span>
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Due{" "}
              <span className="font-semibold text-gray-800 dark:text-slate-200">
                {values.dueDate
                  ? dayjs(values.dueDate).format("MMM DD, YYYY")
                  : "—"}
              </span>
            </p>
          </div>
        </header>

        <div className="flex flex-wrap justify-between gap-4">
          <div>
            <Label>Billed to</Label>
            <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-slate-100">
              {values.client?.fullName}
            </p>
            {clientEmail && (
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {clientEmail}
              </p>
            )}
          </div>
          <div className="sm:text-right">
            <Label>For the occasion</Label>
            <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-slate-100">
              {values.description}
            </p>
            {values.event ? (
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {[
                  values.event.title,
                  formatDate({ date: values.event.date, showTime: false }),
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
                <th className="px-4 py-2.5 text-left font-medium">
                  Description
                </th>
                <th className="px-2 py-2.5 text-center font-medium">Qty</th>
                <th className="px-2 py-2.5 text-right font-medium">Price</th>
                <th className="px-4 py-2.5 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {values.items.map((item, index) => (
                <tr key={index} className="text-gray-700 dark:text-slate-300">
                  <td className="px-4 py-3">{item.item}</td>
                  <td className="px-2 py-3 text-center">{item.quantity}</td>
                  <td className="px-2 py-3 text-right">
                    {money(toNumber(item.priceEach))}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-slate-100">
                    {money(totals.lines[index])}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <dl className="ml-auto flex w-full max-w-xs flex-col gap-2 text-sm">
          <div className="flex justify-between text-gray-600 dark:text-slate-400">
            <dt>Subtotal</dt>
            <dd>{money(totals.subtotal)}</dd>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-slate-400">
            <dt>Discount{discount ? ` (${discount}%)` : ""}</dt>
            <dd className="text-emerald-600 dark:text-emerald-400">
              − {money(totals.discountAmount)}
            </dd>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-slate-400">
            <dt>Tax{tax ? ` (${tax}%)` : ""}</dt>
            <dd>{money(totals.taxAmount)}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-2 dark:border-slate-700">
            <dt className="font-bold text-gray-900 dark:text-slate-100">
              Total due
            </dt>
            <dd className="text-xl font-bold text-indigo-950 dark:text-indigo-200">
              {money(totals.total)}
            </dd>
          </div>
        </dl>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>How to pay</Label>
            <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-slate-300">
              {payTo.length ? payTo.join(" · ") : "No payout details yet"}
            </p>
          </div>
          {values.note.trim() && (
            <div>
              <Label>Note</Label>
              <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-gray-700 dark:text-slate-300">
                {values.note.trim()}
              </p>
            </div>
          )}
        </div>
      </article>

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
