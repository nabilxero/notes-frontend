import { BrowserRouter, Link, Navigate, Outlet, Route, Routes } from "react-router";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { RequireAdmin } from "./auth/RequireAdmin";
import { RequireAuth } from "./auth/RequireAuth";
import { AdminNotesPage } from "./pages/AdminNotesPage";
import { AdminUserEditorPage } from "./pages/AdminUserEditorPage";
import { AdminUsersPage } from "./pages/AdminUsersPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { NoteEditorPage } from "./pages/NoteEditorPage";
import { NotesPage } from "./pages/NotesPage";
import { RegisterPage } from "./pages/RegisterPage";

function Nav() {
  const { user, logout } = useAuth();
  if (!user) return null;
  return (
    <nav>
      <Link to="/" className="brand">
        Notes
      </Link>
      <Link to="/">Home</Link>
      <Link to="/notes">My notes</Link>
      {user.role === "admin" && (
        <>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/notes">All notes</Link>
        </>
      )}
      <span className="spacer" />
      <span className="muted">{user.name}</span>
      <span className="badge">{user.role}</span>
      <button className="secondary" onClick={logout}>
        Log out
      </button>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Nav />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Logged-in users. The guard wraps every child route (rendered at <Outlet />). */}
          <Route
            element={
              <RequireAuth>
                <Outlet />
              </RequireAuth>
            }
          >
            <Route path="/" element={<HomePage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/notes/new" element={<NoteEditorPage />} />
            <Route path="/notes/:id" element={<NoteEditorPage />} />
          </Route>

          {/* Admins only. */}
          <Route
            element={
              <RequireAdmin>
                <Outlet />
              </RequireAdmin>
            }
          >
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/users/new" element={<AdminUserEditorPage />} />
            <Route path="/admin/users/:id" element={<AdminUserEditorPage />} />
            <Route path="/admin/notes" element={<AdminNotesPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
