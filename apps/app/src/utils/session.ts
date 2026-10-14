import { store } from "../store";
import { setToken } from "../store/slices/auth";
import { refreshTokenRequest } from "../services/auth";

const REFRESH_LOCK = "kindly-auth-refresh";

let inFlight: Promise<string> | null = null;

// A refresh rotates the cookie, and the backend treats a replayed cookie as
// token reuse and revokes every session. Serialize refreshes within this tab
// (shared promise) and across tabs (Web Locks) so the old cookie is never sent
// twice.
async function withTabLock<T>(fn: () => Promise<T>): Promise<T> {
  if (typeof navigator !== "undefined" && navigator.locks) {
    return await navigator.locks.request(REFRESH_LOCK, fn);
  }
  return fn();
}

export function refreshAccessToken(): Promise<string> {
  if (!inFlight) {
    inFlight = withTabLock(async () => {
      const response = await refreshTokenRequest();
      const { accessToken } = response.data;
      store.dispatch(setToken(accessToken));
      return accessToken;
    }).finally(() => {
      inFlight = null;
    });
  }
  return inFlight;
}
