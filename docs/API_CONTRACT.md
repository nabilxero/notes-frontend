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

### M1 (planned)
- `POST /auth/register` (public), `POST /auth/login` (public), `GET /auth/me`

### M2 (planned)
- `POST /notes`, `GET /notes` (own, paginated), `GET /notes/:id`, `PUT /notes/:id`, `DELETE /notes/:id`

### M3 (planned)
- `GET/POST /users`, `GET/PUT/DELETE /users/:id` (admin), `GET /admin/notes` (admin, paginated)

### M4 (planned)
- `POST /posts`, `GET /posts` (public, paginated), `GET /users/:id/posts` (aggregation with `$lookup`)

### M5 (planned)
- `PUT /auth/me` or `/users/me` (edit interests), `GET /users/by-interests` (single `aggregate()`)
