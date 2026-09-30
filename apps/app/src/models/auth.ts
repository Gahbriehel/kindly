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
    accountType?: string;
    individual: IIndividualData;
  };
}

export interface ISignUpPayload {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export interface IIndividualData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  phoneNumber: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  avatarUrl: string | null;
  subscriptionTier: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISignUpResponse extends IBaseResponse {
  data: {
    accessToken: string;
    accountType?: string;
    user: IUserData;
  };
}

export interface IProfileResponse extends IBaseResponse {
  data: {
    user: IUserData;
  };
}

export interface ICompanyProfileResponse extends IBaseResponse {
  data: {
    company: IUserData;
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

export interface IUpdateCompanyProfilePayload {
  companyName: string;
  phoneNumber: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  website: string | null;
  description: string | null;
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
