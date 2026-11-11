import { useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "./useAppSelector";
import { useAppDispatch } from "./useAppDispatch";
import { getProfile } from "../services/auth";
import { setUser } from "../store/slices/auth";
import { SUBSCRIPTION_LOCK_REASON, useSubscription } from "./useSubscription";
import { hasPermission } from "../helpers/permissions";
import type { Permission } from "../models/permission";

export function usePermissions() {
  const user = useAppSelector((state) => state.auth.user);
  const { canWrite } = useSubscription();
  const can = useCallback(
    (permission: Permission) => hasPermission(user, permission),
    [user],
  );
  /**
   * Why `permission` is unavailable, or undefined when it's allowed. Controls
   * are never hidden for this: pass the result to `disabledReason`.
   */
  const reasonFor = useCallback(
    (permission: Permission): string | undefined => {
      if (!hasPermission(user, permission)) {
        return "You don't have permission to do this. Ask your business owner for access.";
      }
      if (!canWrite && !permission.endsWith("_VIEW")) {
        return SUBSCRIPTION_LOCK_REASON;
      }
      return undefined;
    },
    [user, canWrite],
  );
  return { can, reasonFor, isOwner: user?.role === "OWNER" };
}

/**
 * Keeps the signed-in user's role and permissions current, so changes an
 * owner makes show up on the next window focus instead of the next login.
 */
export function useProfileSync() {
  const dispatch = useAppDispatch();
  const hasUser = useAppSelector((state) => !!state.auth.user);
  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: hasUser,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (data?.data?.user) dispatch(setUser(data.data.user));
  }, [data, dispatch]);
}
