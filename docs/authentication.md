# Authentication

Simple username + password authentication using MongoDB and HttpOnly cookies. No email, no OAuth. The app keeps the last logged-in user authenticated via a long-lived session cookie until explicit logout.

## Goals

- Username + password only (no email)
- Store user credentials in MongoDB using bcrypt hashes
- Long-lived session cookie to keep the last user logged in
- Explicit Logout button to switch users
- Strict per-user data isolation for all activities and entries

## Non-Goals

- OAuth or third-party identity providers
- Email verification, password reset via email
- JWT access/refresh token infrastructure

## User Flow

- New user? Go to Register page
- Existing user? Go to Login page
- After successful login, redirect to Calendar (/)
- Last logged-in user stays logged in until explicit logout

## Data Model

- Collection: `users`
  - Fields: `_id`, `username` (unique, lowercase for uniqueness), `passwordHash`, `createdAt`, `updatedAt`
  - Normalize `username` to lowercase on write for uniqueness; preserve original casing if you wish to display it

- Collection: `sessions`
  - Fields: `_id` (random token), `userId`, `createdAt`, `expiresAt`, `ip`, `userAgent`
  - TTL index on `expiresAt` for automatic cleanup

- Existing collections: `activities`, `entries`
  - Add and require `userId` on every document
  - All queries must filter by `{ userId }`

## Indexes

Add/update in `server/plugins/init-indexes.ts`:

- `users.username` unique
- `sessions.expiresAt` TTL
- `activities`: recommended `{ userId, name }` (uniqueness per user optional)
- `entries`: recommended `{ userId, date }`

## Runtime Config

Add to `nuxt.config.ts` runtime config:

- `auth.cookieName = 'sid'`
- `auth.sessionDays = 365` (or suitable long duration)
- `auth.secureCookies = process.env.NODE_ENV === 'production'`

## Auth Utilities (`server/utils/auth.ts`)

- `hashPassword(plain: string): Promise<string>` — bcrypt hash
- `verifyPassword(plain: string, hash: string): Promise<boolean>`
- `createSession(event, userId)` — insert into `sessions`, set HttpOnly cookie (`sid`) with:
  - `Max-Age = sessionDays * 24 * 3600`
  - `HttpOnly`, `SameSite=Lax`, `Secure` when in production
- `destroySession(event)` — delete current session record and clear cookie
- `getUserFromSession(event)` — read cookie → load session & user → validate expiry
- `requireUser(event)` — 401 if not authenticated; returns `{ userId, user }` on success

## API Endpoints

- `POST /api/auth/register`
  - Body: `{ username, password }`
  - Validate username (3–32 chars, `[a-z0-9-_]`, case-insensitive unique)
  - Validate password (min 8 chars)
  - Create user, hash password
  - Option: auto-login by creating a session on success

- `POST /api/auth/login`
  - Body: `{ username, password }`
  - Verify credentials; create session and set cookie
  - Response: minimal user profile `{ username }`

- `POST /api/auth/logout`
  - Destroy session and clear cookie

- `GET /api/auth/me`
  - Return `{ username }` if session valid; otherwise 401

## Securing Existing APIs

Update all endpoints to enforce per-user scoping:

- In `server/api/activities.*.ts` and `server/api/entries.*.ts`:
  - `const { userId } = await requireUser(event)` at the top of each handler
  - On create/insert: set `userId`
  - On read/update/delete: filter queries by `{ userId }`

If `server/api/users.get.ts` was for the previous single-user setup, consider replacing it with `auth/me` or making it admin-only later.

## Frontend Integration (Nuxt)

- Composable: `app/composables/useAuth.js`
  - State: `user`, `status`, `error`
  - Methods: `register({ username, password })`, `login({ username, password })`, `logout()`, `fetchMe()`
  - Call `fetchMe()` on app start to hydrate session from cookie (auto-login last user)

- Pages
  - `app/pages/register.vue` — new user registration form
  - `app/pages/login.vue` — username + password form
  - Flow: New user → Register page; existing user → Login; after successful login redirect to calendar (`/`)

- Route Protection
  - Add `app/middleware/auth.global.ts`:
    - Redirect unauthenticated users to `/login` for protected routes (e.g., `/`)
    - Allow public routes: `/login`, `/register`, `/about`

- UI
  - Update `app/components/ToolsMenu.vue` to display current `username` and a Logout button

## Session Behavior

- HttpOnly cookie-based session; no tokens stored in localStorage
- Long-lived cookie (e.g., 365 days) keeps the last user logged in until explicit logout or TTL expiry
- Optional: sliding expiration (extend `expiresAt` on activity) for better UX

## Validation Rules

- Username: 3–32 characters; allowed `a–z`, `0–9`, `-`, `_` (store normalized lowercase for uniqueness)
- Password: minimum 8 characters

## Migration (Single-user → Multi-user)

1. Register your user via the `register` endpoint
2. Backfill existing `activities` and `entries` with that user’s `_id` as `userId`
3. Add the indexes listed above

## Testing

- New tests: `tests/api.auth.test.js`
  - Register → Login → Me → Logout happy paths
  - Invalid credentials produce 401
  - Session persists via cookie across requests
- Update existing tests to authenticate first and to assert user scoping
- Isolation test: two users cannot see or modify each other’s data

## Acceptance Criteria

- Users can register and log in with username + password (no email)
- The last logged-in user stays authenticated across restarts until logout
- Logout clears session and `GET /api/auth/me` returns 401 afterward
- All activities and entries CRUD require auth and are isolated by `userId`
- Unique usernames enforced at write; sessions expire by TTL

## Future Enhancements (Optional)

- Login rate limiting and account lockout after repeated failures
- Change password and change username flows
- Logout-all-sessions endpoint
- Admin tools (list users, disable, delete)
