import axios from "axios";
import type { IBaseResponse } from "../models/base";
import type { Permission } from "../models/permission";
import type { IInviteStaffPayload, IStaffListResponse } from "../models/staff";

export async function getStaff(): Promise<IStaffListResponse> {
  const response = await axios.get<IStaffListResponse>("/staff");
  return response.data;
}

export async function updateStaffPermissions(
  id: string,
  permissions: Permission[],
): Promise<IBaseResponse> {
  const response = await axios.patch<IBaseResponse>(
    `/staff/${id}/permissions`,
    { permissions },
  );
  return response.data;
}

export async function setStaffStatus(
  id: string,
  isActive: boolean,
): Promise<IBaseResponse> {
  const response = await axios.patch<IBaseResponse>(`/staff/${id}/status`, {
    isActive,
  });
  return response.data;
}

export async function inviteStaff(
  payload: IInviteStaffPayload,
): Promise<IBaseResponse> {
  const response = await axios.post<IBaseResponse>(
    "/staff/invitations",
    payload,
  );
  return response.data;
}

export async function updateInvitePermissions(
  id: string,
  permissions: Permission[],
): Promise<IBaseResponse> {
  const response = await axios.patch<IBaseResponse>(
    `/staff/invitations/${id}`,
    { permissions },
  );
  return response.data;
}

export async function resendInvite(id: string): Promise<IBaseResponse> {
  const response = await axios.post<IBaseResponse>(
    `/staff/invitations/${id}/resend`,
  );
  return response.data;
}

export async function revokeInvite(id: string): Promise<IBaseResponse> {
  const response = await axios.delete<IBaseResponse>(
    `/staff/invitations/${id}`,
  );
  return response.data;
}
