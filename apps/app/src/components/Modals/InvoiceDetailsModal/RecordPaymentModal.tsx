"use client";

import type { JSX } from "react";
import { Controller, useForm } from "react-hook-form";
import { CenterModal } from "@/src/components/UI/CenterModal";
import { BaseButton } from "@/src/components/UI/Buttons";
import { Input } from "@/src/components/FormElements/Input";
import { useRecordInvoicePayment } from "@/src/hooks/useInvoiceQuery";
import { customToast } from "@/src/helpers/customToast";
import { formatCurrency } from "@/src/helpers/formatCurrency";
import {
  todayInputValue,
  validateNotFutureDate,
} from "@/src/helpers/dateHelpers";

interface PaymentFormValues {
  amount: string;
  paidAt: string;
  reference: string;
  note: string;
}

interface Props {
  invoiceId: string;
  currency: string;
  balanceDue: number;
  close: () => void;
}

const textareaClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm font-medium text-gray-700 outline-none transition-all placeholder-gray-400 focus:border-theme-primary focus:bg-white focus:ring-2 focus:ring-theme-primary/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-theme-primary dark:focus:bg-theme-surface dark:focus:ring-theme-primary/20";

/** Records a full or part payment. The amount starts at the outstanding balance. */
export function RecordPaymentModal({
  invoiceId,
  currency,
  balanceDue,
  close,
}: Props): JSX.Element {
  const { control, handleSubmit } = useForm<PaymentFormValues>({
    defaultValues: {
      amount: String(balanceDue),
      paidAt: todayInputValue(),
      reference: "",
      note: "",
    },
  });
  const recordPayment = useRecordInvoicePayment();

  const onSubmit = (values: PaymentFormValues) => {
    const amount = Number(values.amount);
    recordPayment.mutate(
      {
        id: invoiceId,
        payload: {
          amount,
          paidAt: values.paidAt,
          ...(values.reference.trim() && {
            reference: values.reference.trim(),
          }),
          ...(values.note.trim() && { note: values.note.trim() }),
        },
      },
      {
        onSuccess: () => {
          customToast.success(
            amount >= balanceDue
              ? "Invoice marked as paid"
              : `Payment of ${formatCurrency(amount, currency)} recorded`,
          );
          close();
        },
      },
    );
  };

  return (
    <CenterModal
      display
      close={close}
      title="Record payment"
      maxWidth="max-w-md"
      footer={
        <div className="flex items-center gap-3">
          <BaseButton
            type="button"
            color="outline"
            text="Cancel"
            onClick={close}
            disabled={recordPayment.isPending}
            className="h-11 flex-1 rounded-2xl"
          />
          <BaseButton
            type="button"
            color="primary"
            text="Record payment"
            onClick={handleSubmit(onSubmit)}
            loading={recordPayment.isPending}
            className="h-11 flex-1 rounded-2xl"
          />
        </div>
      }
    >
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 px-6 py-5"
      >
        <Controller
          name="amount"
          control={control}
          rules={{
            validate: (v) => {
              const num = Number(v);
              if (!v.trim() || Number.isNaN(num) || num < 0.01)
                return "Enter the amount received";
              if ((v.split(".")[1]?.length ?? 0) > 2)
                return "Maximum of 2 decimal places";
              if (num > balanceDue)
                return `Can't be more than ${formatCurrency(balanceDue, currency)}`;
              return true;
            },
          }}
          render={({ field, fieldState }) => (
            <div className="flex flex-col gap-1.5">
              <Input
                {...field}
                id="payment-amount"
                type="number"
                inputMode="decimal"
                min={0}
                max={balanceDue}
                step="0.01"
                label={`Amount received (${currency})`}
                required
                autoFocus
                error={fieldState.error?.message}
              />
              {!fieldState.error && (
                <p className="text-xs text-gray-400 dark:text-slate-500">
                  Outstanding: {formatCurrency(balanceDue, currency)}. Enter
                  less to record a part payment.
                </p>
              )}
            </div>
          )}
        />
        <Controller
          name="paidAt"
          control={control}
          rules={{
            required: "Pick the date it was paid",
            validate: (v) =>
              validateNotFutureDate(v, "Payment date can't be in the future"),
          }}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              id="payment-date"
              type="date"
              max={todayInputValue()}
              label="Paid on"
              required
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="reference"
          control={control}
          rules={{
            maxLength: { value: 150, message: "Maximum of 150 characters" },
          }}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              id="payment-reference"
              label="Reference (Optional)"
              placeholder="e.g. bank transfer ref"
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="note"
          control={control}
          rules={{
            maxLength: { value: 1000, message: "Maximum of 1000 characters" },
          }}
          render={({ field }) => (
            <fieldset className="space-y-2">
              <label
                htmlFor="payment-note"
                className="block text-sm font-semibold text-gray-600 dark:text-slate-400"
              >
                Note (Optional)
              </label>
              <textarea
                {...field}
                id="payment-note"
                rows={2}
                maxLength={1000}
                className={textareaClass}
              />
            </fieldset>
          )}
        />
      </form>
    </CenterModal>
  );
}
