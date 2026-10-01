import axios from "axios";
import type {
  ILoginResponse,
  ILoginPayload,
  ISignUpPayload,
  ISignUpResponse,
  IRefreshResponse,
  IUpdatePasswordPayload,
  IUpdateProfilePayload,
  IProfileResponse,
} from "../models/auth";
import { IBaseResponse } from "../models/base";

export async function login(payload: ILoginPayload) {
  const response = await axios.post<ILoginResponse>(`/auth/login`, payload);
  return response.data;
}

export async function signup(payload: ISignUpPayload) {
  const response = await axios.post<ISignUpResponse>(`/auth/register`, payload);
  return response.data;
}

export async function logout() {
  const response = await axios.post(`/auth/logout`);
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
    `/auth/reset-password`,
    payload,
  );
  return response.data;
}

export async function updateIndividualProfile(payload: IUpdateProfilePayload) {
  const response = await axios.patch<IProfileResponse>(`/auth/me`, payload);
  return response.data;
}
