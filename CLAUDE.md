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
- **Inquiries**: Contact form submissions are stored in `/data/inquiries.json` (file-based, no database). The admin panel at `/admin` manages these inquiries via `/api/inquiries/*`.
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

### Important Details

- **Tailwind CSS v4** — uses `@tailwindcss/postcss` plugin, not the traditional `tailwind.config.js` setup.
- **Path alias**: `@/*` → `./src/*`
- **Remote images**: next.config.ts allows images from Unsplash, INCOM, Google Storage, and Picsum.
- **CORS**: All API routes have `Access-Control-Allow-Origin: *` headers set in next.config.ts.
- **Google Maps**: Map view uses `@react-google-maps/api`; key is in `.env.local`.
