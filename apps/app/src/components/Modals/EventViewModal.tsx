"use client";

import { useState, type JSX, type ReactNode } from "react";
import dayjs from "dayjs";
import {
  FiCalendar,
  FiClock,
  FiEdit2,
  FiFileText,
  FiGift,
  FiMail,
  FiMessageCircle,
  FiPhone,
  FiRepeat,
} from "react-icons/fi";
import { clsx } from "clsx";
import { SidebarModal } from "@/src/components/UI/SidebarModal";
import { BaseButton } from "@/src/components/UI/Buttons";
import { CopyButton } from "@/src/components/UI/CopyButton";
import { NotAvailable } from "@/src/components/UI/NotAvailable";
import { SendClientMessageModal } from "@/src/components/Modals/SendClientMessageModal";
import { InvoiceSettingsInterceptModal } from "@/src/components/Modals/InvoiceSettingsInterceptModal";
import { InvoiceCreateModal } from "@/src/components/Modals/InvoiceCreateModal";
import { isMissingInvoiceSetup } from "@/src/components/Invoices/invoiceBusiness";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { useInvoiceSettingsQuery } from "@/src/hooks/useInvoiceQuery";
import { usePermissions } from "@/src/hooks/usePermissions";
import { getInitials } from "@/src/helpers/stringHelpers";
import {
  eventDateKey,
  getEventTimingLabel,
} from "@/src/helpers/calendarHelpers";
import { getCategoryConfig } from "@/src/helpers/categoryConfig";
import type { IUserData } from "@/src/models/auth";
import type { IEvent, IEventParticipant } from "@/src/models/event";

type ParticipantClient = IEventParticipant["client"];

interface Props {
  event: IEvent | null;
  close: () => void;
  onEdit?: (event: IEvent) => void;
  viewOnly?: boolean;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
        {title}
      </h3>
      {children}
    </section>
  );
}

export function EventViewModal({
  event,
  close,
  onEdit,
  viewOnly,
}: Props): JSX.Element {
  const dateKey = event ? eventDateKey(event) : "";
  const timingLabel = dateKey ? getEventTimingLabel(dateKey) : "";
  const participants = event?.participants ?? [];
  const config = event ? getCategoryConfig(event.category?.name ?? "") : null;
  const CategoryIcon = config?.icon ?? FiGift;
  // Client actions default to the first participant; each contact card can target its own.
  const primaryClient = participants[0]?.client ?? null;

  const [messageClient, setMessageClient] = useState<ParticipantClient | null>(
    null,
  );
  const [invoiceClient, setInvoiceClient] = useState<ParticipantClient | null>(
    null,
  );
  const [invoiceStep, setInvoiceStep] = useState<"settings" | "create" | null>(
    null,
  );
  const { user } = useAppSelector((state) => state.auth);
  const company = (user as IUserData | null)?.company;
  const { can } = usePermissions();
  const { data: settingsData } = useInvoiceSettingsQuery();

  const handleClose = () => {
    setMessageClient(null);
    setInvoiceStep(null);
    close();
  };

  const handleInvoiceClick = (client: ParticipantClient) => {
    setInvoiceClient(client);
    setInvoiceStep(
      isMissingInvoiceSetup(settingsData?.data?.settings, company)
        ? "settings"
        : "create",
    );
  };

  const editOrViewButton = (color: "primary" | "outline") =>
    event &&
    (viewOnly || !onEdit ? (
      <BaseButton
        type="link"
        href={dateKey ? `/calendar?date=${dateKey}` : "/calendar"}
        color={color}
        text="View in Calendar"
        icon={<FiCalendar className="size-4" />}
        onClick={handleClose}
        className="h-12 flex-1 rounded-2xl"
      />
    ) : (
      <BaseButton
        type="button"
        color={color}
        text="Edit"
        icon={<FiEdit2 className="size-4" />}
        onClick={() => onEdit(event)}
        className="h-12 flex-1 rounded-2xl"
      />
    ));

  return (
    <>
      <SidebarModal
        display={!!event}
        close={handleClose}
        title={
          event &&
          config && (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400">
                <CategoryIcon className="size-5" />
              </div>
              <div className="min-w-0">
                <h2 className="truncate font-manrope text-base font-bold text-gray-900 dark:text-slate-100">
                  {event.title}
                </h2>
                <div className="mt-0.5 flex flex-wrap gap-1.5">
                  <span
                    className={clsx(
                      "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      config.bgClass,
                    )}
                  >
                    {config.label}
                  </span>
                  {event.isRecurring && (
                    <span className="flex items-center gap-1 rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 dark:border-indigo-800/40 dark:bg-indigo-950/40 dark:text-indigo-400">
                      <FiRepeat className="size-3" />
                      Annual
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        }
        footer={
          event &&
          (primaryClient ? (
            <>
              {editOrViewButton("outline")}
              {can("INVOICE_CREATE") && (
                <BaseButton
                  type="button"
                  color="outline"
                  text="Invoice"
                  icon={<FiFileText className="size-4" />}
                  onClick={() => handleInvoiceClick(primaryClient)}
                  className="h-12 flex-1 rounded-2xl"
                />
              )}
              <BaseButton
                type="button"
                color="primary"
                text="Send Message"
                icon={<FiMessageCircle className="size-4" />}
                onClick={() => setMessageClient(primaryClient)}
                className="h-12 flex-1 rounded-2xl"
              />
            </>
          ) : (
            <>
              <BaseButton
                type="button"
                color="outline"
                text="Close"
                onClick={handleClose}
                className="h-12 flex-1 rounded-2xl"
              />
              {editOrViewButton("primary")}
            </>
          ))
        }
      >
        {event && config && (
          <div className="flex flex-col gap-6">
            {/* Highlight banner matching ClientViewModal birthday banner */}
            <div className="rounded-2xl bg-indigo-50 p-4 dark:bg-indigo-950/30">
              <span className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                <CategoryIcon className="size-4" />
                {config.label}
              </span>
              <p className="mt-1 font-manrope text-base font-bold text-gray-900 dark:text-slate-100">
                {dayjs(dateKey).format("MMMM D, YYYY")}
              </p>
              <div className="mt-1 flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400">
                <span className="flex items-center gap-1.5">
                  <FiClock className="size-3.5" /> {timingLabel}
                </span>
                {event.isRecurring && (
                  <span className="flex items-center gap-1">
                    • <FiRepeat className="size-3" /> Repeats annually
                  </span>
                )}
              </div>
            </div>

            {/* Contact / Associated Clients */}
            <Section
              title={`Contact${participants.length > 1 ? ` (${participants.length})` : ""}`}
            >
              {participants.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {participants.map((participant) => {
                    const client = participant.client;
                    const name = client?.fullName || "Client";
                    const initials = getInitials(name) || "CL";

                    return (
                      <div
                        key={participant.id || participant.clientId}
                        className="flex flex-col gap-3 rounded-2xl border border-gray-100 p-4 text-sm dark:border-slate-800"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="flex min-w-0 items-center gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600 dark:bg-slate-800 dark:text-indigo-400">
                              {initials}
                            </span>
                            <span className="truncate font-semibold text-gray-900 dark:text-slate-100">
                              {name}
                            </span>
                          </span>
                          {client && (
                            <span className="flex shrink-0 items-center gap-1">
                              <button
                                type="button"
                                aria-label={`Invoice ${name}`}
                                onClick={() => handleInvoiceClick(client)}
                                className="cursor-pointer rounded-full p-1.5 text-indigo-600 transition-colors hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-slate-800"
                              >
                                <FiFileText className="size-5" />
                              </button>
                              <button
                                type="button"
                                aria-label={`Message ${name}`}
                                onClick={() => setMessageClient(client)}
                                className="cursor-pointer rounded-full p-1.5 text-indigo-600 transition-colors hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-slate-800"
                              >
                                <FiMessageCircle className="size-5" />
                              </button>
                            </span>
                          )}
                        </div>
                        {client && (client.phoneNumber || client.email) && (
                          <div className="flex flex-wrap gap-2">
                            {client.email && (
                              <span className="group flex min-w-0 flex-1 items-center gap-2 break-all rounded-lg bg-indigo-50 px-3 py-2 text-xs text-gray-700 dark:bg-slate-800 dark:text-slate-300">
                                <FiMail className="size-3.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                                {client.email}
                                <CopyButton text={client.email} label="Email" />
                              </span>
                            )}
                            {client.phoneNumber && (
                              <span className="group flex flex-1 items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-xs text-gray-700 dark:bg-slate-800 dark:text-slate-300">
                                <FiPhone className="size-3.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                                {client.phoneNumber}
                                <CopyButton
                                  text={client.phoneNumber}
                                  label="Phone number"
                                />
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <NotAvailable />
              )}
            </Section>

            {/* Notes */}
            <Section title="Notes">
              {event.notes ? (
                <div className="rounded-2xl border border-gray-100 p-4 text-sm dark:border-slate-800">
                  <p className="whitespace-pre-wrap leading-relaxed text-gray-700 dark:text-slate-300">
                    {event.notes}
                  </p>
                </div>
              ) : (
                <NotAvailable />
              )}
            </Section>
          </div>
        )}
      </SidebarModal>
      <SendClientMessageModal
        display={!!event && !!messageClient}
        close={() => setMessageClient(null)}
        event={event}
        client={messageClient}
      />
      <InvoiceSettingsInterceptModal
        isOpen={!!event && invoiceStep === "settings"}
        onClose={() => setInvoiceStep(null)}
        onSkip={() => setInvoiceStep("create")}
        onSuccessAndProceed={() => setInvoiceStep("create")}
      />
      {event && invoiceClient && invoiceStep === "create" && (
        <InvoiceCreateModal
          defaultClient={invoiceClient}
          close={() => setInvoiceStep(null)}
        />
      )}
    </>
  );
}
