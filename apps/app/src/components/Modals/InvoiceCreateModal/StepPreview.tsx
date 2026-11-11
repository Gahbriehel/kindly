"use client";

import type { JSX } from "react";
import dayjs from "dayjs";
import { clsx } from "clsx";
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
  channel: "email" | "whatsapp";
  onChannelChange: (channel: "email" | "whatsapp") => void;
  /** Why WhatsApp is unavailable to this user; the button stays visible. */
  whatsappPermissionReason?: string;
  /** The plain-text message that will be prefilled in WhatsApp. */
  whatsappBody: string;
  disabled?: boolean;
}

/** Step 3: a read-only preview of the document and how it will be sent. */
export function StepPreview({
  values,
  business,
  totals,
  invoiceNumber = null,
  channel,
  onChannelChange,
  whatsappPermissionReason,
  whatsappBody,
  disabled = false,
}: Props): JSX.Element {
  const clientEmail = values.client?.email?.trim();
  const clientPhone = values.client?.phoneNumber?.trim();
  const isWhatsapp = channel === "whatsapp";
  const choice = (active: boolean) =>
    clsx(
      "flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60",
      active
        ? "border-theme-primary/20 bg-indigo-50/70 text-theme-primary shadow-xs dark:border-indigo-800/40 dark:bg-indigo-950/40 dark:text-indigo-300"
        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300",
    );

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
            aria-pressed={!isWhatsapp}
            disabled={disabled}
            onClick={() => onChannelChange("email")}
            className={choice(!isWhatsapp)}
          >
            <IoMailOutline className="size-4.5" />
            <span>Email</span>
          </button>
          <span
            title={
              whatsappPermissionReason ??
              (clientPhone ? undefined : "Client has no phone number")
            }
            className="flex"
          >
            <button
              type="button"
              aria-pressed={isWhatsapp}
              disabled={disabled || !clientPhone || !!whatsappPermissionReason}
              onClick={() => onChannelChange("whatsapp")}
              className={clsx(choice(isWhatsapp), "w-full")}
            >
              <RiWhatsappLine className="size-4.5" />
              <span>WhatsApp</span>
            </button>
          </span>
        </div>
        {isWhatsapp ? (
          <div className="flex flex-col gap-2 text-xs text-gray-500 dark:text-slate-400">
            <p className="whitespace-pre-line rounded-xl bg-gray-50 p-3 text-gray-700 dark:bg-slate-800 dark:text-slate-300">
              {whatsappBody}
            </p>
            <p>
              The PDF is only attached when sent by email, so this is a text
              message. The invoice will be saved as a draft and stays unsent.
              You&apos;ll press send in WhatsApp.
            </p>
          </div>
        ) : (
          <p className="text-xs text-gray-500 dark:text-slate-400">
            {clientEmail
              ? `Goes to ${clientEmail} as a PDF attachment.`
              : `${values.client?.fullName ?? "This client"} has no email address yet.`}
          </p>
        )}
      </section>
    </div>
  );
}
