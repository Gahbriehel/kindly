import { useAppSelector } from "./useAppSelector";
import type { ISubscriptionStatus } from "../models/auth";

export const SUBSCRIPTION_LOCK_REASON =
  "Your subscription has expired. Renew to make changes.";

export interface SubscriptionInfo {
  subscription: ISubscriptionStatus | null;
  /** False once the subscription has expired; disable every write control with `writeLockReason`, never hide it. */
  canWrite: boolean;
  isExpired: boolean;
  isExpiringSoon: boolean;
  daysRemaining: number;
  endAt: string | null;
  tier: string | null;
  isOwner: boolean;
  /** Why write controls are disabled, or undefined when writes are allowed. */
  writeLockReason: string | undefined;
}

/**
 * Single source of truth for subscription state, read from the user returned
 * by /auth/me. Until the server sends a status, writes stay enabled; the 403
 * interceptor is the safety net.
 */
export function useSubscription(): SubscriptionInfo {
  const user = useAppSelector((state) => state.auth.user);
  const subscription =
    user?.subscription ?? user?.company?.subscription ?? null;

  const canWrite = subscription ? subscription.can_write : true;

  return {
    subscription,
    canWrite,
    isExpired: subscription?.is_expired ?? false,
    isExpiringSoon: subscription?.is_expiring_soon ?? false,
    daysRemaining: subscription?.days_remaining ?? 0,
    endAt: subscription?.end_at ?? null,
    tier: subscription?.tier ?? null,
    isOwner: user?.role === "OWNER",
    writeLockReason: canWrite ? undefined : SUBSCRIPTION_LOCK_REASON,
  };
}
