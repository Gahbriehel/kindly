"use client";

import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
  type JSX,
} from "react";
import { FiAlertTriangle, FiArrowRight, FiCheck, FiX } from "react-icons/fi";
import { useAppSelector } from "@/src/hooks/useAppSelector";
import { useCurrentSubscriptionQuery } from "@/src/hooks/useSubscriptionQuery";
import { BaseButton } from "../UI/Buttons";
import { UpgradeModal } from "./UpgradeModal";

const SESSION_DISMISS_KEY_PREFIX = "kindly_limit_warning_dismissed_";

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

  // Lock body scroll and handle Escape key when open
  useEffect(() => {
    if (!showWarning) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleDismiss();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showWarning, handleDismiss]);

  if (!isMounted) return null;

  return (
    <>
      {showWarning && clientLimit && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="limit-warning-title"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 backdrop-blur-xs p-4 sm:p-6"
          onClick={handleDismiss}
        >
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-theme-surface border border-gray-100 dark:border-slate-800 shadow-2xl p-6 sm:p-8 text-left transition-all animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-theme-primary" />

            {/* Close button */}
            <button
              onClick={handleDismiss}
              type="button"
              aria-label="Close modal"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-gray-700 dark:text-slate-500 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <FiX className="size-4" />
            </button>

            {/* Header with icon */}
            <div className="flex items-start gap-4 mb-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <FiAlertTriangle className="size-6" />
              </div>
              <div>
                <span className="inline-block rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-1">
                  Limit Notice
                </span>
                <h2
                  id="limit-warning-title"
                  className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-slate-100 font-geist"
                >
                  You&apos;ve reached {Math.round(clientLimit.percentage)}% of
                  your limit
                </h2>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed mb-5">
              You are currently using{" "}
              <strong className="text-gray-900 dark:text-white">
                {clientLimit.used} of {clientLimit.max} clients
              </strong>
              . Upgrade to a higher subscription plan now so you don&apos;t get
              interrupted when onboarding new clients.
            </p>

            {/* Capacity Progress Card */}
            <div className="rounded-2xl bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800/80 p-4 mb-5">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-slate-300 mb-2">
                <span>Client Usage</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {Math.round(clientLimit.percentage)}% used
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.max(0, clientLimit.percentage))}%`,
                  }}
                />
              </div>

              <div className="mt-2.5 flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-400">
                <span>
                  {clientLimit.used} / {clientLimit.max} clients
                </span>
                <span className="font-medium text-gray-700 dark:text-slate-300">
                  {clientLimit.remaining !== undefined
                    ? `${clientLimit.remaining} ${clientLimit.remaining === 1 ? "client" : "clients"} remaining`
                    : null}
                </span>
              </div>
            </div>

            {/* Why upgrade highlights */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-300">
                <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <FiCheck className="size-2.5" />
                </div>
                <span>Unlimited client records and active projects</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-300">
                <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <FiCheck className="size-2.5" />
                </div>
                <span>Team collaboration, staff seats, and roles</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-300">
                <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <FiCheck className="size-2.5" />
                </div>
                <span>Priority support and early access to features</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
              <BaseButton
                type="button"
                color="outline"
                className="w-full sm:w-auto text-xs py-2 px-4 cursor-pointer"
                onClick={handleDismiss}
              >
                Maybe Later
              </BaseButton>

              <BaseButton
                type="button"
                color="gradient"
                className="w-full sm:w-auto text-xs py-2 px-4 cursor-pointer flex items-center justify-center gap-1.5"
                onClick={handleOpenUpgrade}
              >
                <span>Upgrade Plan</span>
                <FiArrowRight className="size-3.5" />
              </BaseButton>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </>
  );
}
