import { clearToken, getToken } from "../auth/token";

const API_URL = import.meta.env.VITE_API_URL as string;

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

// Called when the API answers 401 to a request that carried a token
// (expired/invalid token or deleted account). The auth context registers it.
let onUnauthorized: () => void = () => {};
export function setUnauthorizedHandler(fn: () => void): void {
  onUnauthorized = fn;
}

// Single place for all HTTP calls: adds JSON headers and the Bearer token,
// and turns error responses into ApiError.
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401 && token) {
      clearToken();
      onUnauthorized();
    }
    throw new ApiError(res.status, body?.error?.code ?? "UNKNOWN", body?.error?.message ?? `Request failed (${res.status})`);
  }
  return body as T;
}

// ---- Types (mirror docs/API_CONTRACT.md) ----
export interface Health {
  status: string;
  db: "up" | "down";
}

export type Role = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ---- Endpoints ----
export const getHealth = () => apiFetch<Health>("/health");

export const register = (input: { name: string; email: string; password: string }) =>
  apiFetch<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(input) });

export const login = (input: { email: string; password: string }) =>
  apiFetch<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(input) });

export const getMe = () => apiFetch<{ user: User }>("/auth/me");

// ---- Pagination ----
export interface Page<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ---- Notes ----
export interface Note {
  id: string;
  owner: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteInput {
  title: string;
  content: string;
}

export const listNotes = (page: number, limit = 10) => apiFetch<Page<Note>>(`/notes?page=${page}&limit=${limit}`);

export const getNote = (id: string) => apiFetch<{ note: Note }>(`/notes/${encodeURIComponent(id)}`);

export const createNote = (input: NoteInput) =>
  apiFetch<{ note: Note }>("/notes", { method: "POST", body: JSON.stringify(input) });

export const updateNote = (id: string, input: NoteInput) =>
  apiFetch<{ note: Note }>(`/notes/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(input) });

export const deleteNote = (id: string) => apiFetch<void>(`/notes/${encodeURIComponent(id)}`, { method: "DELETE" });

// ---- Admin: users ----
export interface UserInput {
  name: string;
  email: string;
  role: Role;
  password?: string; // required on create; optional on update (blank = keep current)
}

export const listUsers = (page: number, limit = 10) => apiFetch<Page<User>>(`/users?page=${page}&limit=${limit}`);

export const getUser = (id: string) => apiFetch<{ user: User }>(`/users/${encodeURIComponent(id)}`);

export const createUser = (input: UserInput) =>
  apiFetch<{ user: User }>("/users", { method: "POST", body: JSON.stringify(input) });

export const updateUser = (id: string, input: Partial<UserInput>) =>
  apiFetch<{ user: User }>(`/users/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(input) });

export const deleteUser = (id: string) => apiFetch<void>(`/users/${encodeURIComponent(id)}`, { method: "DELETE" });

// ---- Admin: everyone's notes ----
// owner is populated with name + email (null if the owner no longer exists).
export interface AdminNote extends Omit<Note, "owner"> {
  owner: { id: string; name: string; email: string } | null;
}

export const listAllNotes = (page: number, limit = 10) =>
  apiFetch<Page<AdminNote>>(`/admin/notes?page=${page}&limit=${limit}`);
