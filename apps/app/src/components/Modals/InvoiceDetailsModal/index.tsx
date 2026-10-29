"use client";

import { useState, type JSX } from "react";
import { clsx } from "clsx";
import { FiAlertCircle, FiInfo, FiMoreHorizontal } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { LuFileText } from "react-icons/lu";
import { CenterModal } from "@/src/components/UI/CenterModal";
import { BaseButton } from "@/src/components/UI/Buttons";
import { ActionsList } from "@/src/components/UI/ActionsList";
import { Skeleton } from "@/src/components/UI/Skeleton";
import { InvoiceStatusBadge } from "@/src/components/UI/InvoiceStatusBadge";
import { ConfirmActionModal } from "@/src/components/Modals/ConfirmActionModal";
import {
  InvoiceDocument,
  type InvoiceDocumentData,
} from "@/src/components/Invoices/InvoiceDocument";
import {
  getCurrentBusiness,
  getSendBlockers,
  getSnapshotBusiness,
} from "@/src/components/Invoices/invoiceBusiness";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import {
  useDeleteInvoice,
  useInvoiceQuery,
  useInvoiceSettingsQuery,
  useSendInvoice,
  useVoidInvoice,
} from "@/src/hooks/useInvoiceQuery";
import { getInvoicePdf } from "@/src/services/invoice";
import { customToast } from "@/src/helpers/customToast";
import { formatCurrency } from "@/src/helpers/formatCurrency";
import { formatDate } from "@/src/helpers/formatDate";
import type { IUserData } from "@/src/models/auth";
import type { IInvoice } from "@/src/models/invoice";
import type { Permission } from "@/src/models/permission";
import { usePermissions } from "@/src/hooks/usePermissions";
import { RecordPaymentModal } from "./RecordPaymentModal";

type ConfirmKind = "reminder" | "void" | "delete";

/** Statuses the backend treats as sent and still owing money. */
const OUTSTANDING = ["SENT", "OVERDUE", "PARTIALLY_PAID"];

interface FooterAction {
  label: string;
  color: "primary" | "outline";
  onClick: () => void;
  loading?: boolean;
  /** Set when the action is unavailable; shown as the button's tooltip. */
  disabledReason?: string;
  /** Hidden entirely for users without it. */
  permission: Permission;
}

const day = (date?: string | null, utc = false) =>
  date ? formatDate({ date, showTime: false, utc }) : null;

function toDocumentData(
  invoice: IInvoice,
  business: InvoiceDocumentData["business"],
): InvoiceDocumentData {
  const isDraft = invoice.status === "DRAFT";
  // Once sent, show the details exactly as they went out to the client.
  const event = isDraft
    ? invoice.event
    : invoice.eventNameSnapshot
      ? {
          title: invoice.eventNameSnapshot,
          date: invoice.eventDateSnapshot ?? "",
        }
      : invoice.event;
  return {
    business,
    invoiceNumber: invoice.invoiceNumber,
    issuedLabel: day(invoice.issuedAt) ?? "On send",
    dueDate: invoice.dueDate,
    clientName:
      (isDraft ? invoice.client?.fullName : invoice.clientNameSnapshot) ||
      invoice.client?.fullName ||
      "",
    clientEmail: isDraft
      ? invoice.client?.email
      : invoice.clientEmailSnapshot || invoice.client?.email,
    description: invoice.description ?? "",
    event: event ? { title: event.title, date: event.date } : null,
    currency: invoice.currency,
    items: (invoice.items ?? []).map((item) => ({
      item: item.item,
      quantity: Number(item.quantity),
      priceEach: Number(item.priceEach),
      lineTotal: Number(item.lineTotal),
    })),
    subtotal: Number(invoice.subtotal),
    discountPercent: Number(invoice.discountPercent),
    discountAmount: Number(invoice.discountAmount),
    taxPercent: Number(invoice.taxPercent),
    taxAmount: Number(invoice.taxAmount),
    total: Number(invoice.total),
    payment: isDraft
      ? undefined
      : {
          amountPaid: Number(invoice.amountPaid),
          balanceDue: Number(invoice.balanceDue),
        },
    note: invoice.note,
  };
}

function Tile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "danger" | "muted";
}): JSX.Element {
  return (
    <div className="rounded-2xl bg-gray-50 px-4 py-3 dark:bg-slate-800/60">
      <p className="text-[11px] font-medium text-gray-400 dark:text-slate-500">
        {label}
      </p>
      <p
        className={clsx(
          "mt-0.5 text-sm font-semibold",
          tone === "danger" && "text-rose-600 dark:text-rose-400",
          tone === "muted" && "text-gray-400 dark:text-slate-500",
          !tone && "text-gray-900 dark:text-slate-100",
        )}
      >
        {value}
      </p>
    </div>
  );
}

interface Props {
  invoiceId: string;
  close: () => void;
  /** Opens the draft in the create/edit flow. */
  onEdit: (invoice: IInvoice) => void;
}

export function InvoiceDetailsModal({
  invoiceId,
  close,
  onEdit,
}: Props): JSX.Element {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmKind | null>(null);
  const [downloading, setDownloading] = useState(false);

  const { data, isLoading, isError, refetch } = useInvoiceQuery(invoiceId);
  const invoice = data?.data?.invoice;
  const { user } = useAppSelector((state) => state.auth);
  const company = (user as IUserData | null)?.company;
  const { data: settingsData } = useInvoiceSettingsQuery();
  const { can } = usePermissions();

  const sendMutation = useSendInvoice();
  const voidMutation = useVoidInvoice();
  const deleteMutation = useDeleteInvoice();

  const header = (
    <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50/90 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
          <LuFileText className="size-5.5" />
        </div>
        {invoice ? (
          <div className="min-w-0">
            <h2 className="truncate text-base font-bold text-gray-900 sm:text-lg dark:text-white">
              {invoice.invoiceNumber}
            </h2>
            <div className="mt-0.5 flex min-w-0 items-center gap-2 text-xs text-gray-500 sm:text-sm dark:text-slate-400">
              <InvoiceStatusBadge
                status={invoice.effectiveStatus || invoice.status}
                className="px-2.5 py-0.5"
              />
              <span className="truncate">
                {invoice.client?.fullName || invoice.clientNameSnapshot} ·{" "}
                {formatCurrency(invoice.total, invoice.currency)}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-40" />
          </div>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {invoice && (
          <ActionsList
            contentClassName="z-[120]!"
            trigger={
              <button
                type="button"
                aria-label="More invoice actions"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <FiMoreHorizontal size={18} />
              </button>
            }
            actions={[
              {
                title: "Download PDF",
                loading: downloading,
                disabled: downloading,
                fn: () => void downloadPdf(invoice),
              },
              ...(invoice.status === "DRAFT" && can("INVOICE_UPDATE")
                ? [
                    {
                      title: "Delete draft",
                      color: "red" as const,
                      fn: () => setConfirm("delete"),
                    },
                  ]
                : []),
              ...(OUTSTANDING.includes(invoice.status) && can("INVOICE_VOID")
                ? [
                    {
                      title: "Void invoice",
                      color: "red" as const,
                      fn: () => setConfirm("void"),
                    },
                  ]
                : []),
            ]}
          />
        )}
        <button
          type="button"
          onClick={close}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:text-slate-400 dark:hover:bg-slate-800"
          aria-label="Close modal"
        >
          <IoClose size={20} />
        </button>
      </div>
    </div>
  );

  async function downloadPdf(target: IInvoice) {
    setDownloading(true);
    try {
      const blob = await getInvoicePdf(target.id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${target.invoiceNumber}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      customToast.error("Couldn't download the PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  if (!invoice) {
    return (
      <CenterModal
        display
        close={close}
        header={header}
        ariaLabel="Invoice details"
        maxWidth="max-w-[720px]"
      >
        <div className="flex flex-col gap-4 px-6 pb-6">
          {isError && !isLoading ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <p className="text-sm text-gray-500 dark:text-slate-400">
                We couldn&apos;t load this invoice.
              </p>
              <BaseButton
                type="button"
                color="outline"
                text="Try again"
                onClick={() => void refetch()}
              />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-2xl" />
                ))}
              </div>
              <Skeleton className="h-96 rounded-2xl" />
            </>
          )}
        </div>
      </CenterModal>
    );
  }

  const status = invoice.effectiveStatus || invoice.status;
  const isDraft = invoice.status === "DRAFT";
  const isOutstanding = OUTSTANDING.includes(invoice.status);
  const business = isDraft
    ? getCurrentBusiness(settingsData?.data?.settings, company)
    : getSnapshotBusiness(invoice, company);
  const documentData = toDocumentData(invoice, business);
  const clientEmail = documentData.clientEmail;
  const lastPayment = invoice.payments?.[0];

  const sendBlockers = isDraft
    ? getSendBlockers({
        business,
        clientName: documentData.clientName,
        clientEmail,
        hasEvent: !!invoice.eventId,
        dueDate: invoice.dueDate?.slice(0, 10),
        fixInvoiceHint: {
          event: "Edit the draft to link an event.",
          dueDate: "Edit the draft to set a due date after today.",
        },
      })
    : [];

  const onSend = (kind: "send" | "reminder") =>
    sendMutation.mutate(invoice.id, {
      onSuccess: () => {
        setConfirm(null);
        customToast.success(
          kind === "send"
            ? `Invoice sent to ${clientEmail}`
            : `Reminder sent to ${clientEmail}`,
        );
      },
    });

  const editAction: FooterAction = {
    label: "Edit",
    color: "outline",
    permission: "INVOICE_UPDATE",
    onClick: () => onEdit(invoice),
    disabledReason: isDraft
      ? undefined
      : invoice.status === "PAID"
        ? "Paid invoices can't be edited."
        : invoice.status === "VOID"
          ? "Void invoices can't be edited."
          : "Sent invoices can't be edited. Void it and create a new one if something needs changing.",
  };

  let actions: FooterAction[];
  let statusNote: string | null = null;

  if (isDraft) {
    actions = [
      editAction,
      {
        label: "Send invoice",
        color: "primary",
        permission: "INVOICE_SEND",
        onClick: () => onSend("send"),
        loading: sendMutation.isPending,
        disabledReason: sendBlockers.length
          ? sendBlockers.join(" ")
          : undefined,
      },
    ];
  } else {
    const closedReason =
      invoice.status === "PAID"
        ? "This invoice is already paid in full."
        : "This invoice was voided.";
    actions = [
      editAction,
      {
        label: "Mark as paid",
        color: "outline",
        permission: "INVOICE_RECORD_PAYMENT",
        onClick: () => setPaymentOpen(true),
        disabledReason: isOutstanding ? undefined : closedReason,
      },
      {
        label: "Send a reminder",
        color: "primary",
        permission: "INVOICE_SEND",
        onClick: () => setConfirm("reminder"),
        disabledReason: isOutstanding
          ? undefined
          : invoice.status === "PAID"
            ? "It's already paid, so a reminder would only confuse your client."
            : "It was voided, so there's nothing to collect.",
      },
    ];
    if (isOutstanding) {
      statusNote =
        "Sent invoices can't be edited. Void it from the ⋯ menu and create a new one if something needs changing.";
    } else if (invoice.status === "PAID") {
      const paidOn = day(lastPayment?.paidAt);
      statusNote = `Paid in full${paidOn ? ` on ${paidOn}` : ""}. It can't be edited, paid again or reminded.`;
    } else {
      const voidedOn = day(invoice.voidedAt);
      statusNote = `Voided${voidedOn ? ` on ${voidedOn}` : ""}. It can't be edited, paid or reminded.`;
    }
  }

  actions = actions.filter((action) => can(action.permission));

  const footer = (
    <div className="flex flex-col gap-3">
      {sendBlockers.length > 0 && can("INVOICE_SEND") && (
        <div
          role="status"
          className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 dark:border-amber-800/40 dark:bg-amber-950/30"
        >
          <FiAlertCircle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="text-xs text-amber-900 dark:text-amber-200">
            <p className="font-semibold">This draft can&apos;t be sent yet:</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-4">
              {sendBlockers.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {statusNote && (
        <p
          role="status"
          className="flex items-start gap-2 text-xs text-gray-500 dark:text-slate-400"
        >
          <FiInfo className="mt-0.5 size-3.5 shrink-0" />
          {statusNote}
        </p>
      )}
      <div className="flex items-center gap-3">
        {actions.map((action) => (
          // Disabled buttons don't fire hover events, so the tooltip sits on a wrapper.
          <span
            key={action.label}
            className="flex flex-1"
            title={action.disabledReason}
          >
            <BaseButton
              type="button"
              color={action.color}
              text={action.label}
              onClick={action.onClick}
              loading={action.loading}
              disabled={!!action.disabledReason || sendMutation.isPending}
              className="h-12 w-full rounded-2xl"
            />
          </span>
        ))}
      </div>
    </div>
  );

  const sentValue = invoice.sentAt
    ? `${day(invoice.sentAt)} · Email`
    : "Not sent yet";

  return (
    <>
      <CenterModal
        display
        close={close}
        header={header}
        footer={footer}
        ariaLabel={`Invoice ${invoice.invoiceNumber}`}
        maxWidth="max-w-[720px]"
        closeOnEscape={!paymentOpen && !confirm}
      >
        <div className="flex max-h-[calc(100dvh-20rem)] flex-col gap-5 overflow-y-auto px-6 pb-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Tile
              label="Issued"
              value={day(invoice.issuedAt) ?? "Not issued yet"}
              tone={invoice.issuedAt ? undefined : "muted"}
            />
            <Tile
              label="Due"
              value={day(invoice.dueDate, true) ?? "—"}
              tone={status === "OVERDUE" ? "danger" : undefined}
            />
            <Tile
              label="Sent"
              value={sentValue}
              tone={invoice.sentAt ? undefined : "muted"}
            />
          </div>
          <InvoiceDocument data={documentData} />
        </div>
      </CenterModal>

      {paymentOpen && (
        <RecordPaymentModal
          invoiceId={invoice.id}
          currency={invoice.currency}
          balanceDue={Number(invoice.balanceDue)}
          close={() => setPaymentOpen(false)}
        />
      )}

      <ConfirmActionModal
        display={confirm === "reminder"}
        actionName="Send reminder"
        title="Send a reminder?"
        message={`We'll email ${invoice.invoiceNumber} to ${clientEmail} again.`}
        confirmColor="primary"
        loading={sendMutation.isPending}
        fn={() => onSend("reminder")}
        close={() => setConfirm(null)}
      />
      <ConfirmActionModal
        display={confirm === "void"}
        actionName="Void invoice"
        title={`Void ${invoice.invoiceNumber}?`}
        message={`${documentData.clientName} will be emailed that this invoice is void, and it can't take payments any more. This can't be undone.`}
        loading={voidMutation.isPending}
        fn={() =>
          voidMutation.mutate(invoice.id, {
            onSuccess: () => {
              setConfirm(null);
              customToast.success("Invoice voided");
            },
          })
        }
        close={() => setConfirm(null)}
      />
      <ConfirmActionModal
        display={confirm === "delete"}
        actionName="Delete"
        title="Delete this draft?"
        message={`${invoice.invoiceNumber} will be permanently deleted. This can't be undone.`}
        loading={deleteMutation.isPending}
        fn={() =>
          deleteMutation.mutate(invoice.id, {
            onSuccess: () => {
              customToast.success("Draft deleted");
              close();
            },
          })
        }
        close={() => setConfirm(null)}
      />
    </>
  );
}
