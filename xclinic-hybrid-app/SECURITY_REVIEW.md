# Security Review and Pending Tasks

## Summary

This repository branch `improve/auth-security` has been updated with the following security-related changes:

- Centralized the API client in `src/lib/api.ts`
- Added refresh token handling and request retry queue
- Added `withCredentials: true` for cookie-based auth support
- Added `src/lib/secureStorage.ts` to wrap Capacitor Secure Storage with web fallback
- Updated `src/pages/login.tsx` and `src/pages/register.tsx` to use the centralized API client and secure token storage
- Updated `src/app/components/FileUpload.tsx` to use the centralized API client instead of hardcoded endpoints
- Added `.env.example` documenting `NEXT_PUBLIC_API_URL`
- Removed unused `axios` imports from `src/pages/login.tsx` and `src/pages/register.tsx`

## Review Notes

### Environment limitations

This environment does not have `node`, `npm`, `yarn`, or `pnpm` installed, so the following commands could not be executed here:

- `npm install`
- `npm audit`
- `npm run lint -- --max-warnings=0`
- `npm run build`

### Recommended local validation

Run these commands locally in the repository root:

```bash
npm install
npm audit
npm run lint -- --max-warnings=0
npm run build
```

If you have tests configured, also run:

```bash
npm test
```

### Security and configuration checks

- Confirm the backend supports `/users/refresh/` and issues refresh tokens securely.
- Prefer server-set `HttpOnly; Secure; SameSite` cookies for auth tokens instead of client-side storage.
- Validate `NEXT_PUBLIC_API_URL` is set properly in `.env` for development and production.
- Verify the Capacitor app uses secure storage correctly on mobile devices.
- Review any direct URL or secret exposures in source code and remove hardcoded settings.

## PR and branch

- Branch: `improve/auth-security`
- PR: https://github.com/AWTECHTHE/xclinic-hybrid-app/pull/4

## Pending manual tasks

- [ ] Execute dependency audit locally
- [ ] Run lint and build locally
- [ ] Review PR diff and backend refresh flow
- [ ] Confirm cookie-based auth and mobile secure storage behavior
