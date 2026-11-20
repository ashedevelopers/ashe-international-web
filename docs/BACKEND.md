# Backend port status (PHP/MySQL to Cloudflare Pages Functions + D1)

## Cloudflare resources
- D1 `ashe-db` (EEUR), 15 tables from `migrations/0001_init.sql`.
- KV `ASHE_KV`, bound as `KV`.
- R2: pending (enable R2 in the dashboard, then uncomment the `UPLOADS` binding in `wrangler.toml`). Upload routes return 503 until then.

## Ported (all legacy modules except Pesapal)
| Legacy module | New route | Notes |
|---|---|---|
| auth.php | `/api/auth/*` | JWT HS256 (same format), HttpOnly cookie plus bearer token, KV rate limits |
| roles.php | `/api/roles`, `/api/roles/:id` | Last-admin protection kept |
| projects.php | `/api/projects`, `/:id`, `/slug/:slug` | Visibility rules, owner edit limits, admin notification on submission |
| donations.php | `/api/donations`, `/:id` | Public feed hides emails and anonymous names; completion is idempotent and atomic |
| content.php | `/api/content`, `/:key` | Admin/designer upsert |
| notifications.php | `/api/notifications`, `/:id/read` | Admin only |
| withdrawals.php | `/api/withdrawals`, `/:id` | Owner request, admin/finance review |
| extras.php | `/api/users`, `/api/project_sponsors`, `/api/project_milestones`, `/api/project_payouts`, `/api/proxy_receivers`, `/sitemap.xml` | Ownership checks in `_lib/ownership.js` |
| misc.php | `/api/settings`, `/api/organizations`, `/api/bugs` | |
| upload.php | `/api/upload`, `/api/files/:name`, `/uploads/:name` | R2; file type sniffed from magic bytes, not the browser MIME type |
| (new) | `/api/admin/health` | Replaces the PHP environment check; `migrate.php` is replaced by `wrangler d1 migrations` |

## Still to port
- Pesapal checkout and IPN callback (waiting for keys; the donation helpers it needs already exist).

## Decisions
- Existing bcrypt password hashes keep working: they are verified with bcryptjs at sign-in and silently upgraded to PBKDF2. bcrypt at cost 12 is CPU-heavy, so the Workers Paid plan is recommended.
- Reset tokens are stored hashed (SHA-256), unlike the legacy API.
- Email is provider-pluggable (`functions/_lib/mail.js`); no provider is configured yet.
- Money columns are REAL for parity; consider integer minor units before finance reporting.
- Withdrawals keep legacy behavior (no check against available balance). Add before launch.
- Payout bank details are stored as plain text like the legacy site. Consider field-level encryption before launch.
- Small fixes vs legacy: org flags parse "false" correctly, bug severity is validated, resolving a bug also sets its status.

## Not yet tested
Code has not been executed against a live Pages deployment. Run `npm install && npm run cf:dev` and hit `/api/health`, `/api/auth/signup` and `/api/projects` to verify.
