# Valley Seeds

A CMS-driven, multilingual (English + Arabic, RTL) marketing website for an Egyptian agricultural company, built as a white-label template — clone it, swap branding/content/`.env` values, and ship a new client site with no code changes.

The repo holds two independent apps, each its own git repository:

| App | Path | Stack | Port |
|---|---|---|---|
| Public website + admin CMS | [`frontend/`](frontend) | Next.js 16 (App Router), React 19, Tailwind v4 | 3000 |
| REST API | [`backend/`](backend) | Node.js, Express, MongoDB (Mongoose) | 5000 |

> For deep architectural notes (auth flow, i18n gating, brand-color CSS vars, email/Telegram config patterns, permanent auth rules) see [`CLAUDE.md`](CLAUDE.md). For a point-in-time full system audit see [`audit-system-2026-08-05.txt`](audit-system-2026-08-05.txt).

---

## Features

- **Public marketing site** — Hero, About, Why Us, Mission, Services, Technology, Blockchain, Contact, Footer sections, all bilingual (EN/AR) with full RTL support.
- **Admin dashboard** (`/dashboard`) — full CRUD editing for every public section, a contact-message inbox, and a settings panel, all in the same Next.js app as the public site.
- **JWT cookie authentication** — HTTP-only cookie, client-side route guarding (no Edge middleware — see [Auth](#auth)).
- **Dashboard-configurable branding** — primary/accent color and logo are stored in MongoDB and pushed to the public site as CSS custom properties, so re-branding needs no redeploy.
- **Dashboard-configurable outgoing email** (SMTP or Gmail app-password) and **Telegram bot notifications** on contact-form submissions — both DB-first with `.env` fallback, credentials encrypted at rest (AES-256-GCM).
- **Image uploads** — local disk storage via Multer, served through the API (no third-party storage provider).
- **Password reset flow** and **in-dashboard admin credential changes**.
- **Content-gated public site** — the site shows a spinner while fetching CMS content and a "server offline" retry card on failure, instead of flashing hardcoded defaults.
- **Idempotent seed script** — populates MongoDB with real production copy and the admin user from `.env`.
- **Hardening** — rate limiting, CORS allowlist, hand-rolled CSRF origin-check, Helmet security headers.

---

## Monorepo layout

```
valley-seed/
├── CLAUDE.md                        ← engineering/architecture reference (read this for "why")
├── audit-system-2026-08-05.txt      ← point-in-time system audit
├── docker-compose.yml               ← builds + runs both apps together
├── package.json                     ← root convenience scripts (concurrently runs both dev servers)
├── sprint/                          ← historical build logs (001–004), superseded by the code
├── frontend/                        ← Next.js app — public site + /dashboard CMS (own git repo)
└── backend/                         ← Express API (own git repo)
```

`frontend/` and `backend/` are **separate git repositories** nested in this folder — there is no repo at the root level itself; commit inside each app's directory.

---

## Getting started

### Prerequisites
- Node.js ≥ 18
- A MongoDB instance (local or Atlas)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD at minimum
npm run seed            # upserts all content sections, settings, and the admin user
npm run dev              # http://localhost:5000
```

`server.js` validates `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` at boot and exits if any are missing.

### 2. Frontend

```bash
cd frontend
npm install
# frontend/.env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm run dev              # http://localhost:3000 (public site + /dashboard)
```

Log into the dashboard at `http://localhost:3000/dashboard/login` with the `ADMIN_EMAIL`/`ADMIN_PASSWORD` used to seed the backend.

### 3. Both at once (from repo root)

```bash
npm install
npm run dev        # runs backend + frontend dev servers concurrently
```

### Docker

`docker-compose.yml` builds and runs both apps as containers (backend on `BACKEND_PORT` default `5000`, frontend on `FRONTEND_PORT` default `3000`), with a named volume for persisted uploads. Backend env comes from `backend/.env`; the frontend's `NEXT_PUBLIC_API_URL` build arg comes from the shell environment or the root `.env`.

```bash
docker compose up --build
```

---

## Frontend (`frontend/`)

Next.js 16 App Router app that serves **both** the public marketing site and the `/dashboard` admin CMS from one codebase and one deploy.

### Structure
```
frontend/src/
├── app/
│   ├── layout.jsx            # root layout: <BrandProvider><LangProvider> (no AuthProvider here)
│   ├── page.jsx               # public homepage — composes all section components
│   ├── values/page.jsx        # standalone "all values" page
│   ├── error.jsx / not-found.jsx
│   └── dashboard/
│       ├── layout.jsx         # AuthProvider + inline DashboardShell (auth guard lives here)
│       ├── page.jsx           # overview / stat cards
│       ├── login/, forgot-password/, reset-password/   # public dashboard pages
│       └── hero/ about/ why-us/ mission/ services/ technology/ erp/ contact/ footer/ messages/ settings/
├── components/                 # public site sections (Header, HeroSection, AboutSection, WhyUsSection,
│                                  MissionSection, ServicesSection, TechnologySection, BlockchainSection,
│                                  ContactSection, Footer, ContentLoader, ServerOfflineCard)
│   └── dashboard/              # Sidebar, TopBar, SectionForm, FieldEditor, ImageManager, ConfirmModal,
│                                  SaveBar, IconPicker, LangTabs, MessageRow, EmailSettingsSection,
│                                  TelegramSettingsSection, AdminCredentialsSection
├── context/                    # LangContext, AuthContext, MessagesContext, BrandContext
├── hooks/                      # useSection, useMessages, useImageUpload
├── services/                   # api.js (shared axios instance) + auth/content/contact/upload services
└── i18n/                       # index.js (locale loader) + locales/{en,ar}.js (fallback copy)
```

### Public website
All sections (Hero, About, Why Us, Mission, Services, Technology, Blockchain, Contact, Footer) are bilingual and RTL-aware via `LangContext`. Content comes from the backend `Content` API and is merged over local fallback copy per-section. The page doesn't render until content resolves — a full-page spinner (`ContentLoader`) shows while loading, and a retry card (`ServerOfflineCard`) shows if the API call fails, instead of silently falling back to stale/default copy.

Brand color and logo are fetched once by `BrandContext` and written onto `<html>` as CSS variables (`--brand-primary`, `--brand-accent`), so public components styled with `var(--brand-primary)`/`var(--brand-accent)` re-color live when the admin changes them in the dashboard — no redeploy needed.

### Admin dashboard (`/dashboard`)
Full CRUD editors for every public content section, a message inbox for contact-form submissions, and a settings page covering brand colors/logo, outgoing email configuration, Telegram bot configuration, and admin credential changes. The dashboard keeps its own hardcoded brand-green styling (it isn't part of the white-labeled public output) and never reads `BrandContext`.

### Auth
Route protection for `/dashboard/*` is **entirely client-side** — there is deliberately no Next.js Edge `middleware.js`, because Edge middleware can't read the HTTP-only `vs_token` cookie once frontend and backend live on separate domains:
1. `AuthContext` (mounted only inside `dashboard/layout.jsx`) calls `GET /auth/me` on mount via the shared `api.js` axios instance (`withCredentials: true`).
2. `DashboardShell` (inline in `dashboard/layout.jsx`) reads auth state, shows a spinner while loading, and skips the sidebar/shell for the public dashboard pages (login, forgot/reset password).
3. `api.js`'s response interceptor redirects to `/dashboard/login` on any `401`, scoped to `/dashboard` paths only, so public-site requests are never affected.

See `CLAUDE.md`'s **Permanent Auth Rules (R1–R7)** before touching any of this — they map to real production incidents.

### Frontend commands
```bash
npm run dev      # Next.js dev server, port 3000
npm run build    # production build
npm run start    # run production build
npm run lint     # next lint
```
No test runner is configured.

---

## Backend (`backend/`)

Express REST API providing auth, CMS content, settings, uploads, and the contact form.

### Structure
```
backend/src/
├── server.js                 # boot, middleware chain, route mounting
├── config/                   # db.js, email.js, seed.js
├── middlewares/               # auth.middleware.js, error.middleware.js, rateLimiter.js
├── modules/
│   ├── auth/                  # login, /auth/me, forgot/reset password, credential change
│   ├── content/                # CRUD for all public-site content sections
│   ├── settings/               # brand colors/logo, email config, telegram config (singleton doc)
│   ├── upload/                  # Multer image upload/delete (no model — attaches to Content.images)
│   ├── contact/                 # contact form submission → email + DB + dashboard inbox
│   └── telegram/                 # bot webhook + notification service (config lives in Settings.telegramConfig)
│         each module: *.controller.js, *.routes.js, *.model.js (where applicable)
└── uploads/                   # Multer disk storage root, served at /uploads
```

There is no `controllers/`/`routes/`/`models/` flat layout and no Cloudinary integration anywhere — both appear in older planning docs but were superseded during the actual build.

### Key behaviors
- **Every response** is `{ success: true, data }` or `{ success: false, message }`, enforced consistently across all routes, the 404 handler, and the global error middleware.
- **Auth**: JWT stored in an HTTP-only `vs_token` cookie; `auth.middleware.js` verifies it and keeps a 60-second in-memory cache of the single admin doc to avoid a DB hit per request.
- **Content**: `Content` model is `{ section (enum, unique), en: Mixed, ar: Mixed, images: [{url, publicId}] }` — shape varies per section (see `config/seed.js` for the real shape of each).
- **Uploads**: local disk via Multer (5MB limit, jpeg/png/webp only) at `POST /api/upload/image`; an optional `?slot=` query param gives deterministic filenames so re-uploads overwrite instead of accumulating. `DELETE /api/upload/image` resolves the path through a path-traversal guard before unlinking.
- **Outgoing email**: `Settings.emailConfig` lets the admin configure SMTP/Gmail app-password credentials from the dashboard (password AES-256-GCM encrypted, key derived from `JWT_SECRET`); falls back to legacy `EMAIL_*` env vars if unset. Never exposed on the public `GET /api/settings` response.
- **Telegram notifications**: `Settings.telegramConfig` mirrors the email-config pattern — DB-first (bot token encrypted) with `TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID` env fallback. Fires alongside (not instead of) the contact-form email, fire-and-forget, using Node's built-in `fetch` against the Telegram Bot HTTP API.
- **Security**: `helmet` security headers, `express-rate-limit`, a CORS allowlist (`[CLIENT_URL, DASHBOARD_URL]`), and a hand-rolled CSRF origin-check middleware (inline in `server.js`) that rejects mutating requests whose `Origin`/`Referer` host isn't allowlisted.

### Backend commands
```bash
npm run dev      # nodemon src/server.js, port 5000
npm run start    # node src/server.js
npm run seed     # upserts all content sections, settings, and the admin user from .env
```
No lint or test runner is configured. Requires `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` set at startup.

---

## Environment variables

### `backend/.env` (see [`backend/.env.example`](backend/.env.example))
```
PORT=5000
NODE_ENV=development

MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d

ADMIN_EMAIL=
ADMIN_PASSWORD=

CLIENT_URL=http://localhost:3000
DASHBOARD_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000   # used to build absolute /uploads URLs

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM=
EMAIL_TO=

# Telegram contact-form notifications — optional fallbacks; the dashboard
# (Settings -> Telegram Bot Settings) is the primary config path.
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
TELEGRAM_WEBHOOK_SECRET=
WEBHOOK_BASE_URL=
```

### `frontend/.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_JWT_SECRET=   # unused — no Edge middleware exists; see CLAUDE.md
```

No `CLOUDINARY_*` variables exist anywhere in the project.

---

## Deployment

- The frontend deploys to Vercel as a standard Next.js app.
- `backend/vercel.json` configures the backend as a Vercel serverless function, though the codebase's `db.js`/`.env.example` comments suggest a long-running host (Railway/Render) as the actual intended target — verify which platform is live before assuming the Vercel path works cleanly.
- `docker-compose.yml` is the containerized alternative, building both apps and persisting uploads to a named volume.

---

## White-labeling for a new client

1. Clone the repo and rename the root folder.
2. Update `backend/.env` — new `MONGO_URI`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, email config.
3. Update `frontend/.env.local` — point `NEXT_PUBLIC_API_URL` at the new backend.
4. Replace `frontend/public/images/logo.svg` and `logo-white.svg`.
5. Run `npm run seed` in `backend/` to populate MongoDB with the new client's content and admin user.
6. Deploy — no code changes required. All brand values (name, phone, email, social links, colors) live in the `Settings` singleton document, editable from `/dashboard/settings`.

---

## Current status

Both apps are fully built (backend, dashboard, and public site — not "in progress"). See the status table and full detail in [`CLAUDE.md`](CLAUDE.md). Known gaps: no automated tests in either app, no backend lint script, and the `WarrantySection` component exists but is unused/unrendered.
