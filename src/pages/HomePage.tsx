import { useEffect, useState } from "react";
import { getHealth, type Health } from "../api/client";
import { useAuth } from "../auth/AuthContext";

export function HomePage() {
  const { user } = useAuth();
  const [health, setHealth] = useState<Health | null>(null);

  useEffect(() => {
    getHealth().then(setHealth).catch(() => setHealth(null));
  }, []);

  return (
    <main>
      <h1>Welcome, {user!.name}</h1>
      <p>
        Signed in as {user!.email} · role: <strong>{user!.role}</strong>
      </p>
      <p>API: {health ? `${health.status} · Database: ${health.db}` : "unreachable"}</p>
    </main>
  );
}
