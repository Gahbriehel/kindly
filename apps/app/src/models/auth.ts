import { IBaseResponse } from "./base";

export type UserRole = "admin" | "moderator";

export interface ILoginPayload {
  email: string;
  password: string;
  forceLogout?: boolean;
  isOrganization?: boolean;
}

export interface ILoginResponse extends IBaseResponse {
  data: {
    accessToken: string;
    accountType: "INDIVIDUAL" | "ORGANIZATION";
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
    accountType: "INDIVIDUAL" | "ORGANIZATION";
    individual: IIndividualData;
  };
}

export interface IIndividualProfileResponse extends IBaseResponse {
  data: {
    individual: IUserData;
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
  accountType?: "INDIVIDUAL" | "ORGANIZATION";
  role?: string;
  website?: string | null;
  description?: string | null;
}

export interface IUpdateIndividualProfilePayload {
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
  isOrganization?: boolean;
}
