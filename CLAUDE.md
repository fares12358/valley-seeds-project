# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Role:** You are a senior MERN stack engineer on this project.
> The structure described here reflects the actual filesystem as of 2026-08-05 — always re-verify against the code before assuming, since this file can go stale again.

---

## Project Overview

**Valley Seeds** is a CMS-driven, multilingual (EN + AR, RTL) marketing website for an Egyptian agricultural company. It ships as two independent apps in one repo:

- `frontend/` — Next.js 16 app (App Router): the public website **and** a `/dashboard` admin CMS in the same app.
- `backend/` — Node/Express REST API: auth, content, settings, uploads, contact form.

**White-label goal:** this codebase is meant to be duplicated for future clients — only branding, content, colors, and `.env` values should change.

`frontend/` and `backend/` are **separate git repositories** (each has its own `.git/`); there is no repo at the root.

---

## Current Status (verified against code, not the old sprint docs)

The dashboard and backend are **fully built**, not "not started" — the project went through 4 completed sprints (`sprint/001.txt`–`004.txt`, historical build logs only; **do not treat them as a live plan or as current truth, they predate later fixes**). For a full point-in-time snapshot (endpoint inventory, file counts, lint findings with line numbers, security posture, recommendations) see `audit-system-2026-08-05.txt` at the repo root — re-verify against the filesystem before trusting it once it ages, same as this file. What actually exists today:

| Area | Status |
|---|---|
| Public website (all sections, i18n, RTL) | ✅ Complete |
| Dashboard (`/dashboard/*`) — full CRUD for every section, messages inbox, settings | ✅ Complete |
| Backend API (auth, content, settings, upload, contact) | ✅ Complete |
| JWT cookie auth, client-side route guarding | ✅ Complete |
| Image uploads | ✅ Complete — **local disk via Multer**, not Cloudinary (never was) |
| Contact form → email + DB + dashboard inbox | ✅ Complete (Nodemailer, not Resend) |
| Password reset flow (forgot/reset password) | ✅ Complete |
| Seed script (`backend/src/config/seed.js`) | ✅ Complete — real production copy, idempotent upserts |
| Rate limiting, CSRF origin-check, security headers | ✅ Complete (Sprint 003/004 hardening) |
| Dashboard-configurable email sending (`Settings.emailConfig`, `/dashboard/settings`) | ✅ Complete — DB-first with `.env` fallback |
| Admin credential change (email/password) from dashboard | ✅ Complete (`PUT /api/auth/credentials`) |
| Public site uses dashboard brand color/logo (`BrandContext`, CSS vars) | ✅ Complete — was previously wired in `Settings` but never consumed by the frontend |
| Public site gated behind content fetch (spinner → content, or offline alert card) | ✅ Complete — replaced the old "flash local defaults, silently swap in API content" behavior |
| Automated tests | ❌ None exist (no test runner in either package.json) |
| Lint script | ❌ Frontend has `next lint`; backend has none |
| WarrantySection component | ⚠️ Still built but unused/unrendered |

Two harmless stray files exist and are self-documented as deletable: `frontend/src/components/ContactSection_patch.tmp`, `frontend/src/i18n/locales/en_patch.tmp`.

---

## Commands

### Frontend (`cd frontend`)
```
npm run dev      # Next.js dev server, port 3000 (serves both public site and /dashboard)
npm run build    # production build
npm run start    # run production build
npm run lint     # next lint (flat eslint.config.mjs, eslint-config-next/core-web-vitals, no custom rules)
```
No test script/framework configured.

### Backend (`cd backend`)
```
npm run dev      # nodemon src/server.js, port 5000
npm run start    # node src/server.js
npm run seed     # node src/config/seed.js — upserts all content sections, settings, and the admin user from .env
```
No lint or test script configured.

`npm run dev` requires `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` set — `server.js` validates these at startup and `process.exit(1)`s if any are missing.

---

## Repository Layout

```
valley-seed/
├── CLAUDE.md
├── audit-system-2026-08-05.txt      ← point-in-time system audit — full status snapshot, not a live plan
├── sprint/                          ← historical build logs (001–004), superseded by actual code — do not treat as a live plan
├── frontend/                        ← Next.js 16 app (App Router), own git repo
│   └── src/
│       ├── app/
│       │   ├── layout.jsx           ← root layout: wraps in <BrandProvider><LangProvider> (no AuthProvider here)
│       │   ├── page.jsx              ← public homepage (composes all section components)
│       │   ├── values/page.jsx       ← standalone "all values" page
│       │   ├── error.jsx / not-found.jsx
│       │   └── dashboard/
│       │       ├── layout.jsx        ← AuthProvider + inline DashboardShell (auth guard lives HERE, not in a separate file)
│       │       ├── page.jsx          ← overview / stat cards
│       │       ├── login/, forgot-password/, reset-password/   ← public dashboard pages
│       │       └── hero/ about/ why-us/ mission/ services/ technology/ erp/ contact/ footer/ messages/ settings/
│       ├── components/               ← public website sections (Header, HeroSection, AboutSection, WhyUsSection,
│       │                                MissionSection, ServicesSection, TechnologySection, BlockchainSection,
│       │                                ContactSection, Footer, WarrantySection[unused], ContentLoader,
│       │                                ServerOfflineCard — the last two are the content-gating spinner/error states)
│       │   └── dashboard/            ← Sidebar, TopBar, SectionForm, FieldEditor, ImageManager, ConfirmModal,
│       │                                SaveBar, SectionSkeleton, StatCard, EmptyState, IconPicker, LangTabs, MessageRow,
│       │                                EmailSettingsSection, AdminCredentialsSection
│       ├── context/
│       │   ├── LangContext.jsx       ← public site language/i18n state
│       │   ├── AuthContext.jsx       ← dashboard JWT/session state
│       │   ├── MessagesContext.jsx   ← singleton wrapper around useMessages(), avoids duplicate fetches
│       │   └── BrandContext.jsx      ← fetches Settings once, writes brand color/logo as CSS vars on <html>
│       ├── hooks/                    ← useSection.js, useMessages.js, useImageUpload.js
│       ├── services/                 ← api.js (shared axios instance) + auth/content/contact/upload .service.js
│       └── i18n/
│           ├── index.js              ← locale loader — local fallback + optional backend fetch, see below
│           └── locales/{en,ar}.js    ← default/fallback copy
└── backend/                          ← Express API, own git repo
    └── src/
        ├── server.js                 ← boot, middleware chain, route mounting
        ├── config/{db.js, email.js, seed.js}
        ├── middlewares/{auth.middleware.js, error.middleware.js, rateLimiter.js}   ← NOTE: "middlewares" plural
        ├── modules/{auth,content,settings,upload,contact}/    ← each: *.controller.js, *.routes.js, *.model.js
        │     (upload has no model.js — files aren't their own collection, they attach to Content.images)
        └── uploads/                  ← Multer disk storage root, served at /uploads
```

There is **no** `backend/config/cloudinary.js`, **no** flat `controllers/`/`routes/`/`models/` layout, and **no** `frontend/src/middleware.js` — all of these appear in older planning docs but were superseded during the actual build.

---

## Architecture — things that span multiple files

### Auth: client-side only, cookie-based, no Edge middleware
There is deliberately **no `middleware.js`** in the frontend. Route protection for `/dashboard/*` is entirely client-side:
1. `AuthContext.jsx` (mounted only inside `dashboard/layout.jsx`) calls `GET /auth/me` on mount using the shared `api.js` axios instance (`withCredentials: true`), which sends the `vs_token` HTTP-only cookie automatically.
2. `DashboardShell` (defined inline in `dashboard/layout.jsx`, not a separate component) reads `useAuth()`, shows a spinner while loading, renders `null` while unauthenticated, and skips the sidebar/shell entirely for `PUBLIC_PATHS` (`/dashboard/login`, `/dashboard/forgot-password`, `/dashboard/reset-password`).
3. `api.js`'s response interceptor redirects to `/dashboard/login` on any `401`, but **only** when `pathname.startsWith("/dashboard")` and it isn't already one of the auth pages — this prevents redirect loops and prevents public-site 401s (there shouldn't be any, but defense-in-depth) from redirecting visitors.

Backend side: `middlewares/auth.middleware.js` verifies the `vs_token` JWT cookie and keeps a 60-second in-memory `Map` cache of the admin doc (single-admin CMS, so this eliminates a DB hit on almost every protected request); `clearAdminCache()` is called explicitly on logout/password-reset to avoid a stale window.

**`frontend/.env.local`'s `NEXT_PUBLIC_JWT_SECRET` and the `jose` dependency are dead weight** — a comment claims they're for Edge middleware JWT verification, but no such middleware exists anywhere in the repo and `jose` is never imported. Do not "fix" this by building middleware around them; the client-side guard above is the intended, working design.

See **Permanent Auth Rules** below — these are hard constraints from real production incidents, not stylistic preferences.

### i18n / content: the public site is gated behind the content fetch, not silently backfilled
- `frontend/src/i18n/locales/{en,ar}.js` are local defaults — used to fill in any section missing from a successful API response, and used directly (synchronously, no fetch) on dashboard routes.
- On the **public site**, `LangProvider` (`context/LangContext.jsx`) tracks a `status` of `'loading' | 'ready' | 'error'` and does **not** render `children` (i.e. the actual page) until `status === 'ready'`:
  - `status` starts `'loading'` → renders `<ContentLoader />` (full-page spinner).
  - `LangProvider` calls `getTranslations(lang)` (`src/i18n/index.js`), which fetches `GET {NEXT_PUBLIC_API_URL}/content` and merges each section's API content **over** the local fallback (API wins per-section, missing sections fall back to local).
  - Success → `status = 'ready'`, the real page renders.
  - Any fetch failure (network error, non-2xx) → `getTranslations` **throws** (it used to swallow the error and silently return local content — that was the old flash-of-default-content behavior and is intentionally gone) → `status = 'error'` → renders `<ServerOfflineCard onRetry={...} />` (full-page white alert card with a Retry button that re-runs the fetch).
  - If `NEXT_PUBLIC_API_URL` isn't set at all, that's treated as intentional local-only dev mode, not a failure — resolves straight to local content.
- On **dashboard routes**, `LangProvider` never fetches or gates at all — `t` is computed synchronously from the local locale files every render (`isDashboard` check via `usePathname()`), and dashboard editors get section data from `useSection()` / `content.service.js` instead.
- After a dashboard save, `useSection.save()` calls `invalidateTranslationCache()` so the public site picks up the edit without waiting for the 60s ISR window.
- Backend `Content` model: `{ section (enum, unique), en: Mixed, ar: Mixed, images: [{url, publicId}] }` — `en`/`ar` are freeform objects, shape varies per section (see `seed.js` for the real shape of each).

### Uploads: local disk, not Cloudinary
Despite older planning docs, images are stored on the backend's local filesystem (`backend/src/uploads/`), served via `express.static` at `/uploads`. `POST /api/upload/image` (Multer, 5MB limit, jpeg/png/webp only) accepts an optional `?slot=` query param for deterministic filenames (e.g. `background.png`) so re-uploading to the same UI slot **overwrites** rather than accumulates files; without a slot, filenames are `crypto.randomUUID()`-based. `DELETE /api/upload/image` resolves the given `publicId` through a path-traversal guard (`resolveSafePath`) before unlinking. The response/storage shape is always `{ url, publicId }`, where `publicId` is the path relative to the uploads root (used later to delete the file).

### Brand colors/logo: dashboard-configurable via CSS variables
The public site's brand color and logo now come from the dashboard `Settings` document, not just hardcoded defaults:
- `frontend/src/context/BrandContext.jsx` (`BrandProvider`, mounted in root `layout.jsx` above `LangProvider`) fetches `GET {NEXT_PUBLIC_API_URL}/settings` once on mount and writes `primaryColor`/`accentColor` onto `document.documentElement` as the CSS custom properties `--brand-primary`/`--brand-accent` (declared with their `#037338`/`#96C422` defaults in `globals.css`'s `:root`). Any fetch failure is swallowed — the site keeps the CSS defaults.
- Public components style with `text-[var(--brand-primary)]` / `bg-[var(--brand-accent)]` (including with Tailwind v4 opacity modifiers, e.g. `border-[var(--brand-primary)]/30`, which compiles to `color-mix()` — confirmed working in a production build) instead of literal hex, so changing the color in `/dashboard/settings` re-colors the live site without a deploy.
- `Header.jsx`/`Footer.jsx` read `logoUrl`/`logoWhiteUrl` from `useBrand()` and fall back to the static `/images/logo.svg` / `logo-white.svg` when the dashboard hasn't uploaded a custom logo.
- **This only applies to the public site.** Dashboard UI (`src/components/dashboard/*`, `src/app/dashboard/**`) intentionally keeps hardcoded brand-green styling and its own static logo — it's an admin tool, not part of the white-labeled output, so it does not read `BrandContext`.
- Gradient/shade variants that aren't exactly the configured primary/accent (e.g. `#05964a`, `#012a14`) were left as literal hex — they're decorative derived shades, not something the Settings color pickers control.

### Outgoing email: dashboard-configurable, DB-first with .env fallback
`Settings.emailConfig` (`provider: "smtp"|"app_password"`, host/port/secure, user, `pass` [AES-256-GCM encrypted via `backend/src/utils/crypto.js`, key derived from `JWT_SECRET`], from, to) lets the admin set SMTP credentials from `/dashboard/settings` instead of editing `.env`. Key points:
- `emailConfig` is **never** included in the public `GET /api/settings` response (stripped in `settings.controller.js`) — only `GET/PUT /api/settings/email` (both protected) can read/write it, and even then the password is never sent back to the browser (`passSet: true/false` only).
- `config/email.js`'s `getMailer()` builds a fresh Nodemailer transporter per send from `Settings.emailConfig` if a user+pass are stored there, otherwise falls back to the legacy `EMAIL_*` env vars — so existing deployments keep working until someone fills in the dashboard form.
- `provider: "app_password"` assumes Gmail's SMTP (`smtp.gmail.com:587`) unless the doc has an explicit host/port; `"smtp"` requires them.
- Admin login credentials (email/password) are changed via protected `PUT /api/auth/credentials` (`auth.controller.js`), which requires `currentPassword`, reissues the `vs_token` cookie, and busts the auth middleware's in-memory cache — wired to `AdminCredentialsSection.jsx` on the settings page.

### Backend conventions
- Every route → `{ success: true, data }` or `{ success: false, message }`, enforced consistently across all 5 modules, the 404 handler, and the global error middleware (`middlewares/error.middleware.js`, last in the chain).
- Every controller function is manually wrapped in `try { } catch (err) { next(err) }` — there is no `asyncHandler` wrapper utility.
- CORS origin allowlist = `[CLIENT_URL, DASHBOARD_URL]`, `credentials: true`. A hand-rolled CSRF origin-check middleware (inline in `server.js`, not a separate file) additionally rejects mutating requests whose `Origin`/`Referer` host isn't in that allowlist, as defense-in-depth for the production `sameSite: "none"` cookie setting.
- `cookieOptions()` (defined in `auth.controller.js`) is the single source of truth for the `vs_token` cookie's `httpOnly`/`secure`/`sameSite`/`maxAge` — see Rule R5 below.

---

## Permanent Auth Rules (R1–R7)

These map to real production bugs (`bugs-manual-fix.txt`, 2026-07-13) that were manually diagnosed and fixed. They are **non-negotiable** unless the user explicitly overrides them — violating one reintroduces a fixed bug:

1. **Never create `middleware.js`** for route protection. Next.js Edge middleware can't read the `vs_token` HTTP-only cookie cross-domain once frontend/backend are on separate Vercel domains — auth guarding is client-side only, via `AuthContext` inside `DashboardShell`.
2. **Never call `useAuth()` in the same component that renders `<AuthProvider>`.** Pattern: `dashboard/layout.jsx` renders `<AuthProvider>` only; the inner `DashboardShell` calls `useAuth()`.
3. **Never add `useEffect` nav-watchers in auth pages** that watch `user`/`isLoading` and call `router.push`/`window.location`. The `api.js` 401 interceptor handles session expiry globally; the login page uses a `navigating` ref guard instead to prevent double-fire.
4. **Never call `window.location.href` inside `AuthContext.login()`.** Hard navigation happens in `login/page.jsx`'s `handleSubmit`, guarded by the ref.
5. **Always use the `cookieOptions()` helper** in `auth.controller.js` for any cookie set/clear — never hardcode `sameSite`/`secure`/`httpOnly` inline, or login/logout cookie attributes can drift out of sync and the cookie won't clear. (Note: `logout`'s `clearCookie` call currently duplicates the values inline instead of importing the helper — they still match today, but prefer reusing the helper if you touch this code.)
6. **`AuthProvider` lives only in `dashboard/layout.jsx`**, never in the root `layout.jsx` — otherwise every public page fires `GET /auth/me` and gets redirected to `/dashboard/login` on 401.
7. **All new API calls must use the shared `services/api.js` axios instance** (`withCredentials: true`) so they inherit the 401 interceptor's `isDashboardPage` guard — a raw axios/fetch call bypasses it and can redirect public visitors incorrectly.

---

## Frontend Rules (NEVER break these)

- Do NOT redesign, restructure, or respace any existing public-site section.
- Do NOT change the default brand colors `#037338` (primary) / `#96C422` (accent) in `globals.css`'s `:root` — they're the fallback when the dashboard hasn't set a custom color. Public components should reference `var(--brand-primary)`/`var(--brand-accent)` (see "Brand colors/logo" above), not literal hex, so the dashboard's color pickers keep working — don't reintroduce hardcoded hex into public components.
- Do NOT change the Alexandria font.
- Do NOT install npm packages without explicit approval.
- Do NOT use bare `<img>` — always `<Image>` from `next/image`.
- Keep all Framer Motion animations exactly as they are.
- All text must go through `useTranslation()` — no hardcoded strings in JSX.
- Dashboard components go in `src/components/dashboard/` — never mixed with public website components.

---

## Environment Variables

### `backend/.env` (see `backend/.env.example` for the authoritative list)
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
```

### `frontend/.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_JWT_SECRET=   # UNUSED — see "dead weight" note above, do not build middleware around this
```

No `CLOUDINARY_*` vars exist anywhere in the project.

---

## Dev Ports

| App | Port | Command |
|---|---|---|
| Frontend + Dashboard | 3000 | `cd frontend && npm run dev` |
| Backend API | 5000 | `cd backend && npm run dev` |

---

## Deployment

- `backend/vercel.json` configures the backend as a Vercel serverless function (`@vercel/node`, all routes → `src/server.js`). Note this is in tension with the async-IIFE `app.listen()` startup pattern meant for a long-running process — `db.js`/`.env.example` comments suggest Railway/Render as the actual intended target; verify which platform is live before assuming Vercel deploy works cleanly for the backend.
- Frontend deploys to Vercel normally (standard Next.js app).

---

## White-Label Replication Guide

1. Clone the repo, rename the root folder to the new client name.
2. Update `backend/.env` — new `MONGO_URI`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, email config.
3. Update `frontend/.env.local` — point `NEXT_PUBLIC_API_URL` to the new backend URL.
4. Replace `frontend/public/images/logo.svg` and `logo-white.svg`.
5. Run `npm run seed` (backend) to populate MongoDB with the new client's content and admin user.
6. Deploy — no code changes required. All brand values (name, phone, email, social links, colors) live in the `Settings` singleton document, editable from `/dashboard/settings`.
