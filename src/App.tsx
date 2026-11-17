import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { RequireAuth } from "./auth/RequireAuth";
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
          <Route
            path="/"
            element={
              <RequireAuth>
                <HomePage />
              </RequireAuth>
            }
          />
          <Route
            path="/notes"
            element={
              <RequireAuth>
                <NotesPage />
              </RequireAuth>
            }
          />
          <Route
            path="/notes/new"
            element={
              <RequireAuth>
                <NoteEditorPage />
              </RequireAuth>
            }
          />
          <Route
            path="/notes/:id"
            element={
              <RequireAuth>
                <NoteEditorPage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
