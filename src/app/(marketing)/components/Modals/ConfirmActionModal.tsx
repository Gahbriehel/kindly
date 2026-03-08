"use client";

import { BaseButton } from "../ui/button";

interface ConfirmActionModalProps {
  actionName: string;
  title?: string;
  fn: () => void;
  loading?: boolean;
  close: () => void;
  display: boolean;
}

export function ConfirmActionModal({
  actionName,
  title,
  fn,
  loading,
  close,
  display,
}: ConfirmActionModalProps) {
  if (!display) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-2 dark:text-white">
          {title || `Confirm ${actionName}`}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to proceed with this action? This cannot be
          undone.
        </p>
        <div className="flex justify-end gap-3">
          <BaseButton
            color="outline"
            onClick={close}
            disabled={loading}
            text="Cancel"
          />
          <BaseButton
            color="danger"
            onClick={fn}
            loading={loading}
            text={actionName}
          />
        </div>
      </div>
    </div>
  );
}
