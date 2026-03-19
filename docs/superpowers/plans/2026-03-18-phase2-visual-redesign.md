# Phase 2 Visual Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the AI-template aesthetic with a warm, inviting, human-designed visual identity using DM Serif Display + Outfit typography, corrected ADA purple (#606090), and varied section layouts.

**Architecture:** Pure visual overhaul — no route, API, or database changes. Tasks are ordered foundation-first: design system tokens → shared components → homepage → inner pages. Each task produces a buildable state.

**Tech Stack:** Next.js 14, Tailwind CSS 3, next/font/google (DM Serif Display, Outfit), Lucide React (functional icons only)

**Spec:** `docs/superpowers/specs/2026-03-18-phase2-visual-redesign.md`

---

## File Structure

**Modified files (design system):**
- `src/app/globals.css` — CSS custom properties (new palette)
- `tailwind.config.ts` — color tokens, font families, new tokens
- `src/app/layout.tsx` — Google Font imports swap
- `src/app/(public)/layout.tsx` — font class update

**Modified files (shared components):**
- `src/components/public/header.tsx` — restyle nav, pill CTA, mobile slide-in
- `src/components/public/footer.tsx` — Outfit typography, spacing
- `src/components/public/hero.tsx` — left-align, gradient, new CTAs, remove style jsx
- `src/components/public/counter.tsx` — Outfit typography
- `src/components/public/testimonial-carousel.tsx` — remove auto-rotate, hover arrows, restyle
- `src/components/public/contact-form.tsx` — remove gradient, lavender bg, pill buttons
- `src/components/public/scroll-animate.tsx` — no changes (usage removed from pages)
- `src/components/public/timeline.tsx` — Outfit + DM Serif, remove ScrollAnimate usage
- `src/components/public/sidebar-nav.tsx` — update active style, typography
- `src/components/public/steps.tsx` — lavender cards, numbered style, remove circle badge
- `src/components/public/article-card.tsx` — DM Serif title, rounded-xl, next/image
- `src/components/public/team-card.tsx` — no changes (section commented out)

**Modified files (pages):**
- `src/app/(public)/page.tsx` — full homepage restructure
- `src/app/(public)/about-us/page.tsx` — restyle, comment out team section
- `src/app/(public)/about-us/history/page.tsx` — restyle hero, remove ScrollAnimate
- `src/app/(public)/about-us/mission-value/page.tsx` — remove icon cards, simplify values
- `src/app/(public)/become-a-doula/layout.tsx` — update typography
- `src/app/(public)/become-a-doula/steps-to-certification/page.tsx` — remove value badges
- `src/app/(public)/articles/page.tsx` — restyle header with DM Serif

---

## Task 1: Design System Foundation

Update color tokens, fonts, and Tailwind config. Every subsequent task depends on this.

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Modify: `tailwind.config.ts`
- Modify: `src/app/(public)/layout.tsx`

- [ ] **Step 1: Update font imports in root layout**

Replace Poppins + Inter with DM Serif Display + Outfit in `src/app/layout.tsx`:

```tsx
import { DM_Serif_Display, Outfit } from "next/font/google";

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-dm-serif",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});
```

Remove the `poppins` and `inter` const blocks. Update the `<body>` className to use `${dmSerif.variable} ${outfit.variable}` instead of `${poppins.variable} ${inter.variable}`. Keep geistSans and geistMono (used by admin pages).

- [ ] **Step 2: Update CSS custom properties in globals.css**

Replace the `/* ADA Public Site Brand */` block at the bottom of `src/app/globals.css` with:

```css
/* ADA Public Site Brand */
:root {
  --ada-navy: #0c2231;
  --ada-navy-warm: #1a3346;
  --ada-purple: #606090;
  --ada-purple-hover: #6969C1;
  --ada-cream: #fdfcfa;
  --ada-lavender: #f8f7fc;
  --ada-off-white: #f8f8fa;
}
```

Add hero animation keyframes (replacing style jsx in hero.tsx later):

```css
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-hero-title {
  animation: fadeSlideUp 0.8s ease-out both;
}
.animate-hero-subtitle {
  animation: fadeSlideUp 0.8s ease-out 0.2s both;
}
.animate-hero-buttons {
  animation: fadeSlideUp 0.8s ease-out 0.4s both;
}
```

- [ ] **Step 3: Update Tailwind config**

Replace the `ada` color block and `fontFamily` in `tailwind.config.ts`:

```ts
ada: {
  navy: '#0c2231',
  'navy-warm': '#1a3346',
  purple: '#606090',
  'purple-hover': '#6969C1',
  cream: '#fdfcfa',
  lavender: '#f8f7fc',
  'off-white': '#f8f8fa',
},
```

Update fontFamily:

```ts
fontFamily: {
  'dm-serif': ['var(--font-dm-serif)', 'serif'],
  outfit: ['var(--font-outfit)', 'sans-serif'],
},
```

- [ ] **Step 4: Update public layout font class**

In `src/app/(public)/layout.tsx`, change `font-inter` to `font-outfit`:

```tsx
<div className="font-outfit min-h-screen flex flex-col">
```

- [ ] **Step 5: Verify build**

Run: `cd "/Users/sixumeng/Documents/Cooings-Brain/Business/Partnerships/asiandoula-org/Projects/website-rebuild/ada-website" && npm run build`

Expected: Build succeeds. Pages will look broken (wrong font references in components) — that's expected and fixed in subsequent tasks.

- [ ] **Step 6: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css tailwind.config.ts src/app/\(public\)/layout.tsx
git commit -m "feat: update design system — DM Serif Display + Outfit fonts, corrected ADA purple #606090, new color tokens"
```

---

## Task 2: Header & Footer Restyle

Update shared navigation and footer components to new design system.

**Files:**
- Modify: `src/components/public/header.tsx`
- Modify: `src/components/public/footer.tsx`

- [ ] **Step 1: Update Header typography and button style**

In `src/components/public/header.tsx`:

1. Replace all `font-poppins` with `font-outfit`
2. Change CTA button classes from `rounded-lg` to `rounded-full`
3. Change `bg-ada-purple` to `bg-ada-purple` (same token name, new hex via config)
4. Change `hover:bg-ada-purple-accent` to `hover:bg-ada-purple-hover`
5. Add arrow to CTA text: `Get Certified →` (not uppercase — uppercase is reserved for overline labels only)
6. Change `font-semibold` on CTA to `font-medium`
7. Replace `<img>` tags with `next/image` Image component for the logo (import Image from 'next/image', use `<Image src="/images/ada-logo.svg" alt="Asian Doula Alliance Logo" width={48} height={48} className="h-10 w-10 lg:h-12 lg:w-12" />`)

For mobile menu, add slide-in transition. Replace the conditional render `{mobileOpen && (` with a persistent div that slides:

```tsx
<div className={`lg:hidden fixed inset-0 top-16 bg-ada-navy z-40 transition-transform duration-300 ease-out ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
```

- [ ] **Step 2: Update Footer typography and spacing**

In `src/components/public/footer.tsx`:

1. Replace all `font-poppins` with `font-outfit`
2. Replace `<img>` with `next/image` Image component for logo
3. Change section padding from `py-12 lg:py-16` to `py-16 lg:py-20`
4. Change `hover:bg-ada-purple-accent` to `hover:bg-ada-purple-hover` (if any)

- [ ] **Step 3: Verify build**

Run: `cd "/Users/sixumeng/Documents/Cooings-Brain/Business/Partnerships/asiandoula-org/Projects/website-rebuild/ada-website" && npm run build`

Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/public/header.tsx src/components/public/footer.tsx
git commit -m "feat: restyle header and footer — Outfit font, pill CTA, next/image logo, mobile slide-in"
```

---

## Task 3: Hero Component Redesign

New hero with left-aligned text, gradient overlay, dual CTA buttons, and CSS animations moved to globals.css.

**Files:**
- Modify: `src/components/public/hero.tsx`

- [ ] **Step 1: Rewrite hero component**

Replace the entire `src/components/public/hero.tsx` with:

```tsx
'use client';

import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-end">
      {/* Background image with warm gradient overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(12,34,49,0.8), rgba(26,51,70,0.75))',
          }}
        />
      </div>

      {/* Content — left aligned */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-24 md:pb-32 lg:pb-40">
        <div className="max-w-[60%] max-lg:max-w-full">
          <h1 className="font-dm-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight animate-hero-title">
            Bridging Cultures, Supporting Moms, Celebrating Life
          </h1>

          <p className="mt-6 font-light text-lg md:text-xl text-white/55 max-w-2xl animate-hero-subtitle">
            Asian Doula Alliance is a 501(c)(3) non-profit dedicated to setting standards
            in postpartum care through culturally integrated training, certification,
            and multilingual support.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 animate-hero-buttons">
            <Link
              href="/become-a-doula/steps-to-certification"
              className="inline-flex items-center gap-2 rounded-full bg-ada-purple px-8 py-3 text-white font-medium transition-colors hover:bg-ada-purple-hover"
            >
              For Doulas
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link
              href="/become-a-doula/find-a-doula-training"
              className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-white/40 px-8 py-3 text-white font-medium transition-colors hover:bg-white/10"
            >
              For Families
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
```

Key changes: removed `style jsx` (animations now in globals.css from Task 1), `font-poppins` → `font-dm-serif`, `font-bold` removed (DM Serif is heavy at 400), button text changed, pill shape, subtitle `font-light`, max-w changed to `max-w-6xl`.

- [ ] **Step 2: Verify build**

Run: `cd "/Users/sixumeng/Documents/Cooings-Brain/Business/Partnerships/asiandoula-org/Projects/website-rebuild/ada-website" && npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/components/public/hero.tsx
git commit -m "feat: redesign hero — left-aligned, dual CTA, warm gradient, DM Serif heading"
```

---

## Task 4: Counter, Testimonial, Contact Components

Restyle the three remaining shared components.

**Files:**
- Modify: `src/components/public/counter.tsx`
- Modify: `src/components/public/testimonial-carousel.tsx`
- Modify: `src/components/public/contact-form.tsx`

- [ ] **Step 1: Restyle counter component**

In `src/components/public/counter.tsx`:

1. Add optional `className` prop for text color customization:

```tsx
interface CounterProps {
  target: number;
  label: string;
  suffix?: string;
  numberClassName?: string;
  labelClassName?: string;
}

export function Counter({ target, label, suffix = '+', numberClassName = 'text-ada-purple', labelClassName = 'text-ada-navy/70' }: CounterProps) {
```

2. Replace `font-poppins text-5xl md:text-6xl font-bold` with `font-outfit text-4xl md:text-5xl font-semibold`
3. Use the className props for text color: `${numberClassName}` and `${labelClassName}`
4. In the homepage stats band, pass `numberClassName="text-white"` and `labelClassName="text-white/60"` to each Counter.

This keeps the counter reusable on both light and dark backgrounds.

- [ ] **Step 2: Restyle testimonial carousel**

In `src/components/public/testimonial-carousel.tsx`:

1. Remove auto-rotation: delete the `useEffect` block with `setInterval` (lines 28-31)
2. Remove `useEffect` import if no longer needed (keep `useState`, `useCallback`)
3. Replace `font-poppins` with `font-dm-serif` on quote text
4. Change quote text classes to `text-xl md:text-2xl italic text-ada-navy leading-relaxed`
5. Replace `font-poppins font-bold` on name with `font-outfit font-medium`
6. Change `text-ada-navy/50` on role to `text-ada-navy/40`
7. Make arrow buttons `opacity-0 group-hover:opacity-100` — add `group` class to the outer container div
8. Change dot size from `w-2.5 h-2.5` to `w-2 h-2` and increase touch target with padding: wrap each dot button in a larger hit area or add `p-1.5` to the button
9. Change `bg-ada-purple` active dot to `bg-ada-purple`; inactive from `bg-ada-navy/20` to `bg-ada-navy/15`

- [ ] **Step 3: Restyle contact form**

In `src/components/public/contact-form.tsx`:

1. Remove the purple gradient background div: delete `<div className="absolute inset-0 bg-gradient-to-r from-ada-purple via-ada-purple-accent to-purple-300" />`
2. Remove `relative overflow-hidden` from the section, replace with `bg-ada-lavender`
3. Remove `relative z-10` from the inner div
4. Change max-width from `max-w-7xl` to `max-w-6xl`
5. Replace `font-poppins` with `font-dm-serif` on the heading
6. Change left column text colors from `text-white` to `text-ada-navy` and `text-white/80` to `text-ada-navy/60`
7. Remove icon circles (Phone, Mail, Clock divs with `bg-white/20`): just show the text directly, remove lucide imports
8. Change `text-white/60` labels to `text-ada-navy/40`
9. Change form button from `rounded-lg bg-ada-purple` to `rounded-full bg-ada-purple`, `font-semibold` to `font-medium`
10. Change `hover:bg-ada-purple-accent` to `hover:bg-ada-purple-hover`
11. Update form card: `rounded-2xl` → `rounded-xl`, keep `shadow-xl`
12. Change form input `focus:ring-ada-purple/40 focus:border-ada-purple` — these are fine, just update the class reference
13. Section padding: `py-20 md:py-28` → `py-24 md:py-32`

- [ ] **Step 4: Verify build**

Run: `cd "/Users/sixumeng/Documents/Cooings-Brain/Business/Partnerships/asiandoula-org/Projects/website-rebuild/ada-website" && npm run build`

- [ ] **Step 5: Commit**

```bash
git add src/components/public/counter.tsx src/components/public/testimonial-carousel.tsx src/components/public/contact-form.tsx
git commit -m "feat: restyle counter, testimonial, and contact — remove gradient, remove auto-rotate, DM Serif quotes"
```

---

## Task 5: Homepage Restructure

Rebuild the homepage layout with varied sections per spec.

**Files:**
- Modify: `src/app/(public)/page.tsx`

- [ ] **Step 1: Rewrite homepage**

Replace `src/app/(public)/page.tsx` entirely. Key structural changes:

1. **Remove all ScrollAnimate wrappers** — content renders immediately
2. **Remove all Lucide icon imports** (Star, BookOpen, GraduationCap, Award)
3. **Remove `values` array** with icon badges
4. **Section 1 (Who We Are)**: asymmetric grid `lg:grid-cols-[1.3fr_1fr]`, overline + DM Serif heading + prose left, photo right (`next/image`, `rounded-2xl`), `bg-ada-cream`
5. **Section 2 (Stats)**: full-width `bg-gradient-to-r from-ada-purple to-ada-purple-hover`, 3 counters inline, compact padding `py-12 md:py-16`
6. **Section 3 (Certification)**: asymmetric grid `lg:grid-cols-[1fr_1.3fr]`, 3 step cards left (`bg-ada-lavender rounded-xl`), heading + text + CTA right, `bg-white`
7. **Section 4 (Testimonial)**: centered quote, `bg-ada-cream`
8. **Section 5 (Contact)**: ContactForm component

The `certSteps` data array stays but is rendered as numbered cards, not as Link-wrapped cards with icons. Each step card:

```tsx
<div className="bg-ada-lavender rounded-xl p-5">
  <span className="font-outfit text-xl font-semibold text-ada-purple">
    {String(i + 1).padStart(2, '0')}
  </span>
  <h3 className="mt-2 font-outfit font-semibold text-ada-navy text-sm">
    {step.title}
  </h3>
  <p className="mt-1 text-ada-navy/50 text-sm">
    {step.description}
  </p>
</div>
```

For the Who We Are section image, use `next/image` with `src="/images/pict1.png"` (existing image) and `rounded-2xl`.

Replace all `font-poppins` with `font-dm-serif` (headings) or `font-outfit` (body).

All section padding: `py-24 md:py-32`. Max width: `max-w-6xl`.

Overline pattern for section labels:

```tsx
<span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
  WHO WE ARE
</span>
```

- [ ] **Step 2: Verify build**

Run: `cd "/Users/sixumeng/Documents/Cooings-Brain/Business/Partnerships/asiandoula-org/Projects/website-rebuild/ada-website" && npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/app/\(public\)/page.tsx
git commit -m "feat: restructure homepage — asymmetric layouts, purple stats band, no icons, varied sections"
```

---

## Task 6: About Us Pages

Restyle the about-us page and its sub-pages (history, mission-value).

**Files:**
- Modify: `src/app/(public)/about-us/page.tsx`
- Modify: `src/app/(public)/about-us/history/page.tsx`
- Modify: `src/app/(public)/about-us/mission-value/page.tsx`
- Modify: `src/components/public/timeline.tsx`

- [ ] **Step 1: Restyle about-us page**

In `src/app/(public)/about-us/page.tsx`:

1. Replace hero banner: remove fake gradient, use solid `bg-ada-navy`. Add overline `text-ada-purple-hover`. Change `font-poppins` → `font-dm-serif`, remove `font-bold`. Padding: `pt-32 pb-16 md:pt-40 md:pb-20`. Remove ScrollAnimate wrapper.
2. Who We Are section: replace `font-poppins` with `font-dm-serif` (heading) and remove `font-bold`. Remove highlight cards grid — replace with simple text + image asymmetric layout. Remove lucide icon imports (Heart, Globe, Award, Users). Remove `highlights` array.
3. Our Story section: keep centered narrow column. Update fonts. Remove ScrollAnimate. Change buttons to pill shape `rounded-full`, update hover classes.
4. **Comment out entire Team section** (the `<section>` from "Our Team" through the grid of TeamCards). Add comment: `{/* Team section hidden until real team data is available */}`
5. Remove `TeamCard` import and `teamMembers` array.
6. All sections: padding `py-24 md:py-32`, max-width `max-w-6xl`.

- [ ] **Step 2: Restyle history page**

In `src/app/(public)/about-us/history/page.tsx`:

1. Update hero banner same pattern as about-us: solid `bg-ada-navy`, overline, DM Serif heading, no ScrollAnimate, no fake gradient.
2. Remove `ScrollAnimate` import.
3. Section padding: `py-24 md:py-32`, `max-w-5xl` stays.

- [ ] **Step 3: Restyle timeline component**

In `src/components/public/timeline.tsx`:

1. Remove `ScrollAnimate` import and usage — remove all ScrollAnimate wrappers around timeline items.
2. Replace `font-poppins` with `font-dm-serif` (item titles) and `font-outfit` (year badges, description).
3. Year badge: keep `rounded-full` pill style, change `bg-ada-purple/10 text-ada-purple` colors (these are correct with new token).
4. Timeline line: `bg-ada-purple/20` is fine.

- [ ] **Step 4: Restyle mission-value page**

In `src/app/(public)/about-us/mission-value/page.tsx`:

1. Update hero banner: same pattern. Remove ScrollAnimate.
2. Mission section: keep centered `max-w-4xl`, overline + DM Serif heading + prose. Remove ScrollAnimate. Update fonts.
3. Vision section: same pattern.
4. **Core Values**: remove the icon card grid entirely. Remove `Heart, Shield, Star, BookOpen` imports. Replace `coreValues` array with a simpler structure (no `icon`, no `color`). Render as a simple list:

```tsx
<div className="space-y-6 max-w-3xl mx-auto">
  {coreValues.map((value, i) => (
    <div key={value.title} className="flex gap-4">
      <span className="font-outfit text-xl font-semibold text-ada-purple shrink-0">
        {String(i + 1).padStart(2, '0')}
      </span>
      <div>
        <h3 className="font-outfit font-semibold text-ada-navy">{value.title}</h3>
        <p className="mt-1 text-ada-navy/60 leading-relaxed">{value.description}</p>
      </div>
    </div>
  ))}
</div>
```

5. CTA section: `bg-ada-navy`, DM Serif heading, pill buttons. Remove ScrollAnimate.

- [ ] **Step 5: Verify build**

Run: `cd "/Users/sixumeng/Documents/Cooings-Brain/Business/Partnerships/asiandoula-org/Projects/website-rebuild/ada-website" && npm run build`

- [ ] **Step 6: Commit**

```bash
git add src/app/\(public\)/about-us/ src/components/public/timeline.tsx
git commit -m "feat: restyle about-us pages — DM Serif headings, numbered values, hidden team, clean timeline"
```

---

## Task 7: Become a Doula Pages

Restyle sidebar layout and all certification sub-pages.

**Files:**
- Modify: `src/app/(public)/become-a-doula/layout.tsx`
- Modify: `src/components/public/sidebar-nav.tsx`
- Modify: `src/components/public/steps.tsx`
- Modify: `src/app/(public)/become-a-doula/steps-to-certification/page.tsx`
- Modify: all other become-a-doula sub-pages

- [ ] **Step 1: Update become-a-doula layout**

In `src/app/(public)/become-a-doula/layout.tsx`:

1. Replace `font-poppins` with `font-dm-serif` on the "Become a Doula" heading.
2. Remove `font-semibold` (DM Serif doesn't need it).
3. Update max-width: `max-w-7xl` → `max-w-6xl`.

- [ ] **Step 2: Update sidebar-nav component**

In `src/components/public/sidebar-nav.tsx`:

1. Active state: change `border-ada-purple bg-ada-purple/5 text-ada-purple font-semibold` to `border-ada-purple bg-ada-lavender text-ada-purple font-medium`
2. Change `border-l-4` to `border-l-2`
3. Mobile pill active state: update `bg-ada-purple` stays, `font-semibold` → `font-medium`

- [ ] **Step 3: Restyle steps component**

In `src/components/public/steps.tsx`:

1. Replace the circular purple badge `w-10 h-10 rounded-full bg-ada-purple text-white` with a flat number: `font-outfit text-xl font-semibold text-ada-purple`
2. Replace `font-poppins font-semibold` on title with `font-outfit font-semibold`
3. Change card background: `border border-gray-200 rounded-xl` → `bg-ada-lavender rounded-xl border-0`
4. Keep the accordion expand/collapse behavior.

- [ ] **Step 4: Update steps-to-certification page**

In `src/app/(public)/become-a-doula/steps-to-certification/page.tsx`:

1. Remove the `values` array and the value badges JSX block.
2. Remove `ScrollAnimate` import and all wrappers.
3. Replace `font-poppins` with `font-dm-serif` on heading.
4. Update CTA card: change `bg-ada-purple/5` to `bg-ada-lavender`.
5. CTA button: `rounded-lg` → `rounded-full`, `font-semibold` → `font-medium`.
6. Change `hover:bg-ada-purple-accent` → `hover:bg-ada-purple-hover`.

- [ ] **Step 5: Update remaining become-a-doula sub-pages**

For each of these files, apply the same pattern:
- `src/app/(public)/become-a-doula/license-and-exam/page.tsx`
- `src/app/(public)/become-a-doula/renew-recertification/page.tsx`
- `src/app/(public)/become-a-doula/find-a-doula-training/page.tsx`
- `src/app/(public)/become-a-doula/code-of-conduct/page.tsx`

Changes for each:
1. Replace `font-poppins` → `font-dm-serif` (headings)
2. Remove any `ScrollAnimate` usage
3. Update button styles: `rounded-lg` → `rounded-full`, `font-semibold` → `font-medium`
4. Update `hover:bg-ada-purple-accent` → `hover:bg-ada-purple-hover`
5. Update any `bg-ada-purple/5` or `bg-ada-purple/10` background cards → `bg-ada-lavender`

- [ ] **Step 6: Verify build**

Run: `cd "/Users/sixumeng/Documents/Cooings-Brain/Business/Partnerships/asiandoula-org/Projects/website-rebuild/ada-website" && npm run build`

- [ ] **Step 7: Commit**

```bash
git add src/app/\(public\)/become-a-doula/ src/components/public/sidebar-nav.tsx src/components/public/steps.tsx
git commit -m "feat: restyle become-a-doula pages — lavender cards, numbered steps, pill buttons, DM Serif headings"
```

---

## Task 8: Articles Pages & Final Cleanup

Restyle articles list and detail pages, then do final cleanup pass.

**Files:**
- Modify: `src/app/(public)/articles/page.tsx`
- Modify: `src/components/public/article-card.tsx`
- Modify: `src/app/(public)/articles/[slug]/page.tsx`
- Modify: `src/app/(public)/articles/category-tabs.tsx`

- [ ] **Step 1: Restyle articles list page**

In `src/app/(public)/articles/page.tsx`:

1. Replace `font-poppins` → `font-dm-serif` on the "Articles & News" heading, remove `font-bold`.
2. Update max-width: `max-w-7xl` → `max-w-6xl`.
3. Add `pt-28` to account for fixed header.
4. Section padding: `py-16` → `py-24 md:py-32`.

- [ ] **Step 2: Restyle article card**

In `src/components/public/article-card.tsx`:

1. Replace `font-poppins font-semibold` on title with `font-dm-serif`.
2. Change `rounded-xl` to `rounded-xl` (keep).
3. Change `hover:text-ada-purple` → `hover:text-ada-purple` (same with new hex).
4. Replace `<img>` with `next/image` Image component. Import `Image` from `next/image`. For cover images from Supabase (external URLs), use `<Image src={cover_image} alt={title} width={640} height={400} className="w-full h-full object-cover ..." />`.
5. Remove the emoji placeholder `📄` — replace with a simple `bg-ada-lavender` div.
6. **Update `next.config.mjs`** to allow Supabase storage images. Add `images` config:

```js
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  async redirects() {
    // ... existing redirects
  },
};
```

- [ ] **Step 3: Update category tabs**

Read `src/app/(public)/articles/category-tabs.tsx` and update:
1. Replace any `font-poppins` with `font-outfit`
2. Update active tab styling to match design system (pill shape, ada-purple)

- [ ] **Step 4: Restyle article detail page**

Read `src/app/(public)/articles/[slug]/page.tsx` and update:
1. Replace `font-poppins` → `font-dm-serif` on article title
2. Ensure reading column uses `max-w-3xl`
3. Update any button/link styles to pill + ada-purple-hover

- [ ] **Step 5: Final cleanup — search for remaining old references**

Search the entire `src/` directory for:
1. `font-poppins` — should only exist in admin pages, not public
2. `font-inter` — same
3. `ada-purple-accent` — should be replaced with `ada-purple-hover`
4. `ada-red` — should not be used in public pages
5. `ada-burgundy` — should not be used
6. `ScrollAnimate` in public pages — should only remain in scroll-animate.tsx itself
7. Check `src/components/public/accordion.tsx` for old styling (font-poppins, ada-purple-accent, etc.)

Fix any remaining references in public-facing files.

- [ ] **Step 6: Verify build**

Run: `cd "/Users/sixumeng/Documents/Cooings-Brain/Business/Partnerships/asiandoula-org/Projects/website-rebuild/ada-website" && npm run build`

Expected: Clean build with no errors.

- [ ] **Step 7: Commit**

```bash
git add src/app/\(public\)/articles/ src/components/public/article-card.tsx src/components/public/accordion.tsx next.config.mjs
git commit -m "feat: restyle articles, final cleanup — complete Phase 2 visual redesign"
```
