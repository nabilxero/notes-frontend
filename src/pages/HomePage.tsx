import { useEffect, useState } from "react";
import { Link } from "react-router";
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
      <div className="card">
        <p>
          Signed in as {user!.email} <span className="badge">{user!.role}</span>
        </p>
        <p className="muted">API: {health ? `${health.status} · Database: ${health.db}` : "unreachable"}</p>
      </div>
      <Link to="/notes" className="button">
        Go to my notes →
      </Link>
    </main>
  );
}
