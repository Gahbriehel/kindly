import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getStaff,
  inviteStaff,
  resendInvite,
  revokeInvite,
  setStaffStatus,
  updateInvitePermissions,
  updateStaffPermissions,
} from "../services/staff";
import { customToast } from "../helpers/customToast";
import type { IBaseResponse } from "../models/base";
import type { Permission } from "../models/permission";
import type { IInviteStaffPayload } from "../models/staff";

const STAFF_KEY = ["staff"];

export function useStaffQuery({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: STAFF_KEY,
    queryFn: async () => await getStaff(),
    enabled,
  });
}

/** Staff mutations all refresh the list and toast the server's message. */
function useStaffMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<IBaseResponse>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: STAFF_KEY });
      customToast.success(response.message);
    },
  });
}

export const useUpdateStaffPermissions = () =>
  useStaffMutation(
    ({ id, permissions }: { id: string; permissions: Permission[] }) =>
      updateStaffPermissions(id, permissions),
  );

export const useSetStaffStatus = () =>
  useStaffMutation(({ id, isActive }: { id: string; isActive: boolean }) =>
    setStaffStatus(id, isActive),
  );

export const useInviteStaff = () =>
  useStaffMutation((payload: IInviteStaffPayload) => inviteStaff(payload));

export const useUpdateInvitePermissions = () =>
  useStaffMutation(
    ({ id, permissions }: { id: string; permissions: Permission[] }) =>
      updateInvitePermissions(id, permissions),
  );

export const useResendInvite = () =>
  useStaffMutation((id: string) => resendInvite(id));

export const useRevokeInvite = () =>
  useStaffMutation((id: string) => revokeInvite(id));
