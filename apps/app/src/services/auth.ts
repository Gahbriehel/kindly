import axios from "axios";
import type {
  ILoginResponse,
  ILoginPayload,
  ISignUpPayload,
  ISignUpResponse,
  IRefreshResponse,
  IUpdatePasswordPayload,
  IUpdateIndividualProfilePayload,
  IIndividualProfileResponse,
} from "../models/auth";
import { IBaseResponse } from "../models/base";

export async function login(payload: ILoginPayload) {
  const response = await axios.post<ILoginResponse>(
    `/auth/individual/login`,
    payload,
  );
  return response.data;
}

export async function signup(payload: ISignUpPayload) {
  const response = await axios.post<ISignUpResponse>(
    `/auth/individual/signup`,
    payload,
  );
  return response.data;
}

export async function logout() {
  const response = await axios.post(`/auth/individual/logout`);
  return response.data;
}

export async function refreshTokenRequest(refreshToken: string) {
  const response = await axios.post<IRefreshResponse>(`/auth/refresh`, {
    refreshToken,
  });
  return response.data;
}

export async function forgotPassword(payload: { email: string }) {
  const response = await axios.post<IBaseResponse>(
    `/auth/forgot-password`,
    payload,
  );
  return response.data;
}

export async function changePassword(payload: IUpdatePasswordPayload) {
  const response = await axios.post<IBaseResponse>(
    `/auth/individual/reset-password`,
    payload,
  );
  return response.data;
}

export async function updateIndividualProfile(
  payload: IUpdateIndividualProfilePayload,
) {
  const response = await axios.patch<IIndividualProfileResponse>(
    `/auth/individual/me`,
    payload,
  );
  return response.data;
}
