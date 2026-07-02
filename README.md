# HoyeHoyeNoti

Role-based notification system for students, teaching assistants, and teachers.

- **backend-noti/** — FastAPI + Beanie (MongoDB) + JWT auth
- **frontend-noti/** — Next.js 16 (App Router) + Tailwind

## Quick start (Docker)

```bash
docker compose up
```

- Backend: http://localhost:8000 (docs at `/docs`, health at `/health`)
- Frontend: http://localhost:3000

Source is bind-mounted into both containers, so edits on your host hot-reload automatically. `docker compose down` stops the stack; dependency caches (`.venv`, `node_modules`, `.next`) persist in named volumes so the next `up` is fast. Add `-v` to wipe those too.

Both services read their config from `backend-noti/.env` and `frontend-noti/.env.local` respectively — see [Environment variables](#environment-variables) below.

## Quick start (without Docker)

**Backend** (requires [uv](https://docs.astral.sh/uv/)):

```bash
cd backend-noti
uv sync
uv run uvicorn app.main:app --reload
```

**Frontend** (requires [pnpm](https://pnpm.io/)):

```bash
cd frontend-noti
pnpm install
pnpm dev
```

## Environment variables

`backend-noti/.env`:

| Variable | Description |
| --- | --- |
| `MONGO_URI` | MongoDB connection string |
| `DB_NAME` | Database name |
| `SECRET_KEY` | JWT signing secret |
| `ALGORITHM` | JWT algorithm (`HS256`) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token lifetime |

`frontend-noti/.env.local`:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Backend base URL reachable from the browser (`http://localhost:8000` for both Docker and local dev) |

Neither file is committed — copy the variable names above to create your own.

## Roles & auth

Three fixed roles: `student`, `teaching_assistant`, `teacher`.

- `POST /api/auth/register` — public signup, always creates a `student` (role in the body is ignored)
- `POST /api/auth/login` — returns a JWT (`sub`, `role` claims)
- `GET /api/auth/me` — current user's profile
- `POST /api/auth/create-user` — teacher-only, creates `teaching_assistant` or `student` accounts

There's no public endpoint to create the *first* teacher: register normally, then flip that user's `role` to `teacher` directly in MongoDB.

A Postman collection covering the full flow (including the expected 401/403/400 cases) is at [backend-noti/postman_collection.json](backend-noti/postman_collection.json).

## Frontend auth flow

Client-side JWT stored in `localStorage`. `AuthProvider` (`frontend-noti/context/AuthContext.tsx`) hydrates the session from `/api/auth/me` on load; `AuthGuard` (`frontend-noti/components/AuthGuard.tsx`) protects `/dashboard/*` routes and can further restrict by role (e.g. `/dashboard/manage-users` is teacher-only).
