import { IBaseResponse } from "./base";

export type UserRole = "ROLE_ADMIN" | "ROLE_STAFF" | "ROLE_USER";

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface ILoginResponse extends IBaseResponse {
  accessToken: string;
  user: IUserData;
}

export interface ISignUpPayload {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export interface ISignUpResponse extends IBaseResponse {
  data: { user: IUserData };
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
}

export interface IRefreshResponse extends IBaseResponse {
  data: {
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}
