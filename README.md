# Notes Web Client

Minimal React + TypeScript (Vite) client for the Notes API.

## Getting started
Requires Node 24 and the API running (see the `notes-backend` repo).

```bash
cp .env.example .env     # set VITE_API_URL
npm install
npm run dev              # http://localhost:5173
```

## Scripts
| Script | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Type-check and build to `dist/` |
| `npm run typecheck` | Type-check only |

## Configuration (env)
| Var | Description |
|---|---|
| `VITE_API_URL` | API base URL, e.g. `http://localhost:4000/api` |

## Deployment
Hosted on Netlify. Build settings and the single-page-app redirect are in `netlify.toml`
(build `npm run build`, publish `dist`). Set `VITE_API_URL` in the Netlify site settings to the
deployed API, e.g. `https://<api-host>/api`. It is read at build time, so redeploy after changing it.

## API
See [docs/API_CONTRACT.md](docs/API_CONTRACT.md).
