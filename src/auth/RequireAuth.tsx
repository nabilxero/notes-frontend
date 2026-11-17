import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuth } from "./AuthContext";

// Route guard: only renders children for a logged-in user.
// (UX only - the real protection is the API checking the token.)
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
