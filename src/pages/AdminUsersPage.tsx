import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { deleteUser, listUsers, type Page, type User } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { Pagination } from "../components/Pagination";

const PAGE_SIZE = 10;

export function AdminUsersPage() {
  const { user: me } = useAuth();
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Number(params.get("page")) || 1);

  const [data, setData] = useState<Page<User> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setError(null);
    listUsers(page, PAGE_SIZE)
      .then((res) => {
        if (res.items.length === 0 && page > 1) setParams({ page: String(page - 1) });
        else setData(res);
      })
      .catch((e: Error) => setError(e.message));
  }, [page, setParams]);

  useEffect(load, [load]);

  async function onDelete(user: User) {
    if (!confirm(`Delete ${user.email} and all of their notes?`)) return;
    try {
      await deleteUser(user.id);
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <main>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h1>Users</h1>
        <Link to="/admin/users/new" className="button">
          + New user
        </Link>
      </div>

      {error && <p role="alert">{error}</p>}
      {!data && !error && <p className="muted">Loading…</p>}

      {data && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {data.items.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className="badge">{u.role}</span>
                </td>
                <td className="muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="row" style={{ justifyContent: "flex-end" }}>
                    <Link to={`/admin/users/${u.id}`} className="button secondary">
                      Edit
                    </Link>
                    {/* The API also refuses self-deletion; hiding the button is just UX. */}
                    {u.id !== me?.id && (
                      <button className="danger" onClick={() => onDelete(u)}>
                        Delete
                      </button>
                    )}
                  </div>
                </td>
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
