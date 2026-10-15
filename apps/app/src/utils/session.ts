import { store } from "../store";
import { setToken } from "../store/slices/auth";
import { refreshTokenRequest } from "../services/auth";

const REFRESH_LOCK = "kindly-auth-refresh";

let inFlight: Promise<string> | null = null;

type AuthMessage = { type: "token"; accessToken: string } | { type: "logout" };

const channel =
  typeof window !== "undefined" && "BroadcastChannel" in window
    ? new BroadcastChannel("kindly-auth")
    : null;

export function broadcastAuth(message: AuthMessage) {
  channel?.postMessage(message);
}

// Tabs share one refresh cookie but each keeps its own in-memory access token,
// so mirror token rotations and logouts from other tabs.
export function listenToAuthBroadcast(onLogout: () => void): () => void {
  if (!channel) return () => {};
  const handler = (e: MessageEvent<AuthMessage>) => {
    if (e.data.type === "token") store.dispatch(setToken(e.data.accessToken));
    if (e.data.type === "logout") onLogout();
  };
  channel.addEventListener("message", handler);
  return () => channel.removeEventListener("message", handler);
}

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
    const before = store.getState().auth.accessToken;
    inFlight = withTabLock(async () => {
      // Another tab may have refreshed while we waited for the lock; reuse its
      // token rather than rotating again.
      const current = store.getState().auth.accessToken;
      if (current && current !== before) return current;

      const response = await refreshTokenRequest();
      const { accessToken } = response.data;
      store.dispatch(setToken(accessToken));
      broadcastAuth({ type: "token", accessToken });
      return accessToken;
    }).finally(() => {
      inFlight = null;
    });
  }
  return inFlight;
}
