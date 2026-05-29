import Constants from "expo-constants";
import { authBridge } from "./authBridge";

// Resolve the API base URL.
//  1. EXPO_PUBLIC_API_URL if you set it explicitly.
//  2. Otherwise derive the dev machine's host from the Expo/Metro connection so
//     a physical phone in Expo Go reaches your computer automatically (not
//     "localhost", which would mean the phone itself).
//  3. Fallback to localhost (web / simulator).
function resolveBaseUrl(): string {
  const explicit = process.env.EXPO_PUBLIC_API_URL;
  if (explicit) return explicit;

  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants as any).expoGoConfig?.debuggerHost ??
    (Constants as any).manifest2?.extra?.expoGo?.debuggerHost ??
    (Constants as any).manifest?.debuggerHost;

  if (typeof hostUri === "string" && hostUri.length > 0) {
    const host = hostUri.split(":")[0];
    if (host) return `http://${host}:4000`;
  }
  return "http://localhost:4000";
}

const BASE_URL = resolveBaseUrl();
const DEV_USER_ID = "user_demo";

type ApiOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { headers, ...rest } = options;

  // Real Clerk session → Bearer token. Expo Go mock / signed-out → x-user-id,
  // which the API trusts in dev mode (when CLERK_SECRET_KEY is unset).
  const token = await authBridge.getToken();
  const authHeaders: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : { "x-user-id": authBridge.getUserId() ?? DEV_USER_ID };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...headers,
    },
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body?.error) message = body.error;
    } catch {
      // non-JSON error body — keep the status message
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
