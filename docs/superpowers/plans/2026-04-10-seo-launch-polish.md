# SEO & Launch Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix broken OG images, add structured data, security headers, analytics, and polish for production asiandoula.org.

**Architecture:** Centralized JSON-LD helpers in `src/lib/json-ld.ts`, imported by individual pages. Security headers in `next.config.mjs`. Vercel Analytics/Speed Insights as root layout components.

**Tech Stack:** Next.js 14, TypeScript, Vercel

---

### Task 1: Fix OG Image References

All 10 pages reference `/images/hero.jpg` but only `hero.webp` exists. Fix all references and add a default OG image in root layout.

**Files:**
- Modify: `src/app/layout.tsx:29-33`
- Modify: `src/app/(public)/page.tsx:27`
- Modify: `src/app/(public)/about-us/page.tsx`
- Modify: `src/app/(public)/about-us/mission-value/page.tsx`
- Modify: `src/app/(public)/about-us/history/page.tsx`
- Modify: `src/app/(public)/articles/page.tsx`
- Modify: `src/app/(public)/support/page.tsx`
- Modify: `src/app/(public)/support/faq/page.tsx:13`
- Modify: `src/app/(public)/support/contact/page.tsx`
- Modify: `src/app/(public)/programs/page.tsx`
- Modify: `src/app/(public)/programs/scholarship/page.tsx`

- [ ] **Step 1: Add default OG image to root layout**

In `src/app/layout.tsx`, add a default OG image inside the `openGraph` object so all pages inherit it:

```typescript
openGraph: {
  type: "website",
  locale: "en_US",
  siteName: "Asian Doula Alliance",
  images: [{ url: '/images/hero.webp', width: 1200, height: 630 }],
},
```

- [ ] **Step 2: Fix all hero.jpg → hero.webp references**

In every file listed above, find `'/images/hero.jpg'` and replace with `'/images/hero.webp'`. There are exactly 10 files with this reference.

- [ ] **Step 3: Verify build**

Run: `cd /Users/sixumeng/Cooings-Brain/Projects/ada--website-rebuild/repo && npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/app/\(public\)/page.tsx src/app/\(public\)/about-us/page.tsx src/app/\(public\)/about-us/mission-value/page.tsx src/app/\(public\)/about-us/history/page.tsx src/app/\(public\)/articles/page.tsx src/app/\(public\)/support/page.tsx src/app/\(public\)/support/faq/page.tsx src/app/\(public\)/support/contact/page.tsx src/app/\(public\)/programs/page.tsx src/app/\(public\)/programs/scholarship/page.tsx
git commit -m "fix: correct OG image path from hero.jpg to hero.webp + add default OG image"
```

---

### Task 2: Add Viewport Export

**Files:**
- Modify: `src/app/layout.tsx:1`

- [ ] **Step 1: Add Viewport import and export**

At the top of `src/app/layout.tsx`, add `Viewport` to the import:

```typescript
import type { Metadata, Viewport } from "next";
```

After the `metadata` export (after line 34), add:

```typescript
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/sixumeng/Cooings-Brain/Projects/ada--website-rebuild/repo && npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "fix: add viewport export to root layout"
```

---

### Task 3: Create JSON-LD Helper Library

**Files:**
- Create: `src/lib/json-ld.ts`

- [ ] **Step 1: Create the JSON-LD helper file**

Create `src/lib/json-ld.ts` with all schema generators:

```typescript
const BASE_URL = 'https://asiandoula.org';

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Asian Doula Alliance',
    url: BASE_URL,
    logo: `${BASE_URL}/ada-logo.svg`,
    description:
      'Setting standards in postpartum care through culturally integrated training and certification.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '7515 Irvine Center Dr, #110',
      addressLocality: 'Irvine',
      addressRegion: 'CA',
      postalCode: '92618',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-714-202-6501',
      email: 'contact@asiandoula.org',
      contactType: 'customer service',
    },
    sameAs: ['https://www.instagram.com/asian_doula'],
  };
}

export function articleJsonLd(article: {
  title: string;
  excerpt?: string | null;
  author?: string | null;
  cover_image?: string | null;
  published_at?: string | null;
  updated_at?: string | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt || undefined,
    image: article.cover_image || undefined,
    author: {
      '@type': 'Organization',
      name: article.author || 'Asian Doula Alliance',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Asian Doula Alliance',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/ada-logo.svg` },
    },
    datePublished: article.published_at || undefined,
    dateModified: article.updated_at || article.published_at || undefined,
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

export function courseJsonLd(course: {
  name: string;
  description: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: 'Asian Doula Alliance',
      url: BASE_URL,
    },
    educationalLevel: 'Professional',
  };
}

export function breadcrumbJsonLd(
  segments: { name: string; path: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: segments.map((seg, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: seg.name,
      item: `${BASE_URL}${seg.path}`,
    })),
  };
}
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/sixumeng/Cooings-Brain/Projects/ada--website-rebuild/repo && npm run build`
Expected: Build succeeds (file is importable but not yet used).

- [ ] **Step 3: Commit**

```bash
git add src/lib/json-ld.ts
git commit -m "feat: add centralized JSON-LD schema helpers"
```

---

### Task 4: Apply Organization JSON-LD to Homepage

Replace the inline `jsonLd` object on the homepage with the centralized helper.

**Files:**
- Modify: `src/app/(public)/page.tsx:77-88`

- [ ] **Step 1: Add import**

At the top of `src/app/(public)/page.tsx`, add:

```typescript
import { organizationJsonLd } from '@/lib/json-ld';
```

- [ ] **Step 2: Replace inline jsonLd**

Remove the `const jsonLd = { ... }` block (lines 77-88) and replace the `dangerouslySetInnerHTML` with:

```typescript
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
/>
```

- [ ] **Step 3: Verify build**

Run: `cd /Users/sixumeng/Cooings-Brain/Projects/ada--website-rebuild/repo && npm run build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/app/\(public\)/page.tsx
git commit -m "refactor: use centralized organizationJsonLd on homepage"
```

---

### Task 5: Add Article JSON-LD to Blog Detail Page

**Files:**
- Modify: `src/app/(public)/articles/[slug]/page.tsx`

- [ ] **Step 1: Add import**

At the top of the file, add:

```typescript
import { articleJsonLd } from '@/lib/json-ld';
```

- [ ] **Step 2: Add JSON-LD script inside the page component**

In `ArticleDetailPage`, after the `if (!article) notFound();` line (line 55), and at the start of the return JSX (inside the `<article>` tag, before the breadcrumb nav), add:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(
      articleJsonLd({
        title: article.title,
        excerpt: article.excerpt,
        author: article.author,
        cover_image: article.cover_image,
        published_at: article.published_at,
        updated_at: article.updated_at,
      })
    ),
  }}
/>
```

- [ ] **Step 3: Verify build**

Run: `cd /Users/sixumeng/Cooings-Brain/Projects/ada--website-rebuild/repo && npm run build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/app/\(public\)/articles/\[slug\]/page.tsx
git commit -m "feat: add Article JSON-LD to blog detail pages"
```

---

### Task 6: Add FAQPage JSON-LD

The FAQ data lives in `src/app/(public)/support/faq/faq-content.tsx` as a client component. Since JSON-LD should be in the server-rendered page, we'll extract the data to a shared constant and import it in both places.

**Files:**
- Create: `src/app/(public)/support/faq/faq-data.ts`
- Modify: `src/app/(public)/support/faq/faq-content.tsx`
- Modify: `src/app/(public)/support/faq/page.tsx`

- [ ] **Step 1: Extract FAQ data to shared file**

Create `src/app/(public)/support/faq/faq-data.ts`:

```typescript
export const faqData = [
  {
    category: 'About ADA',
    items: [
      {
        q: 'What is the Asian Doula Alliance?',
        a: 'The Asian Doula Alliance (ADA) is a 501(c)(3) non-profit organization dedicated to setting standards in postpartum care through culturally integrated training, certification, and multilingual support. Founded in 2017, we are the leading certification body for doulas who serve Asian communities.',
      },
      {
        q: 'How is ADA different from other doula certification organizations?',
        a: 'ADA uniquely bridges traditional Asian postpartum practices — such as zuo yuezi (sitting the month), herbal care, and dietary customs — with modern evidence-based care. Our certification exams are available in 5 languages, and our certification is recognized by major insurance providers.',
      },
      {
        q: 'Is ADA only for Asian doulas?',
        a: 'No. ADA welcomes doulas of all backgrounds. Our certification emphasizes cultural competency and multilingual skills, but any passionate caregiver committed to providing culturally sensitive postpartum care can pursue ADA certification.',
      },
    ],
  },
  {
    category: 'Certification',
    items: [
      {
        q: 'How do I become ADA certified?',
        a: 'Three steps: (1) Enroll in an ADA-approved training program, (2) Complete the training, (3) Pass the ADA certification examination (60-minute written test + 30-minute practical evaluation).',
      },
      {
        q: 'What languages is the exam available in?',
        a: 'English, Mandarin Chinese, Japanese, and Korean.',
      },
      {
        q: 'How long is the certification valid?',
        a: 'ADA certification is valid for 1 year. Renewal costs $100 and requires either 3 professional reference letters or passing a recertification exam.',
      },
      {
        q: 'How much does certification cost?',
        a: 'The exam fee is $625. Training costs vary by program. Scholarships are available for qualified candidates.',
      },
    ],
  },
  {
    category: 'For Families',
    items: [
      {
        q: "How do I verify my doula's ADA certification?",
        a: "Use our online verification tool at asiandoula.org/verify. Enter the doula's name or certification number to confirm their status.",
      },
      {
        q: 'Does insurance cover ADA-certified doula services?',
        a: 'Many insurance providers cover doula services from ADA-certified doulas, including Medi-Cal, Kaiser, Cigna, Carrot Fertility, Blue Shield, and FSA/HSA accounts. Contact your insurance provider for specific coverage details.',
      },
      {
        q: 'How do I find an ADA-certified doula?',
        a: 'Visit our Find a Doula page or contact our partner Cooings Doula Care. You can also reach us directly at contact@asiandoula.org.',
      },
    ],
  },
  {
    category: 'Training',
    items: [
      {
        q: 'Where are training programs held?',
        a: 'Currently at 7515 Irvine Center Drive, #110, Irvine, CA 92618. We are exploring expansion to additional locations.',
      },
      {
        q: 'How long is the training program?',
        a: 'The intensive program runs 4-5 days, covering all essential skills for postpartum doula care.',
      },
      {
        q: 'Are there scholarships available?',
        a: 'Yes. ADA offers scholarships to aspiring doulas from underserved communities. Visit our Scholarship page for details.',
      },
    ],
  },
];
```

- [ ] **Step 2: Update faq-content.tsx to import from faq-data.ts**

In `src/app/(public)/support/faq/faq-content.tsx`, remove the entire `const faqData = [...]` block (lines 6-79) and replace with:

```typescript
import { faqData } from './faq-data';
```

- [ ] **Step 3: Add JSON-LD to the FAQ page**

In `src/app/(public)/support/faq/page.tsx`, add imports:

```typescript
import { faqJsonLd } from '@/lib/json-ld';
import { faqData } from './faq-data';
```

Then at the start of the return JSX (inside `<>`, before the Hero section), add:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(
      faqJsonLd(faqData.flatMap((cat) => cat.items))
    ),
  }}
/>
```

- [ ] **Step 4: Verify build**

Run: `cd /Users/sixumeng/Cooings-Brain/Projects/ada--website-rebuild/repo && npm run build`
Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/app/\(public\)/support/faq/faq-data.ts src/app/\(public\)/support/faq/faq-content.tsx src/app/\(public\)/support/faq/page.tsx
git commit -m "feat: add FAQPage JSON-LD with extracted faq-data module"
```

---

### Task 7: Add Course JSON-LD to Certification Pages

**Files:**
- Modify: `src/app/(public)/certifications/postpartum-doula/page.tsx`
- Modify: `src/app/(public)/certifications/birth-doula/page.tsx`
- Modify: `src/app/(public)/certifications/ibclc/page.tsx`

- [ ] **Step 1: Add Course JSON-LD to postpartum-doula page**

In `src/app/(public)/certifications/postpartum-doula/page.tsx`, add import:

```typescript
import { courseJsonLd } from '@/lib/json-ld';
```

At the start of the component's return JSX, add:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(
      courseJsonLd({
        name: 'ADA Postpartum Doula Certification',
        description:
          'The gold standard in culturally integrated postpartum care — recognized by 6 major insurance providers.',
      })
    ),
  }}
/>
```

- [ ] **Step 2: Add Course JSON-LD to birth-doula page**

Same pattern in `src/app/(public)/certifications/birth-doula/page.tsx`:

```typescript
import { courseJsonLd } from '@/lib/json-ld';
```

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(
      courseJsonLd({
        name: 'ADA Birth Doula Certification',
        description:
          'Culturally integrated training and certification for labor and delivery support.',
      })
    ),
  }}
/>
```

- [ ] **Step 3: Add Course JSON-LD to ibclc page**

Same pattern in `src/app/(public)/certifications/ibclc/page.tsx`:

```typescript
import { courseJsonLd } from '@/lib/json-ld';
```

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(
      courseJsonLd({
        name: 'ADA IBCLC Exam Prep',
        description:
          'Multilingual IBCLC exam preparation with culturally integrated lactation education.',
      })
    ),
  }}
/>
```

- [ ] **Step 4: Verify build**

Run: `cd /Users/sixumeng/Cooings-Brain/Projects/ada--website-rebuild/repo && npm run build`
Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/app/\(public\)/certifications/postpartum-doula/page.tsx src/app/\(public\)/certifications/birth-doula/page.tsx src/app/\(public\)/certifications/ibclc/page.tsx
git commit -m "feat: add Course JSON-LD to certification pages"
```

---

### Task 8: Add BreadcrumbList JSON-LD to Deep Pages

Apply breadcrumb structured data to pages with depth >= 2. Each page gets a `<script type="application/ld+json">` with `breadcrumbJsonLd()`.

**Files:**
- Modify: `src/app/(public)/certifications/postpartum-doula/page.tsx`
- Modify: `src/app/(public)/certifications/postpartum-doula/steps/page.tsx`
- Modify: `src/app/(public)/certifications/postpartum-doula/training/page.tsx`
- Modify: `src/app/(public)/certifications/postpartum-doula/exam/page.tsx`
- Modify: `src/app/(public)/certifications/birth-doula/page.tsx`
- Modify: `src/app/(public)/certifications/ibclc/page.tsx`
- Modify: `src/app/(public)/about-us/mission-value/page.tsx`
- Modify: `src/app/(public)/about-us/board/page.tsx`
- Modify: `src/app/(public)/about-us/board/election/page.tsx`
- Modify: `src/app/(public)/about-us/history/page.tsx`
- Modify: `src/app/(public)/for-doulas/renew/page.tsx`
- Modify: `src/app/(public)/for-doulas/code-of-conduct/page.tsx`
- Modify: `src/app/(public)/for-families/find-a-doula/page.tsx`
- Modify: `src/app/(public)/for-families/how-we-train/page.tsx`
- Modify: `src/app/(public)/support/faq/page.tsx`
- Modify: `src/app/(public)/support/contact/page.tsx`
- Modify: `src/app/(public)/programs/scholarship/page.tsx`

- [ ] **Step 1: Add breadcrumb JSON-LD to all certification subpages**

For each certification page, add `import { breadcrumbJsonLd } from '@/lib/json-ld';` (if not already imported from Task 7, just add `breadcrumbJsonLd` to the existing import).

Then add a `<script type="application/ld+json">` at the start of the component return.

**Postpartum Doula** (`certifications/postpartum-doula/page.tsx`) — already has `courseJsonLd` import, extend it:
```typescript
import { courseJsonLd, breadcrumbJsonLd } from '@/lib/json-ld';
```
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(
      breadcrumbJsonLd([
        { name: 'Certifications', path: '/certifications' },
        { name: 'Postpartum Doula', path: '/certifications/postpartum-doula' },
      ])
    ),
  }}
/>
```

**Steps** (`certifications/postpartum-doula/steps/page.tsx`):
```typescript
import { breadcrumbJsonLd } from '@/lib/json-ld';
```
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(
      breadcrumbJsonLd([
        { name: 'Certifications', path: '/certifications' },
        { name: 'Postpartum Doula', path: '/certifications/postpartum-doula' },
        { name: 'Steps to Certification', path: '/certifications/postpartum-doula/steps' },
      ])
    ),
  }}
/>
```

**Training** (`certifications/postpartum-doula/training/page.tsx`):
```tsx
breadcrumbJsonLd([
  { name: 'Certifications', path: '/certifications' },
  { name: 'Postpartum Doula', path: '/certifications/postpartum-doula' },
  { name: 'Find a Training', path: '/certifications/postpartum-doula/training' },
])
```

**Exam** (`certifications/postpartum-doula/exam/page.tsx`):
```tsx
breadcrumbJsonLd([
  { name: 'Certifications', path: '/certifications' },
  { name: 'Postpartum Doula', path: '/certifications/postpartum-doula' },
  { name: 'Exam Details', path: '/certifications/postpartum-doula/exam' },
])
```

**Birth Doula** (`certifications/birth-doula/page.tsx`) — extend existing import:
```tsx
breadcrumbJsonLd([
  { name: 'Certifications', path: '/certifications' },
  { name: 'Birth Doula', path: '/certifications/birth-doula' },
])
```

**IBCLC** (`certifications/ibclc/page.tsx`) — extend existing import:
```tsx
breadcrumbJsonLd([
  { name: 'Certifications', path: '/certifications' },
  { name: 'IBCLC Exam Prep', path: '/certifications/ibclc' },
])
```

- [ ] **Step 2: Add breadcrumb JSON-LD to about-us subpages**

For each about-us subpage, add import and breadcrumb script.

**Mission & Value** (`about-us/mission-value/page.tsx`):
```tsx
breadcrumbJsonLd([
  { name: 'About Us', path: '/about-us' },
  { name: 'Mission & Values', path: '/about-us/mission-value' },
])
```

**Board** (`about-us/board/page.tsx`):
```tsx
breadcrumbJsonLd([
  { name: 'About Us', path: '/about-us' },
  { name: 'Board', path: '/about-us/board' },
])
```

**Election** (`about-us/board/election/page.tsx`):
```tsx
breadcrumbJsonLd([
  { name: 'About Us', path: '/about-us' },
  { name: 'Board', path: '/about-us/board' },
  { name: 'Election', path: '/about-us/board/election' },
])
```

**History** (`about-us/history/page.tsx`):
```tsx
breadcrumbJsonLd([
  { name: 'About Us', path: '/about-us' },
  { name: 'History', path: '/about-us/history' },
])
```

- [ ] **Step 3: Add breadcrumb JSON-LD to remaining subpages**

**For Doulas / Renew** (`for-doulas/renew/page.tsx`):
```tsx
breadcrumbJsonLd([
  { name: 'For Doulas', path: '/for-doulas' },
  { name: 'Renew Certification', path: '/for-doulas/renew' },
])
```

**For Doulas / Code of Conduct** (`for-doulas/code-of-conduct/page.tsx`):
```tsx
breadcrumbJsonLd([
  { name: 'For Doulas', path: '/for-doulas' },
  { name: 'Code of Conduct', path: '/for-doulas/code-of-conduct' },
])
```

**For Families / Find a Doula** (`for-families/find-a-doula/page.tsx`):
```tsx
breadcrumbJsonLd([
  { name: 'For Families', path: '/for-families' },
  { name: 'Find a Doula', path: '/for-families/find-a-doula' },
])
```

**For Families / How We Train** (`for-families/how-we-train/page.tsx`):
```tsx
breadcrumbJsonLd([
  { name: 'For Families', path: '/for-families' },
  { name: 'How We Train', path: '/for-families/how-we-train' },
])
```

**Support / FAQ** (`support/faq/page.tsx`) — already modified in Task 6, extend import:
```typescript
import { faqJsonLd, breadcrumbJsonLd } from '@/lib/json-ld';
```
```tsx
breadcrumbJsonLd([
  { name: 'Support', path: '/support' },
  { name: 'FAQ', path: '/support/faq' },
])
```

**Support / Contact** (`support/contact/page.tsx`):
```tsx
breadcrumbJsonLd([
  { name: 'Support', path: '/support' },
  { name: 'Contact', path: '/support/contact' },
])
```

**Programs / Scholarship** (`programs/scholarship/page.tsx`):
```tsx
breadcrumbJsonLd([
  { name: 'Programs', path: '/programs' },
  { name: 'Scholarship', path: '/programs/scholarship' },
])
```

- [ ] **Step 4: Verify build**

Run: `cd /Users/sixumeng/Cooings-Brain/Projects/ada--website-rebuild/repo && npm run build`
Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add BreadcrumbList JSON-LD to all deep pages"
```

---

### Task 9: Add Apple Touch Icon and Web Manifest

**Files:**
- Create: `src/app/apple-touch-icon.png` (generated from icon.svg)
- Create: `src/app/manifest.ts`

- [ ] **Step 1: Generate apple-touch-icon.png**

The source SVG is at `src/app/icon.svg`. Use `sips` (macOS built-in) to convert:

```bash
cd /Users/sixumeng/Cooings-Brain/Projects/ada--website-rebuild/repo
# Export SVG to PNG at 180x180 using sips
# sips can't read SVG directly, so check if there's a PNG version in public/
# If not, we'll use the favicon.ico or create from the SVG using another method
```

If `sips` can't handle SVG, use this approach: copy a high-quality PNG export of the logo. As a fallback, create a simple reference in the layout. Check if there's any PNG logo in the project first:

```bash
find public/ src/ -name "*.png" | head -20
```

If a suitable logo PNG exists, resize it. Otherwise, we can reference the SVG via the manifest and skip the PNG for now (browsers will fall back to favicon.ico).

- [ ] **Step 2: Create manifest.ts**

Create `src/app/manifest.ts`:

```typescript
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Asian Doula Alliance',
    short_name: 'ADA',
    icons: [
      { src: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
    theme_color: '#606090',
    background_color: '#FFFAF5',
    display: 'browser',
  };
}
```

Note: If apple-touch-icon.png was successfully generated in Step 1, add it to the icons array:
```typescript
{ src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
```

- [ ] **Step 3: Verify build**

Run: `cd /Users/sixumeng/Cooings-Brain/Projects/ada--website-rebuild/repo && npm run build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/app/manifest.ts
# Include apple-touch-icon.png if generated
git commit -m "feat: add web manifest and apple-touch-icon"
```

---

### Task 10: Add Security Headers

**Files:**
- Modify: `next.config.mjs`

- [ ] **Step 1: Add headers function to next.config.mjs**

In `next.config.mjs`, add the `headers()` function inside `nextConfig`, after the `redirects()` function:

```javascript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    },
  ];
},
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/sixumeng/Cooings-Brain/Projects/ada--website-rebuild/repo && npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add next.config.mjs
git commit -m "feat: add security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy)"
```

---

### Task 11: Add Vercel Analytics and Speed Insights

**Files:**
- Modify: `package.json` (install deps)
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Install packages**

```bash
cd /Users/sixumeng/Cooings-Brain/Projects/ada--website-rebuild/repo
npm install @vercel/analytics @vercel/speed-insights
```

- [ ] **Step 2: Add components to root layout**

In `src/app/layout.tsx`, add imports at the top:

```typescript
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
```

Then inside `<body>`, after `<Toaster ... />`, add:

```tsx
<Analytics />
<SpeedInsights />
```

The body should look like:

```tsx
<body className={`${dmSerif.variable} ${outfit.variable} antialiased`}>
  {children}
  <Toaster position="top-right" richColors />
  <Analytics />
  <SpeedInsights />
</body>
```

- [ ] **Step 3: Verify build**

Run: `cd /Users/sixumeng/Cooings-Brain/Projects/ada--website-rebuild/repo && npm run build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/app/layout.tsx
git commit -m "feat: add Vercel Analytics and Speed Insights"
```

---

### Task 12: Performance Verification (Audit Only)

Verify existing patterns are correct. Fix only if issues found.

**Files:** (read-only audit, no planned modifications)

- [ ] **Step 1: Check image usage**

Grep for `<img` tags (should be `next/image` instead):

```bash
cd /Users/sixumeng/Cooings-Brain/Projects/ada--website-rebuild/repo
grep -rn '<img ' src/app/\(public\)/ --include="*.tsx" | grep -v 'node_modules'
```

If any `<img>` tags are found in public pages (not article content rendered via `dangerouslySetInnerHTML`), note them for fixing. Article content uses `<img>` via HTML — that's expected and acceptable.

- [ ] **Step 2: Check font loading**

Verify fonts use `next/font` in `src/app/layout.tsx`. Already confirmed: `DM_Serif_Display` and `Outfit` both use `next/font/google` with `display: "swap"`. No issues.

- [ ] **Step 3: Check above-fold images for priority**

Look at the Hero component for `priority` prop on the main hero image:

```bash
grep -n 'priority' src/components/public/hero.tsx
```

If the hero image doesn't have `priority={true}`, note it for fixing.

- [ ] **Step 4: Fix any issues found and commit**

If issues were found in steps 1-3, fix them and commit:

```bash
git add -A
git commit -m "perf: fix image optimization issues found in audit"
```

If no issues found, skip this step.
