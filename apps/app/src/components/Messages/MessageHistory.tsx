"use client";

import type { JSX } from "react";
import { clsx } from "clsx";
import { RiWhatsappLine } from "react-icons/ri";
import { NotAvailable } from "@/src/components/UI/NotAvailable";
import { useMessagesQuery } from "@/src/hooks/useMessagesQuery";
import { formatDate } from "@/src/helpers/formatDate";
import type { IMessagesQueryParams, MessageStatus } from "@/src/models/message";

// WhatsApp gives no delivery signal, so these never say "delivered".
const STATUS: Record<MessageStatus, { label: string; className: string }> = {
  CONFIRMED: {
    label: "Sent (confirmed)",
    className:
      "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  },
  OPENED: {
    label: "Opened, not confirmed",
    className:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  },
  CANCELLED: {
    label: "Not sent",
    className:
      "bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400",
  },
};

interface Props {
  filter: Pick<IMessagesQueryParams, "clientId" | "eventId" | "invoiceId">;
}

/** Messages logged for a client, event or invoice, newest first. */
export function MessageHistory({ filter }: Props): JSX.Element {
  const { data, isLoading } = useMessagesQuery({ ...filter, limit: 20 });
  const messages = data?.data ?? [];

  if (isLoading) {
    return (
      <p className="text-sm text-gray-500 dark:text-slate-400">Loading…</p>
    );
  }
  if (messages.length === 0) return <NotAvailable />;

  return (
    <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-100 dark:divide-slate-800 dark:border-slate-800">
      {messages.map((message) => {
        const status = STATUS[message.status];
        const who = message.requestedBy
          ? `${message.requestedBy.firstName} ${message.requestedBy.lastName}`
          : null;
        return (
          <li key={message.id} className="flex flex-col gap-1.5 px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <span className="flex min-w-0 items-start gap-2 text-sm text-gray-900 dark:text-slate-100">
                <RiWhatsappLine className="mt-0.5 size-4 shrink-0 text-green-600 dark:text-green-400" />
                <span className="line-clamp-2 whitespace-pre-line break-words">
                  {message.body}
                </span>
              </span>
              <span
                className={clsx(
                  "shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold",
                  status.className,
                )}
              >
                {status.label}
              </span>
            </div>
            <p className="pl-6 text-xs text-gray-500 dark:text-slate-400">
              {who ? `${who} · ` : ""}
              {formatDate({ date: message.createdAt, utc: false })}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
