import { IBaseResponse } from "./base";

export interface ILoginPayload {
  username: string;
  password: string;
}

export interface ILoginResponse extends IBaseResponse {
  data: {
    username: string;
    token: string;
    role: string;
    firstName: string;
    lastName: string;
    refreshToken: string;
    tokenExpirationDate: number;
    refreshTokenExpirationDate: number;
  };
}

export interface ISignUpResponse extends IBaseResponse {
  data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface IUserData {
  username: string;
  role: string;
  firstName: string;
  lastName: string;
}

export interface ISignUpPayload {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

// export interface ISignUpResponse extends IBaseResponse {
//   data: {
//     id: number;
//     email: string;
//     firstName: string;
//     lastName: string;
//   };
// }

export interface IRefreshTokenResponse extends IBaseResponse {
  data: {
    token: string;
    refreshToken: string;
  };
}

// export interface IUserData {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   account: {
//     category: string;
//     type: string;
//     role: string;
//   };
//   password: string;
//   address: string;
//   city: string;
//   state: string;
//   country: string;
//   emailVerified: boolean;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
//   businessLogo: string;
// }
