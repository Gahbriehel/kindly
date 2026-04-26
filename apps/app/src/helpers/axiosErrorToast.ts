import { customToast } from "./customToast";

export const INVALID_TOKEN_MESSAGES = [
  "Invalid or expired token. Please login again.",
  "jwt expired",
  "jwt malformed",
  "invalid token",
];
export function axiosErrorToast({
  message,
  errorCode,
}: {
  message: string;
  errorCode?: number;
}): void {
  if (INVALID_TOKEN_MESSAGES.includes(message) || errorCode === 401) return;

  customToast.error(message);
}
