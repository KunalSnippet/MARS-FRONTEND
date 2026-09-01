# MARS Web — Phase 3 Implementation Plan
## Authentication, framed as the Access Manager

**Depends on:** Phase 1 (reuses the same SQLite database for user records)
**Owner note:** this is the one phase in the whole plan best done
together rather than split — session/auth logic touching both backend
and frontend tightly is a real risk area if the two sides drift out of
sync. If you truly can't pair on it, at minimum review each other's half
before merging.

---

## Why this phase exists, and why it's framed this way

Don't build "generic login because professional apps have it." Your
project's own architecture diagram — from the very first proposal — has
always included a **Security / Access Manager** module: access control,
privilege groups, user confirmation before destructive operations. It was
never actually built. This phase is that module, finally implemented —
a much stronger story for an evaluator than generic auth bolted on at the
end.

Keep scope deliberately small: two roles, session-based auth, no OAuth/
SSO. This is a demonstration of the *concept* of an access-controlled
kernel boundary, not a production auth system.

---

## 3.1 — Data model

**File:** extend Phase 1's SQLite database

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password_hash TEXT,
  role TEXT  -- 'viewer' | 'operator'
);
```

Two roles only:
- **viewer** — can see every dashboard page, read-only.
- **operator** — everything a viewer can do, plus submit tasks and any
  future agent-control actions (spawn/kill).

This directly mirrors the original architecture's "user confirmation
before irreversible/destructive operations" idea — operator-only actions
ARE the destructive/state-changing ones.

---

## 3.2 — Backend: auth endpoints and session handling

**New file:** `api/routes/auth.py`

1. Password hashing: use `passlib` (bcrypt) or Python's `hashlib` with a
   proper salt — do not store plaintext passwords, even for a class
   project.
2. Endpoints:
   ```
   POST /auth/register   -> {username, password, role}  (or seed 2 users manually if you don't need public registration)
   POST /auth/login       -> sets a session cookie, returns {username, role}
   POST /auth/logout      -> clears the session
   GET  /auth/me          -> returns current session's user info, or 401
   ```
3. Session mechanism: a signed HTTP-only cookie is simplest (Starlette's
   `SessionMiddleware` works well with FastAPI) — avoids needing to
   manage token storage/refresh on the frontend. JWT is also fine if
   you're more comfortable with it; don't over-engineer this choice.
4. **Actually test logout invalidates the session server-side** — a
   common bug is the frontend "forgetting" the token while the backend
   would still accept it if replayed.

---

## 3.3 — Backend: protect the right endpoints

1. Add a dependency (FastAPI `Depends()`) that reads the current session
   and raises 401 if not authenticated, 403 if authenticated but wrong
   role.
2. Apply it:
   - `POST /tasks` → requires `operator` role.
   - Any future agent-control endpoints (spawn/kill/pause) → `operator`.
   - All `GET` endpoints (tasks, agents, dashboard, metrics, history) →
     require authentication (any role), but not operator specifically.
3. Leave `/health` unauthenticated — useful for uptime checks without
   needing credentials.

---

## 3.4 — Frontend: login flow and role-aware UI

**New files:** `MARS-FE/src/pages/LoginPage.tsx`,
`MARS-FE/src/hooks/useAuth.ts`

1. Login page: username/password form, posts to `/auth/login`, redirects
   to the app shell on success.
2. `useAuth.ts`: a hook/context providing current user + role app-wide,
   backed by `GET /auth/me` on load.
3. Route guard: redirect to `/login` if `useAuth()` shows no active
   session.
4. Role-aware UI: disable/hide the "Run Task" button and any future
   agent-control buttons for `viewer`-role users — don't just rely on the
   backend rejecting the request; the UI should make it clear upfront
   what a viewer can and can't do.
5. Add a logout action (e.g. in the sidebar) that calls `/auth/logout`
   and clears local auth state.

---

## 3.5 — Seed test accounts

Rather than building a public registration flow (unnecessary for a class
project), seed two accounts directly in the database at startup or via a
small script:
```
viewer / <password>   -> role: viewer
operator / <password> -> role: operator
```
This is enough to demonstrate the role distinction clearly without extra
scope.

---

## Definition of Done

- [ ] Passwords are hashed, never stored/logged in plaintext
- [ ] A viewer-role user can see every page but cannot submit a task (verified via both UI and a direct API call, to confirm the backend actually enforces it, not just the frontend hiding a button)
- [ ] An operator-role user can do both
- [ ] Logging out actually invalidates the session server-side (test by replaying the old session token/cookie after logout)
- [ ] `/health` remains accessible without authentication
