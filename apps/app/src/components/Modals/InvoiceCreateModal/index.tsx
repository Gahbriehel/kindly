"use client";

import { useEffect, useMemo, useState, type JSX } from "react";
import { useForm } from "react-hook-form";
import { clsx } from "clsx";
import dayjs from "dayjs";
import { FiAlertCircle, FiCheck } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { LuFileText } from "react-icons/lu";
import { CenterModal } from "@/src/components/UI/CenterModal";
import { BaseButton } from "@/src/components/UI/Buttons";
import type { ISelect } from "@/src/components/FormElements/Select";
import { ClientFormModal } from "@/src/components/Forms/ClientFormModal";
import { EventFormDrawer } from "@/src/components/Forms/EventFormDrawer";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { useCountriesQuery } from "@/src/hooks/useLocationQuery";
import {
  useCreateInvoice,
  useInvoiceSettingsQuery,
  useSendInvoice,
  useUpdateInvoice,
} from "@/src/hooks/useInvoiceQuery";
import { useUnsavedChangesGuard } from "@/src/hooks/useUnsavedChangesGuard";
import { customToast } from "@/src/helpers/customToast";
import { calculateInvoiceTotals } from "@/src/helpers/invoiceTotals";
import { FALLBACK_COUNTRIES } from "@/src/models/locations";
import type { IUserData } from "@/src/models/auth";
import { StepClientEvent } from "./StepClientEvent";
import { StepCosts } from "./StepCosts";
import { StepPreview, type InvoiceBusiness } from "./StepPreview";
import {
  emptyItem,
  toInvoicePayload,
  toNumber,
  type InvoiceFormValues,
} from "./types";

const STEPS = ["Client & event", "Costs", "Preview & send"];
const FALLBACK_CURRENCY = "NGN";

const BUSINESS_FIELD_LABELS: [keyof InvoiceBusiness, string][] = [
  ["logoUrl", "logo"],
  ["billingAddress", "billing address"],
  ["registrationNumber", "registration number"],
  ["taxId", "tax ID"],
  ["bankName", "bank name"],
  ["bankAccountName", "account name"],
  ["bankAccountNumber", "account number"],
];

const listJoin = (parts: string[]): string =>
  parts.length <= 1
    ? parts.join("")
    : `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;

/** Everything the backend requires before an invoice can be sent. */
function getSendBlockers(
  business: InvoiceBusiness,
  values: InvoiceFormValues,
): string[] {
  const blockers: string[] = [];
  const missing = BUSINESS_FIELD_LABELS.filter(([key]) => !business[key]).map(
    ([, label]) => label,
  );
  if (missing.length)
    blockers.push(`Add your ${listJoin(missing)} in Profile → Business.`);
  if (!values.client?.email?.trim())
    blockers.push(
      `Add an email address to ${values.client?.fullName ?? "the client"}'s profile.`,
    );
  if (!values.event) blockers.push("Link an event to this invoice in step 1.");
  if (!values.dueDate || values.dueDate <= dayjs().format("YYYY-MM-DD"))
    blockers.push("Set a due date after today.");
  return blockers;
}

function Stepper({ current }: { current: number }): JSX.Element {
  return (
    <ol className="flex items-center gap-2 px-6 pb-4">
      {STEPS.map((label, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li
            key={label}
            aria-current={active ? "step" : undefined}
            className={clsx(
              "flex items-center gap-2",
              index < STEPS.length - 1 && "flex-1",
            )}
          >
            <span
              className={clsx(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                active && "bg-theme-primary text-white",
                done &&
                  "bg-indigo-50 text-theme-primary dark:bg-indigo-950/50 dark:text-indigo-300",
                !active &&
                  !done &&
                  "bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-500",
              )}
            >
              {done ? <FiCheck className="size-3.5" /> : index + 1}
            </span>
            <span
              className={clsx(
                "whitespace-nowrap text-xs font-medium",
                active || done
                  ? "text-gray-900 dark:text-slate-100"
                  : "text-gray-400 dark:text-slate-500",
              )}
            >
              {label}
            </span>
            {index < STEPS.length - 1 && (
              <span className="h-px min-w-4 flex-1 bg-gray-200 dark:bg-slate-700" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

interface Props {
  close: () => void;
}

/** Three-step "New invoice" flow. Nothing is saved until Save as Draft or Send. */
export function InvoiceCreateModal({ close }: Props): JSX.Element {
  const [step, setStep] = useState(0);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<"draft" | "send" | null>(
    null,
  );
  const [clientFormOpen, setClientFormOpen] = useState(false);
  const [eventFormOpen, setEventFormOpen] = useState(false);

  const { user } = useAppSelector((state) => state.auth);
  const company = (user as IUserData | null)?.company;
  const { data: settingsData } = useInvoiceSettingsQuery();
  const settings = settingsData?.data?.settings;

  const { data: countriesData, isLoading: loadingCountries } =
    useCountriesQuery();
  const countries = countriesData?.data?.countries?.length
    ? countriesData.data.countries
    : FALLBACK_COUNTRIES;

  const currencyOptions = useMemo<ISelect[]>(
    () =>
      [...new Set(countries.map((c) => c.currency).filter(Boolean))]
        .sort()
        .map((code) => ({
          value: { _id: code as string },
          label: code as string,
        })),
    [countries],
  );
  const companyCurrency =
    countries.find(
      (c) => c.name.toLowerCase() === company?.country?.toLowerCase(),
    )?.currency || FALLBACK_CURRENCY;

  const {
    control,
    trigger,
    getValues,
    setValue,
    resetField,
    getFieldState,
    formState: { isDirty },
  } = useForm<InvoiceFormValues>({
    defaultValues: {
      client: null,
      description: "",
      event: null,
      items: [emptyItem()],
      currency: {
        value: { _id: companyCurrency },
        label: companyCurrency,
      },
      discountPercent: "",
      taxPercent: "",
      dueDate: dayjs().add(14, "day").format("YYYY-MM-DD"),
      note: "",
    },
  });

  // The countries list can arrive after mount; follow it until the user picks.
  useEffect(() => {
    if (getFieldState("currency").isDirty) return;
    resetField("currency", {
      defaultValue: { value: { _id: companyCurrency }, label: companyCurrency },
    });
  }, [companyCurrency, getFieldState, resetField]);

  const { requestClose, prompt } = useUnsavedChangesGuard(isDirty, close);

  const createMutation = useCreateInvoice();
  const updateMutation = useUpdateInvoice();
  const sendMutation = useSendInvoice();

  const business: InvoiceBusiness = {
    businessName: company?.businessName || "Your business",
    logoUrl: settings?.logoUrl || company?.logoUrl || null,
    billingAddress: settings?.billingAddress || company?.billingAddress || null,
    country: company?.country || null,
    phoneNumber: company?.phoneNumber || null,
    registrationNumber:
      settings?.registrationNumber || company?.registrationNumber || null,
    taxId: settings?.taxId || company?.taxId || null,
    bankAccountName:
      settings?.bankAccountName || company?.bankAccountName || null,
    bankAccountNumber:
      settings?.bankAccountNumber || company?.bankAccountNumber || null,
    bankName: settings?.bankName || company?.bankName || null,
  };

  // Step 3 has no inputs, so a snapshot at render time is always current.
  const values = getValues();
  const totals = calculateInvoiceTotals(
    values.items.map((item) => ({
      quantity: toNumber(item.quantity),
      priceEach: toNumber(item.priceEach),
    })),
    toNumber(values.discountPercent),
    toNumber(values.taxPercent),
  );
  const sendBlockers = step === 2 ? getSendBlockers(business, values) : [];

  const goNext = async () => {
    const fields: (keyof InvoiceFormValues)[] =
      step === 0
        ? ["client", "description"]
        : [
            "items",
            "currency",
            "dueDate",
            "discountPercent",
            "taxPercent",
            "note",
          ];
    if (await trigger(fields)) setStep((s) => s + 1);
  };

  /** Creates the draft once; later saves update it (e.g. a retry after a failed send). */
  const saveDraft = async (): Promise<string> => {
    const payload = toInvoicePayload(getValues());
    if (draftId) {
      await updateMutation.mutateAsync({
        id: draftId,
        payload: { ...payload, eventId: payload.eventId ?? null },
      });
      return draftId;
    }
    const response = await createMutation.mutateAsync(payload);
    const id = response.data.invoice.id;
    setDraftId(id);
    return id;
  };

  // Request errors are toasted by the axios interceptor; the modal stays open.
  const onSaveDraft = async () => {
    setPendingAction("draft");
    try {
      await saveDraft();
      customToast.success("Invoice saved as draft");
      close();
    } catch {
      setPendingAction(null);
    }
  };

  const onSend = async () => {
    setPendingAction("send");
    try {
      const id = await saveDraft();
      await sendMutation.mutateAsync(id);
      customToast.success(`Invoice sent to ${values.client?.email}`);
      close();
    } catch {
      setPendingAction(null);
    }
  };

  const isBusy = pendingAction !== null;
  const sendBlockedReason = sendBlockers.join(" ");

  const header = (
    <div className="flex flex-col gap-5 pt-6">
      <div className="flex items-start justify-between gap-4 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50/90 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <LuFileText className="size-5.5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 sm:text-lg dark:text-white">
              New invoice
            </h2>
            <p className="text-xs text-gray-400 sm:text-sm dark:text-slate-400">
              List what they are paying for
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={requestClose}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:text-slate-400 dark:hover:bg-slate-800"
          aria-label="Close modal"
        >
          <IoClose size={20} />
        </button>
      </div>
      <Stepper current={step} />
    </div>
  );

  const footer =
    step < 2 ? (
      <div className="flex items-center gap-3">
        <BaseButton
          type="button"
          color="outline"
          text={step === 0 ? "Cancel" : "Back"}
          onClick={step === 0 ? requestClose : () => setStep((s) => s - 1)}
          className="h-12 flex-1 rounded-2xl"
        />
        <BaseButton
          type="button"
          color="primary"
          text="Continue"
          onClick={goNext}
          className="h-12 flex-1 rounded-2xl"
        />
      </div>
    ) : (
      <div className="flex flex-col gap-3">
        {sendBlockers.length > 0 && (
          <div
            id="invoice-send-blockers"
            role="status"
            className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 dark:border-amber-800/40 dark:bg-amber-950/30"
          >
            <FiAlertCircle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <div className="text-xs text-amber-900 dark:text-amber-200">
              <p className="font-semibold">
                You can save this as a draft, but it can&apos;t be sent yet:
              </p>
              <ul className="mt-1 list-disc space-y-0.5 pl-4">
                {sendBlockers.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <div className="flex items-center gap-3">
          <BaseButton
            type="button"
            color="outline"
            text="Edit"
            onClick={() => setStep(0)}
            disabled={isBusy}
            className="h-12 flex-1 rounded-2xl"
          />
          <BaseButton
            type="button"
            color="outline"
            text="Save as Draft"
            onClick={onSaveDraft}
            loading={pendingAction === "draft"}
            disabled={isBusy}
            className="h-12 flex-1 rounded-2xl"
          />
          {/* Disabled buttons don't fire hover events, so the tooltip sits on a wrapper. */}
          <span className="flex flex-1" title={sendBlockedReason || undefined}>
            <BaseButton
              type="button"
              color="primary"
              text="Send invoice"
              onClick={onSend}
              loading={pendingAction === "send"}
              disabled={isBusy || sendBlockers.length > 0}
              aria-describedby={
                sendBlockers.length ? "invoice-send-blockers" : undefined
              }
              className="h-12 w-full rounded-2xl"
            />
          </span>
        </div>
      </div>
    );

  return (
    <>
      <CenterModal
        display
        close={requestClose}
        header={header}
        footer={footer}
        ariaLabel="New invoice"
        maxWidth="max-w-[720px]"
        closeOnEscape={!clientFormOpen && !eventFormOpen}
      >
        <form
          noValidate
          onSubmit={(e) => e.preventDefault()}
          className="max-h-[calc(100dvh-20rem)] overflow-y-auto px-6 pb-6"
        >
          {step === 0 && (
            <StepClientEvent
              control={control}
              setValue={setValue}
              onCreateClient={() => setClientFormOpen(true)}
              onAddEvent={() => setEventFormOpen(true)}
            />
          )}
          {step === 1 && (
            <StepCosts
              control={control}
              currencyOptions={currencyOptions}
              loadingCurrencies={loadingCountries}
            />
          )}
          {step === 2 && (
            <StepPreview values={values} business={business} totals={totals} />
          )}
        </form>
        {prompt}
      </CenterModal>

      {clientFormOpen && (
        <ClientFormModal
          close={() => setClientFormOpen(false)}
          onCreated={(client) => {
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
            setValue("event", null, { shouldDirty: true });
          }}
        />
      )}
      {eventFormOpen && (
        <EventFormDrawer
          close={() => setEventFormOpen(false)}
          defaultClient={values.client}
          onCreated={(event) =>
            setValue(
              "event",
              {
                id: event.id,
                title: event.title,
                date: event.date,
                category: event.category,
              },
              { shouldDirty: true },
            )
          }
        />
      )}
    </>
  );
}
