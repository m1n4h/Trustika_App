import Constants from "expo-constants";

// Resolve API base URL from Expo public env or app.json extra.
const fromEnv = process.env.EXPO_PUBLIC_API_BASE_URL;
const fromExtra =
  (Constants.expoConfig?.extra as any)?.API_BASE_URL ||
  (Constants.manifest?.extra as any)?.API_BASE_URL;

export const API_BASE_URL =
  fromEnv || fromExtra || "http://localhost:4000";

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: any): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

