import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { createUser, getUser, updateUser, type Role } from "../api/client";

// One page for both "new user" (/admin/users/new) and "edit user" (/admin/users/:id).
export function AdminUserEditorPage() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("user");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(!isNew);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) return;
    getUser(id)
      .then(({ user }) => {
        setName(user.name);
        setEmail(user.email);
        setRole(user.role);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (isNew) await createUser({ name, email, role, password });
      // Only send a password when the admin typed a new one.
      else await updateUser(id, { name, email, role, ...(password ? { password } : {}) });
      navigate("/admin/users");
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  if (loading) return <main className="muted">Loading…</main>;

  return (
    <main style={{ maxWidth: 560 }}>
      <p>
        <Link to="/admin/users">← Back to users</Link>
      </p>
      <div className="card">
        <h1>{isNew ? "New user" : "Edit user"}</h1>
        <form onSubmit={onSubmit}>
          <label>
            Name <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} />
          </label>
          <label>
            Email <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Role
            <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </label>
          <label>
            {isNew ? "Password (min 8 characters)" : "New password (leave blank to keep current)"}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={isNew}
              minLength={8}
              maxLength={72}
            />
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
