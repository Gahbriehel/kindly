import type { AxiosError } from "axios";
import { customToast } from "./customToast";

export const INVALID_TOKEN_MESSAGES = [
  "Invalid or expired token. Please login again.",
  "jwt expired",
  "jwt malformed",
  "invalid token",
];

const ACTIVE_SESSION_MESSAGE =
  "You already have an active session on another device.";

function isSilenced(message: string, errorCode?: number): boolean {
  return (
    INVALID_TOKEN_MESSAGES.includes(message) ||
    errorCode === 401 ||
    message === ACTIVE_SESSION_MESSAGE
  );
}

export function axiosErrorToast({
  message,
  errorCode,
}: {
  message: string;
  errorCode?: number;
}): void {
  if (isSilenced(message, errorCode)) return;

  customToast.error(message);
}

/**
 * For mutation onError handlers. The global axios interceptor already toasts
 * most failures, so this only toasts the ones it stays silent on (e.g. a 401
 * from login, or a response with no message), avoiding duplicate toasts.
 */
export function toastUnhandledError(
  error: AxiosError<{ message?: string; errors?: string[] }>,
  fallback: string,
): void {
  const response = error.response;
  // Network failures get the interceptor's "No response from server" toast.
  if (!response) return;

  const message = response.data?.message ?? "";
  const hasDetail = !!message || !!response.data?.errors?.length;

  // The interceptor shows the expired-subscription modal for these instead.
  const code = (response.data as { meta?: { code?: string } })?.meta?.code;
  if (response.status === 403 && code === "SUBSCRIPTION_EXPIRED") return;

  if (hasDetail && !isSilenced(message, response.status)) return;
  if (INVALID_TOKEN_MESSAGES.includes(message)) return;
  if (message === ACTIVE_SESSION_MESSAGE) return;

  customToast.error(message || fallback);
}
