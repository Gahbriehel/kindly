"use client";

import { useState, type JSX, type ReactNode } from "react";
import dayjs from "dayjs";
import {
  FiClock,
  FiEdit2,
  FiFileText,
  FiGift,
  FiMail,
  FiMessageCircle,
  FiPhone,
  FiTrash2,
} from "react-icons/fi";
import { SidebarModal } from "@/src/components/UI/SidebarModal";
import { BaseButton } from "@/src/components/UI/Buttons";
import { CopyButton } from "@/src/components/UI/CopyButton";
import { NotAvailable } from "@/src/components/UI/NotAvailable";
import { SendClientMessageModal } from "@/src/components/Modals/SendClientMessageModal";
import { getInitials } from "@/src/helpers/stringHelpers";
import { formatDate } from "@/src/helpers/formatDate";
import type { IClient, IClientEvent } from "@/src/models/client";

interface Props {
  client: IClient | null;
  close: () => void;
  onEdit: (client: IClient) => void;
  onEditEvent?: (event: IClientEvent) => void;
  onDeleteEvent?: (event: IClientEvent) => void;
}

/** Next occurrence (today or later) of the month/day in `date`. */
function nextOccurrence(date: string): dayjs.Dayjs {
  const today = dayjs().startOf("day");
  const source = dayjs(date);
  let next = source.year(today.year());
  if (next.isBefore(today, "day")) next = next.add(1, "year");
  return next;
}

function daysLabel(days: number): string {
  if (days === 0) return "Today";
  return `in ${days} day${days === 1 ? "" : "s"}`;
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

function tagStyle(tag: string): string {
  return tag.toLowerCase() === "vip"
    ? "bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800/40"
    : "bg-gray-100 text-gray-700 border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
}

export function ClientViewModal({
  client,
  close,
  onEdit,
  onEditEvent,
  onDeleteEvent,
}: Props): JSX.Element {
  const [messageOpen, setMessageOpen] = useState(false);
  const birthday = client?.birthDate ? nextOccurrence(client.birthDate) : null;
  const daysAway = birthday?.diff(dayjs().startOf("day"), "day") ?? 0;
  const tags = [
    ...(client?.tags ?? []),
    ...(client?.groups?.map((g) => g.name) ?? []),
  ];

  const handleClose = () => {
    setMessageOpen(false);
    close();
  };

  return (
    <>
      <SidebarModal
        display={!!client}
        close={handleClose}
        title={
          client && (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-600 dark:bg-slate-800 dark:text-indigo-400">
                {getInitials(client.fullName) || "CL"}
              </div>
              <div className="min-w-0">
                <h2 className="truncate font-manrope text-base font-bold text-gray-900 dark:text-slate-100">
                  {client.fullName}
                </h2>
                {tags.length > 0 && (
                  <div className="mt-0.5 flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${tagStyle(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        }
        footer={
          client && (
            <>
              <BaseButton
                type="button"
                color="outline"
                text="Edit"
                icon={<FiEdit2 className="size-4" />}
                onClick={() => onEdit(client)}
                className="h-12 flex-1 rounded-2xl"
              />
              <BaseButton
                type="button"
                color="outline"
                text="Invoice"
                icon={<FiFileText className="size-4" />}
                onClick={() => {}}
                className="h-12 flex-1 rounded-2xl"
              />
              <BaseButton
                type="button"
                color="primary"
                text="Send Message"
                icon={<FiMessageCircle className="size-4" />}
                onClick={() => setMessageOpen(true)}
                className="h-12 flex-1 rounded-2xl"
              />
            </>
          )
        }
      >
        {client && (
          <div className="flex flex-col gap-6">
            {birthday && (
              <div className="rounded-2xl bg-indigo-50 p-4 dark:bg-indigo-950/30">
                <span className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  <FiGift className="size-4" /> Birthday
                </span>
                <p className="mt-1 font-manrope text-base font-bold text-gray-900 dark:text-slate-100">
                  {birthday.format("MMMM D")}
                </p>
                <span className="mt-1 flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400">
                  <FiClock className="size-3.5" /> {daysLabel(daysAway)}
                </span>
              </div>
            )}

            <Section title="Contact">
              {client.phoneNumber || client.email ? (
                <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 p-4 text-sm dark:border-slate-800">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600 dark:bg-slate-800 dark:text-indigo-400">
                        {getInitials(client.fullName) || "CL"}
                      </span>
                      <span className="truncate font-semibold text-gray-900 dark:text-slate-100">
                        {client.fullName}
                      </span>
                    </span>
                    <button
                      type="button"
                      aria-label="Message client"
                      onClick={() => setMessageOpen(true)}
                      className="shrink-0 cursor-pointer rounded-full p-1.5 text-indigo-600 transition-colors hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-slate-800"
                    >
                      <FiMessageCircle className="size-5" />
                    </button>
                  </div>
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
                </div>
              ) : (
                <NotAvailable />
              )}
            </Section>

            <Section title="Events">
              {client.events && client.events.length > 0 ? (
                <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-100 dark:divide-slate-800 dark:border-slate-800">
                  {client.events.map((event) => (
                    <li
                      key={event.id}
                      className="group flex items-center justify-between gap-3 overflow-hidden px-4 py-3 text-sm"
                    >
                      <span className="flex min-w-0 flex-wrap items-center gap-1.5">
                        <span className="font-medium text-gray-900 dark:text-slate-100">
                          {event.title}
                        </span>
                        {event.category && (
                          <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {event.category.name}
                          </span>
                        )}
                        {event.isRecurring && (
                          <span className="rounded-full border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600 dark:border-indigo-800/40 dark:bg-indigo-950/40 dark:text-indigo-400">
                            Annual
                          </span>
                        )}
                      </span>
                      <span className="flex shrink-0 items-center gap-2 text-gray-500 dark:text-slate-400">
                        {formatDate({
                          date: event.date,
                          showTime: false,
                          utc: false,
                        })}
                        <span className="flex w-auto items-center gap-2 opacity-100 transition-all duration-200 lg:w-0 lg:overflow-hidden lg:opacity-0 lg:group-hover:w-12 lg:group-hover:opacity-100 lg:group-focus-within:w-12 lg:group-focus-within:opacity-100">
                          <button
                            type="button"
                            aria-label="Edit event"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditEvent?.(event);
                            }}
                            className="cursor-pointer p-1 text-gray-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                          >
                            <FiEdit2 className="size-4" />
                          </button>
                          <button
                            type="button"
                            aria-label="Delete event"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteEvent?.(event);
                            }}
                            className="cursor-pointer p-1 text-gray-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
                          >
                            <FiTrash2 className="size-4" />
                          </button>
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <NotAvailable />
              )}
            </Section>
          </div>
        )}
      </SidebarModal>
      <SendClientMessageModal
        display={!!client && messageOpen}
        close={() => setMessageOpen(false)}
        client={client}
      />
    </>
  );
}
