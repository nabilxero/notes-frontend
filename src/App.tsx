import { useEffect, useState } from "react";
import { getHealth, type Health } from "./api/client";

export default function App() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHealth().then(setHealth).catch((e: Error) => setError(e.message));
  }, []);

  return (
    <main>
      <h1>Notes</h1>
      <h2>API status</h2>
      {error && <p>Cannot reach API: {error}</p>}
      {health && (
        <p>
          API: {health.status} · Database: {health.db}
        </p>
      )}
      {!health && !error && <p>Checking…</p>}
    </main>
  );
}
