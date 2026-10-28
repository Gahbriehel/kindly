import type { IBaseResponse } from "./base";
import type { Permission } from "./permission";

export type StaffRole = "OWNER" | "STAFF";

export type InviteStatus =
  | "PENDING"
  | "ACCEPTED"
  | "DECLINED"
  | "EXPIRED"
  | "REVOKED";

export interface IStaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: StaffRole;
  permissions: Permission[];
  isActive: boolean;
  createdAt: string;
}

export interface IStaffInvite {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  permissions: Permission[];
  status: InviteStatus;
  expiresAt: string;
  createdAt: string;
}

export interface IStaffListResponse extends IBaseResponse {
  data: {
    staff: IStaffMember[];
    invitations: IStaffInvite[];
  };
}
