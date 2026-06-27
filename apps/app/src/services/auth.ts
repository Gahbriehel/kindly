import axios from "axios";
import type {
  ILoginResponse,
  ILoginPayload,
  ISignUpPayload,
  ISignUpResponse,
  IRefreshResponse,
  IUpdatePasswordPayload,
  IUpdateIndividualProfilePayload,
  IUpdateCompanyProfilePayload,
  IIndividualProfileResponse,
  ICompanyProfileResponse,
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

export async function logout(isOrganization: boolean) {
  const endpoint = isOrganization
    ? `/auth/company/logout`
    : `/auth/individual/logout`;
  const response = await axios.post(endpoint);
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
  const { isOrganization, ...data } = payload;
  const endpoint = isOrganization
    ? `/auth/company/reset-password`
    : `/auth/individual/reset-password`;
  const response = await axios.post<IBaseResponse>(endpoint, data);
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

export async function updateCompanyProfile(
  payload: IUpdateCompanyProfilePayload,
) {
  const response = await axios.patch<ICompanyProfileResponse>(
    `/auth/company/me`,
    payload,
  );
  return response.data;
}
