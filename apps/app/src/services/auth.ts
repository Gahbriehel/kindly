import axios from "axios";
import type {
  ILoginResponse,
  ILoginPayload,
  ISignUpPayload,
  ISignUpResponse,
  IRefreshResponse,
  IProfileResponse,
} from "../models/auth";
import { IBaseResponse } from "../models/base";

export async function login(payload: ILoginPayload) {
  const { isOrganization, ...data } = payload;
  const endpoint = isOrganization
    ? `/auth/company/login`
    : `/auth/individual/login`;
  const response = await axios.post<ILoginResponse>(endpoint, data);
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

export async function getProfile() {
  const response = await axios.get<IProfileResponse>("/auth/me");
  return response.data;
}
