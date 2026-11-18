import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { deleteNote, listNotes, type Note, type Page } from "../api/client";
import { Pagination } from "../components/Pagination";

const PAGE_SIZE = 10;

export function NotesPage() {
  // Page number lives in the URL (?page=2) so reload / back button keep it.
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Number(params.get("page")) || 1);

  const [data, setData] = useState<Page<Note> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setError(null);
    listNotes(page, PAGE_SIZE)
      .then((res) => {
        // Deleted the last note on a page -> step back one page.
        if (res.items.length === 0 && page > 1) setParams({ page: String(page - 1) });
        else setData(res);
      })
      .catch((e: Error) => setError(e.message));
  }, [page, setParams]);

  useEffect(load, [load]);

  async function onDelete(note: Note) {
    if (!confirm(`Delete "${note.title}"?`)) return;
    try {
      await deleteNote(note.id);
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <main>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h1>My notes</h1>
        <Link to="/notes/new" className="button">
          + New note
        </Link>
      </div>

      {error && <p role="alert">{error}</p>}
      {!data && !error && <p className="muted">Loading…</p>}
      {data && data.total === 0 && <p className="muted">No notes yet. Create your first one.</p>}

      {data?.items.map((note) => (
        <div key={note.id} className="card">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <h2 style={{ margin: 0 }}>{note.title}</h2>
            <div className="row">
              <Link to={`/notes/${note.id}`} className="button secondary">
                Edit
              </Link>
              <button className="danger" onClick={() => onDelete(note)}>
                Delete
              </button>
            </div>
          </div>
          {note.content && <p style={{ whiteSpace: "pre-wrap" }}>{note.content}</p>}
          <p className="muted" style={{ marginBottom: 0, fontSize: "0.85rem" }}>
            Updated {new Date(note.updatedAt).toLocaleString()}
          </p>
        </div>
      ))}

      {data && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          total={data.total}
          onChange={(p) => setParams({ page: String(p) })}
        />
      )}
    </main>
  );
}
