"use client";

import { type ComponentProps, type JSX } from "react";
import {
  Controller,
  useFieldArray,
  useFormState,
  useWatch,
  type Control,
} from "react-hook-form";
import { clsx } from "clsx";
import dayjs from "dayjs";
import { FiPlus } from "react-icons/fi";
import { LuTrash2 } from "react-icons/lu";
import { Input } from "@/src/components/FormElements/Input";
import { Select, type ISelect } from "@/src/components/FormElements/Select";
import { INVOICE_COMMON_COSTS } from "@/src/data/invoiceCommonCosts";
import { calculateInvoiceTotals } from "@/src/helpers/invoiceTotals";
import { formatCurrency } from "@/src/helpers/formatCurrency";
import { emptyItem, toNumber, type InvoiceFormValues } from "./types";

interface Props {
  control: Control<InvoiceFormValues>;
  currencyOptions: ISelect[];
  loadingCurrencies: boolean;
}

const decimals = (value: string): number => value.split(".")[1]?.length ?? 0;

function validatePercent(value: string): true | string {
  if (!value.trim()) return true;
  const num = Number(value);
  if (Number.isNaN(num) || num < 0 || num > 100)
    return "Enter a value between 0 and 100";
  if (decimals(value) > 2) return "Maximum of 2 decimal places";
  return true;
}

function CellInput({
  invalid,
  className,
  ...props
}: ComponentProps<"input"> & { invalid?: boolean }): JSX.Element {
  return (
    <input
      {...props}
      aria-invalid={invalid || undefined}
      className={clsx(
        "h-10 w-full min-w-0 rounded-xl border bg-white px-3 text-sm font-medium text-gray-800 outline-none transition-all placeholder-gray-400",
        "focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/20",
        "dark:bg-slate-800/80 dark:text-slate-200 dark:placeholder-slate-500",
        invalid
          ? "border-red-500 dark:border-red-500/50"
          : "border-gray-200 dark:border-slate-700",
        className,
      )}
    />
  );
}

const textareaClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm font-medium text-gray-700 outline-none transition-all placeholder-gray-400 focus:border-theme-primary focus:bg-white focus:ring-2 focus:ring-theme-primary/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-theme-primary dark:focus:bg-theme-surface dark:focus:ring-theme-primary/20";

const ROW_GRID =
  "grid grid-cols-[minmax(0,2fr)_minmax(0,0.8fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_2rem] items-center gap-2";

/** Step 2: line items, adjustments, due date and the note to the client. */
export function StepCosts({
  control,
  currencyOptions,
  loadingCurrencies,
}: Props): JSX.Element {
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const { errors } = useFormState({ control, name: "items" });
  const items = useWatch({ control, name: "items" });
  const currency = useWatch({ control, name: "currency" }).value._id;
  const discountPercent = useWatch({ control, name: "discountPercent" });
  const taxPercent = useWatch({ control, name: "taxPercent" });

  const totals = calculateInvoiceTotals(
    items.map((item) => ({
      quantity: toNumber(item.quantity),
      priceEach: toNumber(item.priceEach),
    })),
    toNumber(discountPercent),
    toNumber(taxPercent),
  );
  const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");
  const hasItemErrors =
    Array.isArray(errors.items) && errors.items.some(Boolean);

  return (
    <div className="flex flex-col gap-5">
      <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-slate-700">
        <div className="min-w-[560px]">
          <div
            className={clsx(
              ROW_GRID,
              "bg-gray-50 px-3 py-2.5 text-xs font-medium text-gray-500 dark:bg-slate-800/60 dark:text-slate-400",
            )}
          >
            <span>What it is</span>
            <span>How many</span>
            <span>Price each</span>
            <span>Amount</span>
            <span className="sr-only">Remove</span>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-slate-800">
            {fields.map((field, index) => {
              const rowErrors = errors.items?.[index];
              return (
                <div key={field.id} className={clsx(ROW_GRID, "px-3 py-2.5")}>
                  <Controller
                    name={`items.${index}.item`}
                    control={control}
                    rules={{
                      validate: (v) => !!v.trim() || "Name this cost",
                      maxLength: { value: 200, message: "Too long" },
                    }}
                    render={({ field }) => (
                      <CellInput
                        {...field}
                        aria-label={`Cost ${index + 1} name`}
                        placeholder="e.g. Birthday cake"
                        invalid={!!rowErrors?.item}
                        title={rowErrors?.item?.message}
                      />
                    )}
                  />
                  <Controller
                    name={`items.${index}.quantity`}
                    control={control}
                    rules={{
                      validate: (v) => {
                        const num = Number(v);
                        if (!v.trim() || Number.isNaN(num) || num < 0.001)
                          return "Must be more than 0";
                        if (decimals(v) > 3) return "Max 3 decimal places";
                        return true;
                      },
                    }}
                    render={({ field }) => (
                      <CellInput
                        {...field}
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="any"
                        aria-label={`Cost ${index + 1} quantity`}
                        invalid={!!rowErrors?.quantity}
                        title={rowErrors?.quantity?.message}
                        className="text-center"
                      />
                    )}
                  />
                  <Controller
                    name={`items.${index}.priceEach`}
                    control={control}
                    rules={{
                      validate: (v) => {
                        const num = Number(v);
                        if (!v.trim() || Number.isNaN(num) || num < 0)
                          return "Enter a price";
                        if (decimals(v) > 2) return "Max 2 decimal places";
                        return true;
                      },
                    }}
                    render={({ field }) => (
                      <CellInput
                        {...field}
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="0.01"
                        placeholder="0.00"
                        aria-label={`Cost ${index + 1} price each`}
                        invalid={!!rowErrors?.priceEach}
                        title={rowErrors?.priceEach?.message}
                      />
                    )}
                  />
                  <span className="text-sm font-bold text-gray-900 [overflow-wrap:anywhere] dark:text-slate-100">
                    {formatCurrency(totals.lines[index], currency)}
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    title={
                      fields.length === 1
                        ? "An invoice needs at least one cost"
                        : "Remove cost"
                    }
                    aria-label={`Remove cost ${index + 1}`}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-400 dark:hover:bg-red-950/30"
                  >
                    <LuTrash2 className="size-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {hasItemErrors && (
        <p className="-mt-3 text-xs font-medium text-red-600">
          Each cost needs a name, a quantity above 0 and a price.
        </p>
      )}

      <button
        type="button"
        onClick={() => append(emptyItem())}
        className="flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-theme-primary transition-colors hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800"
      >
        <FiPlus className="size-4" /> Add another cost
      </button>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-gray-500 dark:text-slate-400">
          Common costs
        </span>
        <div className="flex flex-wrap gap-2">
          {INVOICE_COMMON_COSTS.map((cost) => (
            <button
              key={cost}
              type="button"
              onClick={() => append(emptyItem(cost))}
              className="cursor-pointer rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              + {cost}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Controller
          name="currency"
          control={control}
          rules={{ validate: (v) => !!v.value._id || "Select a currency" }}
          render={({ field, fieldState }) => (
            <Select
              ref={field.ref}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              label="Currency"
              placeholder="Select currency"
              options={currencyOptions}
              loading={loadingCurrencies}
              validationError={fieldState.error?.message}
              required
            />
          )}
        />
        <Controller
          name="dueDate"
          control={control}
          rules={{
            validate: (v) =>
              !v
                ? "Pick a due date"
                : v >= tomorrow || "Due date must be after today",
          }}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              id="invoice-due-date"
              type="date"
              min={tomorrow}
              label="Payment due by"
              required
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="discountPercent"
          control={control}
          rules={{ validate: validatePercent }}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              id="invoice-discount"
              type="number"
              inputMode="decimal"
              min={0}
              max={100}
              step="0.01"
              label="Discount (%)"
              placeholder="0.00"
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="taxPercent"
          control={control}
          rules={{ validate: validatePercent }}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              id="invoice-tax"
              type="number"
              inputMode="decimal"
              min={0}
              max={100}
              step="0.01"
              label="Tax (%)"
              placeholder="0.00"
              error={fieldState.error?.message}
            />
          )}
        />
      </div>

      <Controller
        name="note"
        control={control}
        rules={{
          maxLength: { value: 3000, message: "Maximum of 3000 characters" },
        }}
        render={({ field, fieldState }) => (
          <fieldset className="space-y-2">
            <label
              htmlFor="invoice-note"
              className="block text-sm font-semibold text-gray-600 dark:text-slate-400"
            >
              Note for your client
            </label>
            <textarea
              {...field}
              id="invoice-note"
              rows={3}
              maxLength={3000}
              placeholder="Thank you for your business. Payment is due within 14 days."
              className={textareaClass}
            />
            {fieldState.error && (
              <p className="text-xs font-medium text-red-600">
                {fieldState.error.message}
              </p>
            )}
          </fieldset>
        )}
      />

      <div className="flex items-center justify-between gap-4 rounded-2xl bg-indigo-50 px-5 py-4 dark:bg-indigo-950/40">
        <span className="text-sm font-semibold text-gray-700 dark:text-slate-200">
          Total the client will pay
        </span>
        <span className="text-xl font-bold text-indigo-950 dark:text-indigo-200">
          {formatCurrency(totals.total, currency)}
        </span>
      </div>
    </div>
  );
}
