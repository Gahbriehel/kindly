"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { clsx } from "clsx";
import { BaseButton } from "../UI/Buttons";

const emptySubscribe = () => () => {};

interface ConfirmActionModalProps {
  actionName: string;
  title?: string;
  message?: ReactNode;
  children?: ReactNode;
  fn: () => void;
  loading?: boolean;
  close: () => void;
  display: boolean;
  /** Use "primary" for confirmations that aren't destructive. */
  confirmColor?: "danger" | "primary";
}

export function ConfirmActionModal({
  actionName,
  title,
  message,
  children,
  fn,
  loading,
  close,
  display,
  confirmColor = "danger",
}: ConfirmActionModalProps) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!display || !isMounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-theme-surface rounded-2xl w-full max-w-md min-w-0 p-6">
        <h3 className="text-lg font-semibold mb-2 dark:text-white">
          {title || `Confirm ${actionName}`}
        </h3>
        {message ? (
          typeof message === "string" ? (
            <p
              className={clsx(
                "text-gray-600 dark:text-gray-300 text-sm leading-relaxed text-pretty break-words",
                children ? "mb-4" : "mb-6",
              )}
            >
              {message}
            </p>
          ) : (
            <div
              className={clsx(
                "text-gray-600 dark:text-gray-300 text-sm leading-relaxed text-pretty break-words",
                children ? "mb-4" : "mb-6",
              )}
            >
              {message}
            </div>
          )
        ) : !children ? (
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed text-pretty break-words">
            Are you sure you want to proceed with this action? This cannot be
            undone.
          </p>
        ) : null}
        {children}
        <div className={clsx("flex justify-end gap-3", children && "mt-6")}>
          <BaseButton
            type="button"
            color="outline"
            onClick={close}
            disabled={loading}
            text="Cancel"
          />
          <BaseButton
            type="button"
            color={confirmColor}
            onClick={fn}
            loading={loading}
            text={actionName}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
