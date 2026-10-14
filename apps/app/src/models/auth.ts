import { IBaseResponse } from "./base";
import { Permission } from "./permission";

export type UserRole = "admin" | "moderator";

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface ILoginResponse extends IBaseResponse {
  data: {
    accessToken: string;
    user: IUserData;
  };
}

export interface ISignUpPayload {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;

  businessName: string;
  address: string;
  country: string;
  industry: string;
  estimatedClientCount: number;
}

export interface ISignUpResponse extends IBaseResponse {
  data: {
    accessToken: string;
    user: IUserData;
  };
}

export interface IProfileResponse extends IBaseResponse {
  data: {
    user: IUserData;
  };
}

export interface IUserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  avatarUrl: string | null;
  role?: string;
  companyId: string;
  company: ICompanyData;
  permissions?: Permission[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  staffCount: number;
  hasStaff: boolean;
  client_limit: IClientLimit;
}

export interface IClientLimit {
  used: number;
  max: number;
  percentage: number;
  remaining: number;
  is_nearing_limit: boolean;
  is_reached: boolean;
}

export interface IUpdateProfilePayload {
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  avatarUrl: string;
}

export interface IRefreshResponse extends IBaseResponse {
  data: {
    accessToken: string;
  };
}

export interface IUpdatePasswordPayload {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ICompanyData {
  id: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  businessName: string;
  industry: string;
  estimatedClientCount: number;
  phoneNumber?: string | null;
  address?: string | null;
  country?: string | null;
  logoUrl?: string | null;
  website?: string | null;
  description?: string | null;
  billingAddress?: string | null;
  registrationNumber?: string | null;
  taxId?: string | null;
  bankAccountName?: string | null;
  bankAccountNumber?: string | null;
  bankName?: string | null;
  nextInvoiceNumber?: number;
  subscriptionTier: string;
  subscriptionStartAt: string;
  subscriptionEndAt: string;
  subscriptionActive: boolean;
}

export interface IUpdateCompanyPayload {
  businessName?: string;
  industry?: string;
  estimatedClientCount?: number;
  phoneNumber?: string | null;
  address?: string | null;
  country?: string | null;
  website?: string | null;
  description?: string | null;
  billingAddress?: string | null;
  registrationNumber?: string | null;
  taxId?: string | null;
  bankAccountName?: string | null;
  bankAccountNumber?: string | null;
  bankName?: string | null;
  nextInvoiceNumber?: number;
  logoUrl?: string | null;
}

export interface ICompanyProfileResponse extends IBaseResponse {
  data: {
    company: ICompanyData;
  };
}
