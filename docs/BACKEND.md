# Backend port status (PHP/MySQL to Cloudflare Pages Functions + D1)

## Cloudflare resources
- D1 `ashe-db` (EEUR), 15 tables from `migrations/0001_init.sql`.
- KV `ASHE_KV`, bound as `KV`.
- R2: pending (enable R2 in the dashboard, then uncomment the binding in `wrangler.toml`).

## Ported
| Legacy module | New route | Notes |
|---|---|---|
| auth.php | `/api/auth/signin, signup, signout, session, reset-request, reset-confirm` | JWT HS256 (same format), HttpOnly cookie plus bearer token, KV rate limits |
| roles.php | `/api/roles`, `/api/roles/:id` | Last-admin protection kept |
| projects.php | `/api/projects`, `/api/projects/:id`, `/api/projects/slug/:slug` | Visibility rules, owner edit limits, admin notification on submission |
| donations.php | `/api/donations`, `/api/donations/:id` | Public supporters feed hides emails and anonymous names; `completeDonation` is idempotent and atomic (D1 batch) |
| content.php | `/api/content`, `/api/content/:key` | Admin/designer upsert |
| notifications.php | `/api/notifications`, `/api/notifications/:id/read` | Admin only |
| withdrawals.php | `/api/withdrawals`, `/api/withdrawals/:id` | Owner request, admin/finance review |
| helpers.php | `functions/_lib/*`, `functions/api/_middleware.js` | CORS, JSON envelope, JWT, sanitizing |

## Still to port
pesapal (checkout + IPN), users, organizations, settings, bugs, extras (sponsors, milestones, payouts, proxy receivers), upload and private files (R2), sitemap, admin health.

## Decisions
- Existing bcrypt password hashes keep working: they are verified with bcryptjs at sign-in and silently upgraded to PBKDF2. bcrypt at cost 12 is CPU-heavy, so the Workers Paid plan is recommended (the free plan's 10 ms CPU limit may reject legacy logins).
- Reset tokens are stored hashed (SHA-256), unlike the legacy API.
- Email is provider-pluggable (`functions/_lib/mail.js`); no provider is configured yet.
- Money columns are REAL for parity; consider integer minor units before finance reporting.
- Withdrawals keep legacy behavior (no check against available balance). Worth adding before launch.

## Not yet tested
Code has not been executed against a live Pages deployment. Run `npm install && npm run cf:dev` and hit `/api/health`, `/api/auth/signup` and `/api/projects` to verify.
