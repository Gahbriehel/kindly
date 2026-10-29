import { useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "./useAppSelector";
import { useAppDispatch } from "./useAppDispatch";
import { getProfile } from "../services/auth";
import { setUser } from "../store/slices/auth";
import { hasPermission } from "../helpers/permissions";
import type { Permission } from "../models/permission";

export function usePermissions() {
  const user = useAppSelector((state) => state.auth.user);
  const can = useCallback(
    (permission: Permission) => hasPermission(user, permission),
    [user],
  );
  return { can, isOwner: user?.role === "OWNER" };
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
