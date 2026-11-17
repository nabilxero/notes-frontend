const API_URL = import.meta.env.VITE_API_URL as string;

// Single place for all HTTP calls. Later milestones add the Bearer token
// and 401 handling here, so pages never deal with headers directly.
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(body?.error?.message ?? `Request failed (${res.status})`);
  }
  return body as T;
}

export interface Health {
  status: string;
  db: "up" | "down";
}

export const getHealth = () => apiFetch<Health>("/health");
