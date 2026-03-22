import { IBaseResponse } from "./base";

export interface ILoginPayload {
  username: string;
  password: string;
}

export interface ILoginResponse extends IBaseResponse {
  data: {
    token: string;
    refreshToken: string;
  };
}

export interface IUserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  account: {
    category: string;
    type: string;
    role: string;
  };
  password: string;
  referral: {
    code: string;
  };
  address: string;
  city: string;
  state: string;
  country: string;
  emailVerified: boolean;
  archive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  businessLogo: string;
}

export interface ISignUpResponse extends IBaseResponse {
  newUser: Array<{
    _id: string;
    businessRef: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    otp: string;
    otpExpiration: string;
    address: string;
    city: string;
    state: string;
    country: string;
    emailVerified: boolean;
    archive: boolean;
    createdAt: string;
    updatedAt: string;
    account?: {
      category: string;
      type: string;
      role: string;
    };
    __v: number;
  }>;
}
