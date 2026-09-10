# Security Review and Pending Tasks

## Status: validated and fixed (monorepo session)

This file originated from branch `improve/auth-security` (PR #4, already merged)
and its manual pending tasks were never actually executed. This session ran
`yarn install`, `yarn audit`, `yarn lint` and `yarn build` for real and fixed
what they found.

## What was fixed in this pass

- **Build was completely broken**: `FileUpload.tsx` imported `../lib/api`
  (resolves to `src/app/lib/api.ts`, which doesn't exist) instead of
  `../../lib/api` (`src/lib/api.ts`). Also dropped its unused `axios` import.
- **Build was completely broken (2nd cause)**: `secureStorage.ts` imported a
  type `Plugins` from `@capacitor/core` that no longer exists in the
  installed Capacitor 7 version, and never used it. Removed the dead import.
- **`yarn lint` was failing**: a `// eslint-disable-next-line
  @typescript-eslint/no-var-requires` comment referenced a rule that isn't
  registered under this project's `eslint-config-next`-only config, which
  ESLint treats as an error. Removed the stale comment.
- **Login/refresh flow was broken end-to-end against the real backend**:
  - `login.tsx` posted to `/users/login/` with an `email` field; the backend
    (`app/routers/user.py`) exposes `POST /login/` and expects `username`.
    Fixed the URL, the payload field, and relabeled the form input.
  - `register.tsx` posted to `/users/register/`; the real route is
    `POST /register/`. Fixed the URL, and removed a dead branch that assumed
    `/register/` returns a token (it only returns the created user).
  - `api.ts`'s automatic refresh interceptor called `/users/refresh/` with an
    empty body and cookie credentials; the backend's real route is
    `POST /token/refresh`, authenticated via `Authorization: Bearer
    <refresh_token>` with no body. Neither `login.tsx` nor `api.ts` ever
    stored the refresh token returned at login, so refresh could never have
    worked. Added `setRefreshToken`/`getRefreshToken`/`clearRefreshToken`
    (cookie-based, mirroring the existing access-token helpers), wired login
    to persist the refresh token, and fixed the interceptor to send it as a
    Bearer header to the correct path.
- **Critical dependency vulnerabilities**: `next` was pinned to `15.1.7`,
  vulnerable to multiple CVEs including two RCEs (flight protocol RCE,
  Windows-hosted RCE) and a middleware authorization bypass. Bumped `next`
  and `eslint-config-next` to `15.5.25` (patches all of them, still on the
  15.x line, no breaking changes observed in lint/build). Bumped `axios` to
  `^1.20.0`, which pulls a patched `form-data` (was on an insecure-random
  boundary generator, `axios` is a runtime dependency here).

## Remaining pending items (need a human decision, not just code)

- [ ] `tar@<final patched version>` (critical, ReDoS/DoS) is a transitive
  dependency of `@capacitor/cli` — dev tooling used for native Android/iOS
  builds, not shipped in the web bundle. Left as-is; revisit when
  `@capacitor/cli` ships an updated `native-run`/`tar` chain.
  `yarn audit --groups dependencies` still reports ~46 high/10 moderate
  issues, almost all transitive dev tooling (Capacitor CLI, ESLint chain);
  worth a dedicated dependency-upgrade pass, but out of scope here to avoid
  bundling unrelated breaking changes into this fix.
- [ ] Decide the real auth-storage strategy. Today tokens live in a
  non-`HttpOnly` cookie (`xclinic_token` / `xclinic_refresh_token`) on web,
  or Capacitor Secure Storage on native — but the two are not kept in sync
  (`api.ts`'s refresh interceptor only reads the cookie, so a native app
  that stored tokens only in Secure Storage cannot silently refresh). Prefer
  server-set `HttpOnly; Secure; SameSite` cookies if the backend can support
  that per platform; otherwise unify the client-side storage.
- [ ] `dashboard.tsx` (`src/pages/dashboard.tsx`) is fully static/mocked —
  it doesn't call the backend `/dashboard/` endpoint at all. Real data
  wiring for the dashboard page is a separate frontend task.
- [ ] Mixed lockfiles: both `yarn.lock` and `package-lock.json` are present.
  Pick one package manager and remove the other lockfile to avoid
  resolution drift.

## Recommended local validation (already run once here)

```bash
yarn install
yarn audit
yarn lint
yarn build
```
