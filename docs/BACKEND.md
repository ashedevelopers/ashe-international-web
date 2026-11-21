# Backend status (PHP/MySQL to Cloudflare Pages Functions + D1)

## Cloudflare resources
- D1 `ashe-db` (EEUR): 16 tables from `migrations/0001_init.sql` and `0002_leads.sql`.
- KV `ASHE_KV`, bound as `KV` (rate limits).
- R2: pending (enable R2 in the dashboard, then uncomment the `UPLOADS` binding in `wrangler.toml`). Upload routes return 503 until then.
- Live: `https://ashe-international-web.pages.dev` (Pages project, auto-deploys from `main`).

## Ported and live
| Area | Routes | Notes |
|---|---|---|
| Auth | `/api/auth/signin, signup, signout, session, reset-request, reset-confirm` | JWT HS256, HttpOnly cookie, KV rate limits, legacy bcrypt hashes upgraded to PBKDF2 on login |
| Roles and users | `/api/roles`, `/api/users` | Last-admin protection |
| Campaigns | `/api/projects`, `/:id`, `/slug/:slug` | Visibility rules, owner edit limits, admin notification on submission |
| Donations | `/api/donations`, `/:id`, `/api/me/donations` | Public feed hides emails and anonymous names; completion is idempotent and atomic |
| Payments (Nylon Pay) | `/api/pay/start`, `/api/pay/status`, `/api/pay/webhook` | See below |
| Leads | `/api/submit`, `/api/leads` | Pledges, volunteers, partner inquiries; D1 plus Google Sheet sync |
| Content, notifications, withdrawals, settings, organizations, bugs | `/api/content`, `/notifications`, `/withdrawals`, `/settings`, `/organizations`, `/bugs` | |
| Campaign extras | `/api/project_sponsors`, `/project_milestones`, `/project_payouts`, `/proxy_receivers` | Ownership checks in `_lib/ownership.js` |
| Files | `/api/upload`, `/api/files/:name`, `/uploads/:name` | R2; type sniffed from magic bytes |
| Utilities | `/sitemap.xml`, `/api/health`, `/api/admin/health` | Health reports yes/no only, never secret values |

## Payments: Nylon Pay (replaces the old Pesapal plan)
Pesapal is not used. Mobile money (MTN, Airtel) is collected with the official `@nile-squad/nylonpay-ts` SDK.

1. `POST /api/pay/start` validates input, saves a pending donation, stores a 14-character reference in `donations.tracking_id` (`payment_provider = 'nylonpay'`) and calls `collectPayment`.
2. The donation page polls `GET /api/pay/status?reference=...`.
3. `POST /api/pay/webhook` verifies `x-nylon-signature` on the raw body with `NYLONPAY_WEBHOOK_SECRET`, then re-checks the payment with Nylon Pay.
4. In every path the money is only counted after Nylon Pay's own `getStatus` says it succeeded (`_lib/nylon.js` `syncByReference`), and completion is idempotent.

Secrets (Pages > Settings > Variables and Secrets): `NYLONPAY_API_KEY`, `NYLONPAY_API_SECRET`, `NYLONPAY_WEBHOOK_SECRET` (a separate credential from the API secret). Use sandbox keys first.
Webhook URL to set in the Nylon Pay dashboard: `https://<domain>/api/pay/webhook`. Leave the IP whitelist empty (Workers have no fixed egress IPs).
Cards are not collected on the site; Nylon Pay supports cards only through hosted invoices (`createInvoice`, needs an approved account), which is a possible later addition.
Bank/International gifts stay as pledges: they are saved as leads and bank details are sent to the donor.

## Still to do
- Verify the Nylon Pay flow end to end with one sandbox payment (the webhook body and status words were not fully visible in public docs; `syncByReference` accepts the usual ones).
- Enable R2, set `GOOGLE_SERVICE_ACCOUNT_JSON` for the sheet sync and a mail provider key (`RESEND_API_KEY`).
- Add a balance check to withdrawals and protect payout bank details before real money moves.
- Migrate legacy MySQL data, then DNS cutover for `asheinternational.org` (copy MX, SPF and DKIM records first).

## Decisions
- Existing bcrypt hashes keep working (bcryptjs at sign-in, then upgraded). bcrypt at cost 12 is CPU-heavy, so the Workers Paid plan is recommended.
- Reset tokens are stored hashed (SHA-256).
- Email is provider-pluggable (`functions/_lib/mail.js`); none configured yet.
- Money columns are REAL for parity; consider integer minor units before finance reporting.
