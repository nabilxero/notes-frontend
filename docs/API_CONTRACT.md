# API Contract (identical in both repos; backend is source of truth)

Base URL: `http://localhost:4000/api` locally. JSON everywhere.
Auth: `Authorization: Bearer <jwt>` on all endpoints except those marked **public**.

## Conventions
**Paginated list response**
```json
{ "items": [ ... ], "page": 1, "limit": 20, "total": 134, "totalPages": 7 }
```
Query: `?page=1&limit=20` (defaults 1 / 20, max limit 100).

**Error response**
```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Human readable", "details": [] } }
```
Status codes: 400 validation, 401 unauthenticated, 403 forbidden, 404 not found, 409 conflict, 500 server.

**Roles:** `user`, `admin`.

## Endpoints
Planned endpoints are filled in per milestone. Mark each as implemented when done.

### M0
- `GET /health` (**public**) -> `{ "status": "ok", "db": "up" | "down" }`   [x]

### M1 — Auth
**User object** (never contains the password hash)
```json
{ "id": "…", "name": "Alice", "email": "alice@example.com", "role": "user", "createdAt": "…", "updatedAt": "…" }
```

- `POST /auth/register` (**public**)   [x]
  Body `{ "name": 1-100 chars, "email": valid, "password": 8-72 chars }`. Role is always `user`.
  -> `201 { "token": "<jwt>", "user": User }` · 400 `VALIDATION_ERROR` · 409 `EMAIL_TAKEN`
- `POST /auth/login` (**public**)   [x]
  Body `{ "email", "password" }` -> `200 { "token", "user" }` · 401 `INVALID_CREDENTIALS` (same for unknown email and wrong password)
- `GET /auth/me`   [x]
  -> `200 { "user": User }` · 401 `UNAUTHENTICATED` (missing/invalid/expired token, or account deleted)

JWT: HS256, `sub` = user id, `role` claim, expires per `JWT_EXPIRES_IN` (default 1 day).

### M2 — Notes (own notes)
**Note object**
```json
{ "id": "…", "owner": "<userId>", "title": "…", "content": "…", "createdAt": "…", "updatedAt": "…" }
```
**Note input:** `{ "title": 1-200 chars (trimmed), "content": 0-10000 chars (optional, default "") }`

All endpoints require auth and only ever touch the caller's own notes. Someone else's note,
or a malformed id, returns `404 NOT_FOUND` (never 403, so ids can't be probed).

- `POST /notes` -> `201 { "note": Note }` · 400   [x]
- `GET /notes?page&limit` -> `200 Page<Note>`, newest first · 400 on bad page/limit   [x]
- `GET /notes/:id` -> `200 { "note": Note }` · 404   [x]
- `PUT /notes/:id` (full replace of title + content) -> `200 { "note": Note }` · 400 · 404   [x]
- `DELETE /notes/:id` -> `204` · 404   [x]

### M3 (planned)
- `GET/POST /users`, `GET/PUT/DELETE /users/:id` (admin), `GET /admin/notes` (admin, paginated)

### M4 (planned)
- `POST /posts`, `GET /posts` (public, paginated), `GET /users/:id/posts` (aggregation with `$lookup`)

### M5 (planned)
- `PUT /auth/me` or `/users/me` (edit interests), `GET /users/by-interests` (single `aggregate()`)
