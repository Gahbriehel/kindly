"use client";

import { useCallback, useEffect, useState, type JSX } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { LuPencil, LuFileText } from "react-icons/lu";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { ClipLoader } from "react-spinners";
import {
  useInvoiceSettingsQuery,
  useUpdateInvoiceSettings,
} from "@/src/hooks/useInvoiceQuery";
import { Input } from "@/src/components/FormElements/Input";
import { BaseButton } from "@/src/components/UI/Buttons";
import { customToast } from "@/src/helpers/customToast";
import { axiosErrorToast } from "@/src/helpers/axiosErrorToast";
import type { IUpdateInvoiceSettingsPayload } from "@/src/models/invoice";

dayjs.extend(utc);

const PREFIX_PATTERN = /^[A-Za-z0-9_-]{2,10}$/;

interface InvoiceSettingsFormValues {
  invoicePrefix: string;
  nextInvoiceNumber: string;
}

/** Mirrors the backend format: PREFIX-YYMM-NNN, with the period in UTC. */
function formatInvoiceNumber(prefix: string, counter: number): string {
  const period = dayjs.utc().format("YYMM");
  return `${prefix}-${period}-${String(Math.max(counter, 1)).padStart(3, "0")}`;
}

export function InvoiceSettingsForm(): JSX.Element {
  const [isEditing, setIsEditing] = useState(false);
  const { data, isLoading: isFetching } = useInvoiceSettingsQuery();
  const settings = data?.data?.settings;
  const updateSettingsMutation = useUpdateInvoiceSettings();

  const effectivePrefix = settings?.effectivePrefix || "INV";
  const savedNextNumber = settings?.nextInvoiceNumber ?? 1;

  const getInitialValues = useCallback(
    (): InvoiceSettingsFormValues => ({
      invoicePrefix: settings?.invoicePrefix ?? "",
      nextInvoiceNumber: String(settings?.nextInvoiceNumber ?? 1),
    }),
    [settings],
  );

  const { control, handleSubmit, reset } = useForm<InvoiceSettingsFormValues>({
    defaultValues: getInitialValues(),
  });

  // Sync form when settings load or change
  useEffect(() => {
    if (settings) {
      reset(getInitialValues());
    }
  }, [settings, reset, getInitialValues]);

  // Live preview watch
  const watchedPrefix = useWatch({ control, name: "invoicePrefix" });
  const watchedNextNumber = useWatch({ control, name: "nextInvoiceNumber" });

  const typedPrefix = watchedPrefix?.trim() ?? "";
  const previewPrefix = isEditing
    ? PREFIX_PATTERN.test(typedPrefix)
      ? typedPrefix.toUpperCase()
      : effectivePrefix
    : effectivePrefix;
  const previewNumber = isEditing
    ? parseInt(watchedNextNumber, 10) || 1
    : savedNextNumber;
  const preview = formatInvoiceNumber(previewPrefix, previewNumber);

  const isSaving = updateSettingsMutation.isPending;

  function handleCancel() {
    reset(getInitialValues());
    setIsEditing(false);
  }

  function onSubmit(values: InvoiceSettingsFormValues) {
    const prefix = values.invoicePrefix.trim().toUpperCase() || null;
    const nextNumber = parseInt(values.nextInvoiceNumber, 10);

    // Send only what changed so the counter isn't reset by a prefix edit
    const payload: IUpdateInvoiceSettingsPayload = {};
    if (prefix !== (settings?.invoicePrefix ?? null)) {
      payload.invoicePrefix = prefix;
    }
    if (nextNumber !== savedNextNumber) {
      payload.nextInvoiceNumber = nextNumber;
    }

    if (Object.keys(payload).length === 0) {
      setIsEditing(false);
      return;
    }

    updateSettingsMutation.mutate(payload, {
      onSuccess: () => {
        customToast.success("Invoice settings saved");
        setIsEditing(false);
      },
      onError: (err) => {
        axiosErrorToast(err);
      },
    });
  }

  return (
    <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 dark:border-slate-700/60 dark:bg-slate-800">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-slate-100">
            Invoice Settings
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Control how your invoices are numbered
          </p>
        </div>

        {isEditing ? (
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <BaseButton
              type="button"
              color="outline"
              onClick={handleCancel}
              disabled={isSaving}
              text="Cancel"
            />
            <BaseButton
              type="submit"
              form="inline-invoice-settings-form"
              color="primary"
              loading={isSaving}
              text="Save Changes"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            disabled={isFetching}
            className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            <LuPencil className="size-3.5 text-gray-500 dark:text-slate-400" />
            <span>Edit</span>
          </button>
        )}
      </div>

      {/* Next Invoice Preview Banner */}
      <div className="mt-6 flex items-center gap-5 rounded-2xl border border-gray-200/60 bg-gray-50/80 p-5 sm:p-6 dark:border-slate-700/50 dark:bg-theme-surface/60">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-theme-primary ring-4 ring-indigo-50/60 dark:bg-indigo-950/70 dark:border-indigo-800/50 dark:text-indigo-300 dark:ring-indigo-900/30">
          <LuFileText className="size-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
            Next invoice number
          </p>
          {isFetching ? (
            <div className="mt-2">
              <ClipLoader size={18} color="currentColor" />
            </div>
          ) : (
            <p className="mt-1 font-mono text-lg sm:text-xl font-bold text-gray-900 dark:text-slate-100 break-all">
              {preview}
            </p>
          )}
        </div>
      </div>

      {/* Form / Details */}
      <form
        id="inline-invoice-settings-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-8 divide-y divide-gray-100 dark:divide-slate-700/50"
      >
        {/* ── Section: Numbering ───────────────────────────── */}
        <div className="pb-2 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2">
            Invoice Numbering
          </h4>
        </div>

        {/* Invoice Prefix */}
        <div className="py-4.5 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
          <span className="text-sm font-medium text-gray-500 dark:text-slate-400 sm:w-48 shrink-0 sm:pt-2.5">
            Invoice Prefix
          </span>
          <div className="w-full sm:max-w-xl">
            {isEditing ? (
              <Controller
                name="invoicePrefix"
                control={control}
                rules={{
                  validate: (value) =>
                    !value.trim() ||
                    PREFIX_PATTERN.test(value.trim()) ||
                    "Use 2–10 letters, numbers, hyphens or underscores",
                }}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    id="invoicePrefix"
                    placeholder={`Auto (${effectivePrefix})`}
                    maxLength={10}
                    autoComplete="off"
                    className="uppercase"
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                    error={fieldState.error?.message}
                  />
                )}
              />
            ) : (
              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 py-0.5">
                {settings?.invoicePrefix || (
                  <span className="text-gray-400 dark:text-slate-500 italic font-normal">
                    Auto ({effectivePrefix})
                  </span>
                )}
              </p>
            )}
            <p className="mt-1.5 text-xs text-gray-400 dark:text-slate-500">
              Leave blank to automatically generate from your business initials
              (e.g. {formatInvoiceNumber(effectivePrefix, 1)}).
            </p>
          </div>
        </div>

        {/* Next Invoice Number */}
        <div className="py-4.5 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
          <span className="text-sm font-medium text-gray-500 dark:text-slate-400 sm:w-48 shrink-0 sm:pt-2.5">
            Next Invoice Number
          </span>
          <div className="w-full sm:max-w-xl">
            {isEditing ? (
              <Controller
                name="nextInvoiceNumber"
                control={control}
                rules={{
                  validate: (value) =>
                    (/^\d+$/.test(value.trim()) && parseInt(value, 10) >= 1) ||
                    "Enter a whole number of 1 or more",
                }}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    id="nextInvoiceNumber"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    step={1}
                    placeholder="1"
                    error={fieldState.error?.message}
                  />
                )}
              />
            ) : (
              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 py-0.5">
                {savedNextNumber}
              </p>
            )}
            <p className="mt-1.5 text-xs text-gray-400 dark:text-slate-500">
              Counter for the current month. Automatically resets to 1 on the
              1st of each month.
            </p>
          </div>
        </div>
      </form>

      {/* Bottom Action Buttons in Edit Mode */}
      {isEditing && (
        <div className="mt-8 flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-slate-700/50">
          <BaseButton
            type="button"
            color="outline"
            onClick={handleCancel}
            disabled={isSaving}
            text="Cancel"
          />
          <BaseButton
            type="submit"
            form="inline-invoice-settings-form"
            color="primary"
            loading={isSaving}
            text="Save Changes"
          />
        </div>
      )}
    </div>
  );
}
