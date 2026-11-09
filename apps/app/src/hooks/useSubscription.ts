import { useAppSelector } from "./useAppSelector";
import type { ISubscriptionStatus } from "../models/auth";

export interface SubscriptionInfo {
  subscription: ISubscriptionStatus | null;
  /** False once the subscription has expired; gate every write control on it. */
  canWrite: boolean;
  isExpired: boolean;
  isExpiringSoon: boolean;
  daysRemaining: number;
  endAt: string | null;
  tier: string | null;
  isOwner: boolean;
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

  return {
    subscription,
    canWrite: subscription ? subscription.can_write : true,
    isExpired: subscription?.is_expired ?? false,
    isExpiringSoon: subscription?.is_expiring_soon ?? false,
    daysRemaining: subscription?.days_remaining ?? 0,
    endAt: subscription?.end_at ?? null,
    tier: subscription?.tier ?? null,
    isOwner: user?.role === "OWNER",
  };
}
