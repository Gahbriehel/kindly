"use client";

import { useState, type JSX } from "react";
import { FiAlertTriangle, FiClock, FiX } from "react-icons/fi";
import { useSubscription } from "@/src/hooks/useSubscription";
import { useAppDispatch } from "@/src/hooks/useAppDispatch";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { closeExpiredModal } from "@/src/store/slices/subscription";
import { BaseButton } from "./Buttons";
import { CenterModal } from "./CenterModal";
import { UpgradeModal } from "../Modals/UpgradeModal";

const EXPIRED_MESSAGE =
  "Your subscription has expired. You can still view your data, but creating, editing, deleting and sending are turned off.";

/**
 * Persistent expired banner (read-only mode) or a dismissible expiring-soon
 * warning, plus the modal the 403 interceptor opens when the cached status
 * was stale. Mounted once in the app layout.
 */
export function SubscriptionBanner(): JSX.Element | null {
  const dispatch = useAppDispatch();
  const modalOpen = useAppSelector(
    (state) => state.subscriptionUi.expiredModalOpen,
  );
  const { canWrite, isExpiringSoon, daysRemaining, isOwner } =
    useSubscription();
  const [renewOpen, setRenewOpen] = useState(false);
  const [warningDismissed, setWarningDismissed] = useState(false);

  const renewCta = isOwner ? (
    <BaseButton
      color="white"
      text="Renew"
      className="h-8 shrink-0 px-3 text-xs"
      onClick={() => {
        dispatch(closeExpiredModal());
        setRenewOpen(true);
      }}
    />
  ) : null;
  const staffNote = !isOwner ? "Ask your business owner to renew." : null;

  return (
    <>
      {!canWrite && (
        <div
          role="alert"
          className="flex flex-wrap items-center gap-3 border-b border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200 sm:px-6"
        >
          <FiAlertTriangle className="size-4 shrink-0" />
          <p className="min-w-0 flex-1">
            <span className="font-semibold">
              Your subscription has expired.
            </span>{" "}
            Your account is read-only.{staffNote && ` ${staffNote}`}
          </p>
          {renewCta}
        </div>
      )}

      {canWrite && isExpiringSoon && !warningDismissed && (
        <div
          role="status"
          className="flex items-center gap-3 border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200 sm:px-6"
        >
          <FiClock className="size-4 shrink-0" />
          <p className="min-w-0 flex-1">
            Your subscription ends in {daysRemaining}{" "}
            {daysRemaining === 1 ? "day" : "days"}.
            {staffNote && ` ${staffNote}`}
          </p>
          {renewCta}
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => setWarningDismissed(true)}
            className="cursor-pointer rounded-full p-1 hover:bg-amber-100 dark:hover:bg-amber-900/40"
          >
            <FiX className="size-4" />
          </button>
        </div>
      )}

      <CenterModal
        display={modalOpen}
        close={() => dispatch(closeExpiredModal())}
        title="Subscription expired"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-slate-300">
            {EXPIRED_MESSAGE} {staffNote}
          </p>
          <div className="flex justify-end gap-2">
            <BaseButton
              color="outline"
              text="Close"
              onClick={() => dispatch(closeExpiredModal())}
            />
            {isOwner && (
              <BaseButton
                text="Renew"
                onClick={() => {
                  dispatch(closeExpiredModal());
                  setRenewOpen(true);
                }}
              />
            )}
          </div>
        </div>
      </CenterModal>

      <UpgradeModal isOpen={renewOpen} onClose={() => setRenewOpen(false)} />
    </>
  );
}
