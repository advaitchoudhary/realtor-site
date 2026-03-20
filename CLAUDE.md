# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server at http://localhost:3000
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

## Architecture

This is a **Next.js App Router** real estate website that proxies property listings from the INCOM Real Estate API.

### Key Data Flow

- **Listings**: Client pages call internal `/api/listings/*` routes, which proxy to the external INCOM API (HTTPS with cert bypass). Search results are cached for 60 seconds. Listing images are also proxied through `/api/listings/[id]/image`.
- **Inquiries**: Contact form submissions are persisted to **Google Sheets** via the Sheets API (`src/lib/sheets.ts`). The admin panel at `/admin` manages these inquiries via `/api/inquiries/*`. Required env vars: `GOOGLE_SHEETS_SPREADSHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`.
- **Configuration**: All site branding (agent name, phone, colors, etc.) and API keys come from `.env.local` via `src/lib/config.ts`.

### Structure

```
src/
  app/
    api/listings/     # INCOM API proxy (search, detail, image)
    api/inquiries/    # File-based inquiry CRUD
    listings/         # Grid, detail ([id]), and map views
    admin/            # Inquiry management UI
  components/
    home/             # Homepage sections (Hero, Featured, Stats, etc.)
    listings/         # ListingCard, SearchFilters, LazyListingImage
    layout/           # Navbar, Footer
  lib/
    types.ts          # TypeScript interfaces for listings/inquiries
    config.ts         # Site config loaded from env vars
    utils.ts          # Price/area formatting, search payload builder
data/
  inquiries.json      # Persisted inquiry records
```

### Admin Panel & Authentication

- **Route**: `/admin` (`src/app/admin/page.tsx`) — client component, fully gated behind a login modal.
- **Auth API**: `src/app/api/auth/route.ts`
  - `POST /api/auth` — validates `{ username, password }` against `ADMIN_USERNAME` / `ADMIN_PASSWORD` env vars. On success, sets an `httpOnly` cookie `admin_token` (SHA-256 hash, 8-hour expiry, uses `ADMIN_SECRET` env var).
  - `GET /api/auth` — checks if `admin_token` cookie exists and is 64 chars long. Returns 200 if valid, 401 otherwise. **No cryptographic replay check** — only length is verified.
  - `DELETE /api/auth` — clears the cookie (logout).
- **Login flow**: On mount, page calls `GET /api/auth`; if 200, skips modal and loads inquiries. Otherwise shows login form. On successful `POST /api/auth`, sets `authenticated = true` and fetches inquiries.
- **Dashboard features**: Stats cards, filterable/searchable inquiry list, detail panel with status updates (`new`/`contacted`/`closed`), internal notes, delete, email/call quick actions.
- **Fallback**: If `data/inquiries.json` is empty, hardcoded demo inquiries are shown.
- **Security note**: `/api/inquiries/*` routes have **no auth checks** — they are publicly accessible. The auth is purely client-side gating on the `/admin` page.
- **Required env vars**: `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SECRET` (optional, defaults to `"fallback-secret"`).

### Important Details

- **Tailwind CSS v4** — uses `@tailwindcss/postcss` plugin, not the traditional `tailwind.config.js` setup.
- **Path alias**: `@/*` → `./src/*`
- **Remote images**: next.config.ts allows images from Unsplash, INCOM, Google Storage, and Picsum.
- **CORS**: All API routes have `Access-Control-Allow-Origin: *` headers set in next.config.ts.
- **Google Maps**: Map view uses `@react-google-maps/api`; key is in `.env.local`.
