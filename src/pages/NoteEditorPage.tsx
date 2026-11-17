import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { createNote, getNote, updateNote } from "../api/client";

// One page for both "new note" (/notes/new) and "edit note" (/notes/:id).
export function NoteEditorPage() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(!isNew);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) return;
    getNote(id)
      .then(({ note }) => {
        setTitle(note.title);
        setContent(note.content);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (isNew) await createNote({ title, content });
      else await updateNote(id, { title, content });
      navigate("/notes");
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  if (loading) return <main className="muted">Loading…</main>;

  return (
    <main style={{ maxWidth: 720 }}>
      <p>
        <Link to="/notes">← Back to notes</Link>
      </p>
      <div className="card">
        <h1>{isNew ? "New note" : "Edit note"}</h1>
        <form onSubmit={onSubmit}>
          <label>
            Title <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200} />
          </label>
          <label>
            Content <textarea value={content} onChange={(e) => setContent(e.target.value)} maxLength={10000} />
          </label>
          {error && <p role="alert">{error}</p>}
          <button type="submit" disabled={busy}>
            {busy ? "Saving…" : "Save"}
          </button>
        </form>
      </div>
    </main>
  );
}
