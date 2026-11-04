"use client";

import type { JSX } from "react";
import { RiWhatsappLine } from "react-icons/ri";
import { BaseButton } from "@/src/components/UI/Buttons";

interface Props {
  clientName: string;
  loading: "yes" | "no" | null;
  onYes: () => void;
  onNo: () => void;
}

/** The "Did you send it?" question shown after WhatsApp was opened. */
export function WhatsappConfirmBody({
  clientName,
  loading,
  onYes,
  onNo,
}: Props): JSX.Element {
  return (
    <div className="flex flex-col items-center gap-5 p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400">
        <RiWhatsappLine className="size-6" />
      </div>
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-gray-900 dark:text-slate-100">
          Did you send the message to {clientName}?
        </h2>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          WhatsApp doesn&apos;t tell us if it was sent, so let us know.
        </p>
      </div>
      <div className="flex w-full items-center gap-3">
        <BaseButton
          type="button"
          color="outline"
          text="No, not sent"
          onClick={onNo}
          loading={loading === "no"}
          disabled={loading !== null}
          className="flex-1"
        />
        <BaseButton
          type="button"
          color="primary"
          text="Yes, sent"
          onClick={onYes}
          loading={loading === "yes"}
          disabled={loading !== null}
          className="flex-1"
        />
      </div>
    </div>
  );
}
