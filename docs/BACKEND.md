# Backend port status (PHP/MySQL to Cloudflare Pages Functions + D1)

## Cloudflare resources (account `ashe-db`, `ASHE_KV`)
- D1 `ashe-db` (EEUR), 15 tables created from `migrations/0001_init.sql`.
- KV `ASHE_KV`, bound as `KV`.
- R2: pending (enable R2 in the dashboard, then uncomment the binding).

## Ported
| Legacy module | New route | Notes |
|---|---|---|
| auth.php | `/api/auth/signin, signup, signout, session, reset-request, reset-confirm` | JWT HS256 (same format), HttpOnly cookie plus bearer token, KV rate limits |
| roles.php | `/api/roles`, `/api/roles/:id` | Last-admin protection kept |
| helpers.php | `functions/_lib/*`, `functions/api/_middleware.js` | CORS, JSON envelope, JWT, sanitizing |

## Still to port
projects, donations, pesapal (checkout and IPN), withdrawals, content, notifications, users, organizations, settings, bugs, extras (sponsors, milestones, payouts, proxy receivers), upload (R2), sitemap.

## Decisions
- Existing bcrypt password hashes keep working: they are verified with bcryptjs at sign-in and silently upgraded to PBKDF2. bcrypt at cost 12 is CPU-heavy, so the Workers Paid plan is recommended (the free plan's 10 ms CPU limit may reject legacy logins).
- Reset tokens are stored hashed (SHA-256), unlike the legacy API.
- Email is provider-pluggable (`functions/_lib/mail.js`); no provider is configured yet.
- Money columns are REAL for parity; consider integer minor units before finance reporting.

## Not yet tested
Code has not been executed against a live Pages deployment. Run `npm install && npm run cf:dev` and hit `/api/health` and `/api/auth/signup` to verify.
