"use client";

import { useCallback, useState, useSyncExternalStore, type JSX } from "react";
import {
  IoArrowForward,
  IoCheckmarkCircle,
  IoPeopleOutline,
} from "react-icons/io5";
import { clsx } from "clsx";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { useCurrentSubscriptionQuery } from "@/src/hooks/useSubscriptionQuery";
import { BaseButton } from "../UI/Buttons";
import { CenterModal } from "../UI/CenterModal";
import { UpgradeModal } from "./UpgradeModal";

const SESSION_DISMISS_KEY_PREFIX = "kindly_limit_warning_dismissed_";

const UPGRADE_BENEFITS = [
  "Unlimited client records and active projects",
  "Priority support and early access to features",
];

const dismissedKeys = new Set<string>();
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function isKeyDismissed(key: string): boolean {
  if (typeof window === "undefined") return true;
  if (dismissedKeys.has(key)) return true;
  try {
    if (sessionStorage.getItem(key) === "true") {
      dismissedKeys.add(key);
      return true;
    }
  } catch {
    // Ignore storage errors in private browsing
  }
  return false;
}

function dismissKey(key: string) {
  dismissedKeys.add(key);
  try {
    sessionStorage.setItem(key, "true");
  } catch {
    // Ignore storage errors
  }
  listeners.forEach((listener) => listener());
}

const emptySubscribe = () => () => {};

export function LimitWarningModal(): JSX.Element | null {
  const user = useAppSelector((state) => state.auth.user);
  const { data: subscriptionRes } = useCurrentSubscriptionQuery();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const clientLimit =
    subscriptionRes?.data?.client_limit ||
    subscriptionRes?.client_limit ||
    user?.client_limit;

  const dismissKeyName = clientLimit
    ? `${SESSION_DISMISS_KEY_PREFIX}${user?.id || "anon"}_${clientLimit.used}`
    : "";

  const isDismissed = useSyncExternalStore(
    subscribe,
    () => (dismissKeyName ? isKeyDismissed(dismissKeyName) : false),
    () => true,
  );

  const handleDismiss = useCallback(() => {
    if (dismissKeyName) {
      dismissKey(dismissKeyName);
    }
  }, [dismissKeyName]);

  const handleOpenUpgrade = useCallback(() => {
    handleDismiss();
    setIsUpgradeModalOpen(true);
  }, [handleDismiss]);

  // The condition requested by the user: clientLimit.percentage >= 80 is the ONLY condition
  const isLimitReachedOrNearing = Boolean(
    clientLimit &&
    typeof clientLimit.percentage === "number" &&
    clientLimit.percentage >= 80,
  );

  const showWarning = Boolean(
    isMounted && isLimitReachedOrNearing && !isDismissed,
  );

  if (!isMounted) return null;

  const isAtLimit = Boolean(clientLimit && clientLimit.percentage >= 100);
  const percentage = Math.round(clientLimit?.percentage ?? 0);

  return (
    <>
      <CenterModal
        display={showWarning}
        close={handleDismiss}
        title={
          isAtLimit
            ? "You've reached your client limit"
            : "You're nearing your client limit"
        }
        maxWidth="max-w-md"
        footer={
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <BaseButton
              type="button"
              color="outline"
              onClick={handleDismiss}
              text="Maybe later"
              className="w-full sm:w-auto"
            />
            <BaseButton
              type="button"
              color="primary"
              onClick={handleOpenUpgrade}
              icon={<IoArrowForward className="size-4" />}
              position="icon-last"
              text="Upgrade plan"
              className="w-full px-5 font-semibold sm:w-auto"
            />
          </div>
        }
      >
        {clientLimit && (
          <div className="space-y-5 p-6">
            <p className="text-sm leading-relaxed text-pretty text-gray-600 dark:text-slate-300">
              You&apos;re using{" "}
              <span className="font-semibold text-gray-900 dark:text-slate-100">
                {clientLimit.used} of {clientLimit.max} clients
              </span>{" "}
              on your current plan. Upgrade so you don&apos;t get interrupted
              when onboarding new clients.
            </p>

            {/* Client usage */}
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-slate-100">
                  <IoPeopleOutline className="size-4 text-theme-primary dark:text-indigo-400" />
                  <span>Client usage</span>
                </div>
                <span
                  className={clsx(
                    "text-sm font-semibold",
                    isAtLimit
                      ? "text-red-600 dark:text-red-400"
                      : "text-theme-primary dark:text-indigo-400",
                  )}
                >
                  {percentage}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-800">
                <div
                  className={clsx(
                    "h-full rounded-full transition-all duration-500",
                    isAtLimit ? "bg-red-500" : "bg-theme-primary",
                  )}
                  style={{
                    width: `${Math.min(100, Math.max(0, clientLimit.percentage))}%`,
                  }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-slate-400">
                <span>
                  {clientLimit.used} / {clientLimit.max} clients
                </span>
                {clientLimit.remaining !== undefined && (
                  <span>
                    {clientLimit.remaining}{" "}
                    {clientLimit.remaining === 1 ? "client" : "clients"} left
                  </span>
                )}
              </div>
            </div>

            {/* Upgrade benefits */}
            <ul className="space-y-2.5">
              {UPGRADE_BENEFITS.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-slate-300"
                >
                  <IoCheckmarkCircle className="size-4.5 shrink-0 text-emerald-500 dark:text-emerald-400" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CenterModal>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </>
  );
}
