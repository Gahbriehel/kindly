import { IBaseResponse } from "./base";

export type UserRole = "admin" | "moderator";

export interface ILoginPayload {
  email: string;
  password: string;
  forceLogout?: boolean;
  isOrganization?: boolean;
}

export interface ILoginResponse extends IBaseResponse {
  // accessToken: string;
  // user: IUserData;
  data: {
    accessToken: string;
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
    individual: IIndividualData;
  };
}

export interface IProfileResponse extends IBaseResponse {
  user: IUserData;
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
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  subscriptionTier: string;
}

export interface IRefreshResponse extends IBaseResponse {
  data: {
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}
