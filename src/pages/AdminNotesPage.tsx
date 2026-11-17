import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { listAllNotes, type AdminNote, type Page } from "../api/client";
import { Pagination } from "../components/Pagination";

const PAGE_SIZE = 10;

// Read-only view of everyone's notes (admin).
export function AdminNotesPage() {
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Number(params.get("page")) || 1);

  const [data, setData] = useState<Page<AdminNote> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    listAllNotes(page, PAGE_SIZE)
      .then(setData)
      .catch((e: Error) => setError(e.message));
  }, [page]);

  return (
    <main>
      <h1>All notes</h1>

      {error && <p role="alert">{error}</p>}
      {!data && !error && <p className="muted">Loading…</p>}
      {data && data.total === 0 && <p className="muted">No notes yet.</p>}

      {data && data.total > 0 && (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Owner</th>
              <th>Content</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((n) => (
              <tr key={n.id}>
                <td>
                  <strong>{n.title}</strong>
                </td>
                <td>{n.owner ? `${n.owner.name} (${n.owner.email})` : <span className="muted">deleted user</span>}</td>
                <td className="muted">{n.content.length > 80 ? `${n.content.slice(0, 80)}…` : n.content}</td>
                <td className="muted">{new Date(n.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {data && (
        <Pagination page={data.page} totalPages={data.totalPages} total={data.total} onChange={(p) => setParams({ page: String(p) })} />
      )}
    </main>
  );
}
