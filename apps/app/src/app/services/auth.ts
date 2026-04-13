import axios from "axios";
import type {
  ILoginResponse,
  ILoginPayload,
  IRefreshTokenResponse,
} from "../models/auth";

export async function login(payload: ILoginPayload) {
  const response = await axios.post<ILoginResponse>(`/login`, payload);
  return response.data;
}

export async function logout() {
  const response = await axios.post(`/logout`);
  return response.data;
}

export async function refreshTokenRequest(refreshToken: string) {
  const response = await axios.post<IRefreshTokenResponse>(`/refresh`, {
    refreshToken,
  });
  return response.data;
}

// export async function forgotPassword(payload: { email: string }) {
//   const response = await axios.post<IBaseResponse>(
//     `auth/password/reset/business`,
//     payload,
//   );
//   return response.data;
// }
