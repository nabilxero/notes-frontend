// The JWT lives in localStorage so it survives page reloads.
// Trade-off: any script on the page can read it, so XSS must be avoided
// (React escapes rendered text by default; we never use dangerouslySetInnerHTML).
const KEY = "notes.token";

export function getToken(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(KEY, token);
  } catch {
    // storage unavailable (e.g. private mode): session still works until reload
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
