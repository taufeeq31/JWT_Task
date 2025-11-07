## How to Scale this - Notes

### Frontend scaling

- Move API services into separate modules under `src/api/` (per-resource files: auth, user, tasks) and export typed functions.
- Use global state via React Query (preferred for server cache + mutations) or Zustand (light client state) to eliminate prop drilling and centralize async states.
- Apply component-level code splitting and lazy loading (e.g., React.lazy + Suspense, route-based chunks) to reduce initial bundle size.
- Use env-based config for dev/staging/prod (Vite `import.meta.env`), including base API URL, feature flags, and logging levels.

### Backend scaling

- Adopt a feature-based folder structure (group by domain: `auth/`, `user/`, `tasks/` with controllers, services, validators, routes under each) to keep code cohesive.
- Introduce a services layer between controllers and DB models to isolate business logic, enable reuse, and simplify testing.
- Use DTOs + a validation library (Zod or Joi) for request bodies/params; centralize a `validate` middleware for predictable 400s.
- Implement refresh + access tokens (short-lived access, long-lived refresh, rotation + revocation) for large user loads and better security posture.
- Externalize file storage (if added) to S3/GCS with presigned URLs; keep app servers stateless.

### Database scaling

- Create indexes for common queries and uniqueness: `users.email` (unique), `tasks.userId`, and any sort fields used in lists.
- Implement pagination (cursor or page/limit) for large task lists; avoid returning unbounded arrays.

### Security

- Prefer HTTP-only cookies (SameSite=Lax/Strict, Secure in prod) or enforce a secure JWT storage strategy with CSRF mitigations.
- Add rate limiting (per IP and per user) and request size limits to prevent abuse and resource exhaustion.
- Use Helmet middleware to set secure headers and disable x-powered-by; log and monitor auth failures and suspicious activity.

