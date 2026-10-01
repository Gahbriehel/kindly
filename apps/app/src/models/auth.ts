import { IBaseResponse } from "./base";

export type UserRole = "admin" | "moderator";

export interface ILoginPayload {
  email: string;
  password: string;
  forceLogout?: boolean;
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
  isActive: boolean;
  phoneNumber: string | null;
  companyName: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  avatarUrl: string | null;
  subscriptionTier: string;
  createdAt: string;
  updatedAt: string;
  role?: string;
  website?: string | null;
  description?: string | null;
}

export interface IUpdateProfilePayload {
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
}

export interface IRefreshResponse extends IBaseResponse {
  data: {
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
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
  phoneNumber: string;
  address: string;
  country: string;
  logoUrl: string;
  website: string;
  description: string;
  billingAddress: string;
  registrationNumber: string;
  taxId: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankName: string;
  nextInvoiceNumber: number;
  subscriptionTier: string;
  subscriptionStartAt: string;
  subscriptionEndAt: string;
  subscriptionActive: boolean;
}
