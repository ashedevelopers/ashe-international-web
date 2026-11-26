# ASHE International Web Platform
Built and maintained by Emmanuel Gabriel Ndayambaje, IT officer at ASHE.

Production web platform for **ASHE (Action For Save Humanity Emergency)**, a humanitarian nonprofit empowering refugees and host communities in Nakivale Refugee Settlement, Isingiro District, Uganda.

**Stack:** React 18, Vite, Tailwind CSS, Framer Motion, Lucide Icons, React Router. Hosted on Cloudflare Pages with Pages Functions (edge API), D1 (database), R2 (files) and KV (sessions and cache).

## Quick start

```bash
npm install
npm run dev          # UI at http://localhost:5173
npm run cf:dev       # build + Pages Functions at http://localhost:8788
npm run cf:deploy    # deploy to Cloudflare Pages
```

Copy `.dev.vars.example` to `.dev.vars` for local secrets. Never commit real secrets.

## Brand tokens (extracted from asheinternational.org)

| Token | Value |
|---|---|
| Primary green | `#0E622A` |
| Dark green (hover, text on light) | `#07401A` |
| Soft green (borders) | `#9FC0AA` |
| Accent yellow | `#F9C61F` |
| Ink / background | `#0F0F0F` / `#FFFFFF` |
| Headings | Playfair Display |
| Body | Inter |
| Radius | 10px (buttons 12px) |
| Logo | `/assets/ashe-logo.jpeg` (copy from the current site) |

## Section architecture

Each page section below maps to a real piece of ASHE content.

| Section | Behavior | ASHE content |
|---|---|---|
| Sticky navbar | Transparent over hero, solid green on scroll, mobile drawer | Logo, About, Programs, Partners, Contact, Donate button |
| Kinetic hero | Oversized type, parallax photo, staggered word reveal | "Empowering Refugees and Host Communities", Donate Now and Start a Fundraiser |
| Marquee ticker | Infinite horizontal scroll, pauses on hover | Permaculture, Mushroom Farming, Sewing Training, Computer Skills, Nakivale, Isingiro |
| 3-column highlight strip | Count-up numbers on scroll | 1,500+ people impacted, 12+ volunteer staff, programs in Nakivale |
| 3 pillar cards | Lift and color shift on hover | Sustainability at the Core, Community-Centered Approach, Long-term Impact |
| Programs | Alternating image and text, scroll reveal | Vocational training, computer skills, entrepreneurship, environmental awareness |
| Masonry gallery | Staggered fade-in, lightbox | Field photography from Nakivale |
| Featured campaigns | Progress bars driven by live donation data | Women's center in Nakivale and other approved projects |
| Testimonials | Slow auto-advancing slider | Program manager, beneficiaries, partner church |
| Partners | Logo grid | InnovYeng, Unsung Heroes, Talk Pregnancy with Dr Noella |
| FAQ accordion | Animated height, one open at a time | Donations, fundraisers, fund releases, volunteering |
| CTA banner | Full-width green with yellow accent button | Your gift powers every project on ASHE |
| Footer | Contact, social links, newsletter | asheinternational.org details |

## Platform systems to port from the current site

The current site runs a PHP and MySQL API. Each module is rebuilt as a Pages Function backed by D1, R2 and KV.

| Module | Scope |
|---|---|
| `auth` | Signup, signin, signout, password reset, session (JWT) |
| `roles` | admin, designer, finance, partner, donor, fundraiser |
| `projects` | Create, review, approve, funding status, slugs |
| `donations` + `pesapal` | Checkout, IPN callback, receipts |
| `withdrawals` | Fundraiser requests and finance review |
| `milestones`, `payouts`, `sponsors` | Phased fund releases with proof of impact |
| `content` | Admin-editable homepage sections, programs, partners |
| `notifications` | In-app, email and SMS |
| `organizations` | NGO, school and church profiles |
| `settings`, `bugs`, `upload` | Admin settings, bug reports, file uploads and private files |

Dashboards: admin, finance, designer (content), partner, fundraiser and donor.

## Roadmap

1. **Step 1 (this commit):** audit, brand tokens, repo scaffold, Cloudflare config.
2. **Step 2:** design system and all public sections and pages.
3. **Step 3:** D1 schema migrations and Pages Functions API port.
4. **Step 4:** auth flows, role-based dashboards, payments, uploads.
5. **Step 5:** data migration from MySQL, QA, and DNS cutover.

## Cloudflare setup

```bash
wrangler d1 create ashe-db
wrangler r2 bucket create ashe-uploads
wrangler kv namespace create ASHE_KV
wrangler pages secret put JWT_SECRET --project-name ashe-international-web
```

Uncomment the matching blocks in `wrangler.toml` and paste the returned IDs.
