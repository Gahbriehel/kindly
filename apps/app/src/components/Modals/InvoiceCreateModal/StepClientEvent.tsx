"use client";

import { useState, type JSX } from "react";
import {
  Controller,
  useWatch,
  type Control,
  type UseFormSetValue,
} from "react-hook-form";
import { clsx } from "clsx";
import { FiPhone, FiPlus, FiSearch } from "react-icons/fi";
import { LuCalendarPlus } from "react-icons/lu";
import { Input } from "@/src/components/FormElements/Input";
import { Skeleton } from "@/src/components/UI/Skeleton";
import { useClientQuery, useClientsQuery } from "@/src/hooks/useClientQuery";
import { useDebounce } from "@/src/hooks/useDebounce";
import { getInitials } from "@/src/helpers/stringHelpers";
import { getCategoryConfig } from "@/src/helpers/categoryConfig";
import { formatDate } from "@/src/helpers/formatDate";
import type { InvoiceClient, InvoiceEvent, InvoiceFormValues } from "./types";

const CLIENT_RESULTS_LIMIT = 5;

interface Props {
  control: Control<InvoiceFormValues>;
  setValue: UseFormSetValue<InvoiceFormValues>;
  onCreateClient: () => void;
  onAddEvent: () => void;
}

function ClientSummary({ client }: { client: InvoiceClient }): JSX.Element {
  return (
    <>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-indigo-100 bg-white text-[0.8rem] font-semibold text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-indigo-400">
        {getInitials(client.fullName) || "CL"}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-gray-900 dark:text-slate-100">
          {client.fullName}
        </p>
        {client.phoneNumber && (
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400">
            <FiPhone className="size-3.5 shrink-0" />
            <span className="truncate">{client.phoneNumber}</span>
          </p>
        )}
      </div>
    </>
  );
}

function ClientRow({
  client,
  onSelect,
}: {
  client: InvoiceClient;
  onSelect: () => void;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/60"
    >
      <ClientSummary client={client} />
    </button>
  );
}

function SelectedClientCard({
  client,
  onChange,
}: {
  client: InvoiceClient;
  onChange: () => void;
}): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 px-3 py-2.5 dark:border-indigo-900/60 dark:bg-indigo-950/40">
      <div className="flex min-w-0 items-center gap-3">
        <ClientSummary client={client} />
      </div>
      <button
        type="button"
        onClick={onChange}
        className="shrink-0 cursor-pointer text-sm font-medium text-theme-primary hover:underline"
      >
        Change
      </button>
    </div>
  );
}

function EventRow({
  event,
  selected,
  onSelect,
}: {
  event: InvoiceEvent;
  selected: boolean;
  onSelect: () => void;
}): JSX.Element {
  const config = getCategoryConfig(event.category?.name || "");
  const Icon = config.icon;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={clsx(
        "flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left transition-colors",
        selected
          ? "bg-indigo-50 dark:bg-indigo-950/40"
          : "hover:bg-gray-50 dark:hover:bg-slate-800/60",
      )}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <span className="truncate text-sm font-semibold text-gray-900 dark:text-slate-100">
          {event.title}
        </span>
        {event.category && (
          <span
            className={clsx(
              "inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
              config.bgClass,
            )}
          >
            <Icon className="size-3" />
            {event.category.name}
          </span>
        )}
      </div>
      <span className="shrink-0 text-sm text-gray-600 dark:text-slate-300">
        {formatDate({ date: event.date, showTime: false })}
      </span>
    </button>
  );
}

/** Step 1: who the invoice is for, what it's for, and the linked event. */
export function StepClientEvent({
  control,
  setValue,
  onCreateClient,
  onAddEvent,
}: Props): JSX.Element {
  const [search, setSearch] = useState("");
  // Only focus the search box when the user asks to change the client, not on open.
  const [focusSearch, setFocusSearch] = useState(false);
  const trimmedSearch = search.trim();
  const debouncedSearch = useDebounce(trimmedSearch, 400);
  const selectedClient = useWatch({ control, name: "client" });
  const selectedEvent = useWatch({ control, name: "event" });

  // Search-first: nothing is listed until the user types.
  const { data: clientsData, isLoading: loadingClients } = useClientsQuery(
    {
      page: 1,
      limit: CLIENT_RESULTS_LIMIT,
      search: debouncedSearch,
    },
    { enabled: !selectedClient && !!debouncedSearch },
  );
  const clients: InvoiceClient[] = clientsData?.data ?? [];
  const totalMatches = clientsData?.pagination?.total ?? clients.length;
  const searching =
    loadingClients || (!!trimmedSearch && trimmedSearch !== debouncedSearch);

  const { data: clientDetail, isLoading: loadingEvents } = useClientQuery(
    selectedClient?.id ?? "",
  );
  const events: InvoiceEvent[] = clientDetail?.data?.client?.events ?? [];

  const selectClient = (client: InvoiceClient) => {
    if (client.id === selectedClient?.id) return;
    setValue(
      "client",
      {
        id: client.id,
        fullName: client.fullName,
        email: client.email,
        phoneNumber: client.phoneNumber,
      },
      { shouldDirty: true, shouldValidate: true },
    );
    // Events belong to a client, so a new client clears the old pick.
    setValue("event", null, { shouldDirty: true });
    setSearch("");
  };

  const changeClient = () => {
    setValue("client", null, { shouldDirty: true });
    setValue("event", null, { shouldDirty: true });
    setFocusSearch(true);
  };

  return (
    <div className="flex flex-col gap-5">
      <Controller
        name="client"
        control={control}
        rules={{ validate: (v) => !!v || "Select who this invoice is for" }}
        render={({ fieldState }) => (
          <div className="flex flex-col gap-3">
            {selectedClient ? (
              <SelectedClientCard
                client={selectedClient}
                onChange={changeClient}
              />
            ) : (
              <>
                <Input
                  id="invoice-client-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search clients"
                  aria-label="Search clients"
                  autoFocus={focusSearch}
                  className="h-12 rounded-2xl pl-11"
                  icon={
                    <FiSearch className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-gray-400" />
                  }
                />

                {!trimmedSearch ? (
                  <p className="px-3 text-xs text-gray-400 dark:text-slate-500">
                    Search for the client this invoice is for.
                  </p>
                ) : (
                  <div className="flex flex-col gap-1">
                    {searching ? (
                      Array.from({ length: 2 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 px-3 py-2.5"
                        >
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="flex flex-col gap-1.5">
                            <Skeleton className="h-3.5 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      ))
                    ) : clients.length === 0 ? (
                      <p className="px-3 py-4 text-center text-sm text-gray-500 dark:text-slate-400">
                        No clients match &quot;{debouncedSearch}&quot;
                      </p>
                    ) : (
                      <>
                        {clients.map((client) => (
                          <ClientRow
                            key={client.id}
                            client={client}
                            onSelect={() => selectClient(client)}
                          />
                        ))}
                        {totalMatches > clients.length && (
                          <p className="px-3 pt-1 text-xs text-gray-400 dark:text-slate-500">
                            Showing {clients.length} of {totalMatches}. Keep
                            typing to narrow it down.
                          </p>
                        )}
                      </>
                    )}
                  </div>
                )}
              </>
            )}

            <div className="flex items-start justify-between gap-3">
              {fieldState.error && (
                <p className="text-xs font-medium text-red-600">
                  {fieldState.error.message}
                </p>
              )}
              <button
                type="button"
                onClick={onCreateClient}
                className="ml-auto flex shrink-0 cursor-pointer items-center gap-1.5 text-sm font-medium text-theme-primary hover:underline"
              >
                <FiPlus className="size-4" /> Create New Client
              </button>
            </div>
          </div>
        )}
      />

      <Controller
        name="description"
        control={control}
        rules={{
          validate: (v) => !!v.trim() || "Tell your client what this is for",
          maxLength: { value: 2000, message: "Maximum of 2000 characters" },
        }}
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-1.5">
            <Input
              {...field}
              id="invoice-description"
              label="What is this invoice for?"
              placeholder="Sarah's 40th birthday dinner"
              required
              error={fieldState.error?.message}
            />
            {!fieldState.error && (
              <p className="text-xs text-gray-400 dark:text-slate-500">
                Your client sees this on the document.
              </p>
            )}
          </div>
        )}
      />

      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
            Events
          </h3>
          <button
            type="button"
            onClick={onAddEvent}
            disabled={!selectedClient}
            title={selectedClient ? undefined : "Select a client first"}
            className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-theme-primary hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
          >
            <LuCalendarPlus className="size-4" /> Add event
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-slate-700">
          {!selectedClient ? (
            <p className="px-4 py-5 text-center text-sm text-gray-500 dark:text-slate-400">
              Select a client to see their events.
            </p>
          ) : loadingEvents ? (
            <div className="flex flex-col gap-3 px-4 py-4">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ) : events.length === 0 ? (
            <p className="px-4 py-5 text-center text-sm text-gray-500 dark:text-slate-400">
              {selectedClient.fullName} has no events yet.
            </p>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-slate-800">
              {events.map((event) => (
                <EventRow
                  key={event.id}
                  event={event}
                  selected={event.id === selectedEvent?.id}
                  onSelect={() =>
                    setValue(
                      "event",
                      event.id === selectedEvent?.id
                        ? null
                        : {
                            id: event.id,
                            title: event.title,
                            date: event.date,
                            category: event.category,
                          },
                      { shouldDirty: true },
                    )
                  }
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
