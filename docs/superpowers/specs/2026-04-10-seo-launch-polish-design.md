# SEO & Launch Polish — Design Spec

**Date:** 2026-04-10
**Status:** Draft
**Scope:** Full SEO optimization for already-live asiandoula.org

## Context

The ADA website is live at asiandoula.org. Core SEO foundations are in place (per-page metadata, sitemap.ts, robots.ts, GA4, Google Site Verification, 301 redirects). This spec covers fixing known issues and filling remaining gaps.

## 1. Bug Fixes

### 1a. OG Image Path Fix

All pages reference `/images/hero.jpg` but only `/images/hero.webp` exists. Update all OG image references to `/images/hero.webp`.

Additionally, set a default OG image in the root layout `openGraph` config so pages without custom OG images have a fallback.

**Files affected:** `src/app/layout.tsx` + all `page.tsx` files under `src/app/(public)/` that reference `hero.jpg`.

### 1b. Viewport Export

Add `export const viewport: Viewport` to `src/app/layout.tsx`. Next.js 14 requires viewport configuration as a separate export, not inside the metadata object.

```typescript
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};
```

### 1c. Canonical URLs

No action needed. `metadataBase` is already set to `https://asiandoula.org`, which causes Next.js to auto-generate canonical URLs for all pages.

## 2. Structured Data (JSON-LD)

### Infrastructure

Create `src/lib/json-ld.ts` with helper functions for generating schema markup. Each function returns a typed object; pages render it via a `<script type="application/ld+json">` tag.

### 2a. Organization (enhance existing)

Move the existing Organization schema from the homepage into `json-ld.ts`. Enhance with:
- `address`: Irvine, CA
- `sameAs`: social media profile URLs (Instagram, Facebook, etc. — pull from existing footer links)

**File:** `src/app/(public)/page.tsx` (homepage) — import from `json-ld.ts` instead of inline.

### 2b. Article Schema

For `/articles/[slug]` — generate `Article` schema from Supabase article data:
- `headline`: article title
- `author`: article author (or default to "Asian Doula Alliance")
- `datePublished`: article created_at
- `dateModified`: article updated_at
- `image`: article cover_image
- `publisher`: reference to Organization

**File:** `src/app/(public)/articles/[slug]/page.tsx`

### 2c. FAQPage Schema

For `/support/faq` — structure existing FAQ content as `FAQPage` schema with `Question` + `acceptedAnswer` pairs. This enables Google FAQ rich snippets.

**File:** `src/app/(public)/support/faq/page.tsx`

### 2d. Course Schema

For each certification page (`/certifications/postpartum-doula`, `/certifications/birth-doula`, `/certifications/ibclc`):
- `@type`: Course
- `name`: certification name
- `description`: from page metadata
- `provider`: Organization (ADA)
- `educationalLevel`: Professional certification

**Files:** 3 certification `page.tsx` files.

### 2e. BreadcrumbList Schema

Add a `buildBreadcrumbs(segments: {name: string, path: string}[])` helper to `json-ld.ts`. Each segment becomes a `ListItem` with `position`, `name`, and `item` (URL).

Apply to all pages with depth >= 2 (e.g., Certifications > Postpartum Doula > Steps).

**Scope:** All deep pages under `/certifications/`, `/about-us/`, `/for-doulas/`, `/for-families/`, `/support/`, `/programs/`.

## 3. Icons & Manifest

### 3a. Apple Touch Icon

Generate a 180x180 PNG `apple-touch-icon.png` from the existing `icon.svg`. Place in `src/app/` (Next.js auto-serves app directory icons).

### 3b. Web Manifest

Create `src/app/manifest.ts` (Next.js route handler):

```typescript
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Asian Doula Alliance',
    short_name: 'ADA',
    icons: [
      { src: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    theme_color: '#606090',
    background_color: '#FFFAF5',
    display: 'browser',
  };
}
```

Note: `display: 'browser'` — ADA is not a PWA, no need for standalone mode.

## 4. Security Headers

Add to `next.config.mjs` `headers()`:

```javascript
{
  source: '/(.*)',
  headers: [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  ],
}
```

**Not included:** Content-Security-Policy. ADA uses GA4 inline scripts and external resources; CSP would add complexity with minimal security benefit for a public content site.

## 5. Analytics Supplement

### 5a. Vercel Analytics

Install `@vercel/analytics` and add `<Analytics />` to root layout. Zero-config with Vercel deployment.

### 5b. Vercel Speed Insights

Install `@vercel/speed-insights` and add `<SpeedInsights />` to root layout. Provides Core Web Vitals monitoring in Vercel dashboard.

**File:** `src/app/layout.tsx` — add both components inside `<body>`.

## 6. Performance Verification

Not a rewrite — just verify existing patterns:

- **Images:** Confirm all visible images use `next/image` with proper `width`/`height` or `fill`. Above-fold images should have `priority={true}`.
- **Fonts:** Confirm fonts load via `next/font` (avoid FOUT/layout shift). Check current font loading strategy for DM Serif Display and Outfit.

Fix only if issues are found. No proactive refactoring.

## Out of Scope

- Deep performance audit / Lighthouse optimization pass
- Content-Security-Policy headers
- PWA features (offline, service worker)
- i18n / hreflang (site is English-primary)
- Redesigning existing pages
- Adding new pages
