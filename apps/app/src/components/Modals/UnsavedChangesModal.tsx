"use client";

import { BaseButton } from "../UI/Buttons";

interface UnsavedChangesModalProps {
  display: boolean;
  /** Keep editing: dismiss the prompt and stay on the form. */
  stay: () => void;
  /** Discard the changes and leave the form. */
  discard: () => void;
}

export function UnsavedChangesModal({
  display,
  stay,
  discard,
}: UnsavedChangesModalProps) {
  if (!display) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="unsaved-changes-title"
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4"
    >
      <div className="w-full max-w-md min-w-0 rounded-2xl bg-white p-6 dark:bg-gray-800">
        <h3
          id="unsaved-changes-title"
          className="mb-2 text-lg font-semibold dark:text-white"
        >
          Discard unsaved changes?
        </h3>
        <p className="mb-6 text-sm leading-relaxed text-pretty text-gray-600 dark:text-gray-300">
          You have changes that haven&apos;t been saved. If you leave now, they
          will be lost.
        </p>
        <div className="flex justify-end gap-3">
          <BaseButton
            type="button"
            color="outline"
            onClick={stay}
            text="Keep editing"
          />
          <BaseButton
            type="button"
            color="danger"
            onClick={discard}
            text="Discard"
          />
        </div>
      </div>
    </div>
  );
}
