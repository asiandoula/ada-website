# ADA Website Phase 2 — Visual Redesign Spec

## Overview

Visual overhaul of the asiandoula.org public site. All page routes and functionality stay the same; every page gets a new visual design that replaces the current AI-template aesthetic with a warm, inviting, human-designed feel.

**Scope**: Visual overhaul (B) — keep routes, redesign layouts and styles per page.
**Fidelity to Framer**: Take the best (C) — inherit ADA purple and warmth, but design something better.
**Personality**: Warm & Inviting (B) — soft corners, warm tints, pill buttons, nurturing.

## Design System

### Typography

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Headings | DM Serif Display | 400 | Never bold — the font is heavy enough at regular |
| Body | Outfit | 300–500 | 300 for large hero subtitles, 400 for body, 500 for emphasis |
| Buttons | Outfit | 400–500 | Lighter than typical — intentionally thin |
| Overline/Label | Outfit | 600 | `letter-spacing: 0.1em`, `text-transform: uppercase` |

Both fonts are free Google Fonts.

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `ada-purple` | `#606090` | Primary buttons, overlines, stats band, step numbers |
| `ada-purple-hover` | `#6969C1` | Button hover, link hover |
| `ada-navy` | `#0c2231` | Hero/Header/Footer background, heading text |
| `ada-navy-warm` | `#1a3346` | Hero gradient endpoint |
| `cream` | `#fdfcfa` | Warm section background |
| `lavender-light` | `#f8f7fc` | Purple-tinted section background, step cards |
| `white` | `#ffffff` | Default section background |
| `off-white` | `#f8f8fa` | Quote/neutral section background |

**Removed colors** (from current implementation):
- `#662d91` — wrong purple, replaced by `#606090`
- `#ed1c24` (ada-red) — remove from palette, not used in redesign
- `#260a00` (ada-burgundy) — remove, not used
- Tailwind `purple-300` — never use default Tailwind purples

### Buttons

- **Primary**: `bg-ada-purple text-white rounded-full`, Outfit 400, `hover:bg-ada-purple-hover`
- **Outline**: `border-1.5 border-ada-navy text-ada-navy rounded-full bg-transparent`
- **Hero outline**: `border-1.5 border-white/40 text-white rounded-full bg-transparent`
- All buttons include `→` arrow suffix
- No `font-semibold` or `font-bold` on buttons — keep them light

### Border Radius

| Element | Radius |
|---------|--------|
| Photos, large containers | `rounded-2xl` (16px) |
| Cards, form containers | `rounded-xl` (12px) |
| Buttons | `rounded-full` (pill) |
| Form inputs | `rounded-lg` (8px) |

### Spacing

- Section vertical padding: `py-24 md:py-32`
- Max content width: `max-w-6xl` (1152px)
- Consistent use of `gap-20` between major grid items

### Icons

- **Remove all Lucide icons** from content sections (Star, Heart, Globe, Award, BookOpen, GraduationCap, etc.)
- **Keep Lucide only for functional UI**: hamburger menu (Menu/X), chevrons (ChevronDown), carousel arrows (ChevronLeft/ChevronRight)
- Typography, numbers, and layout carry visual hierarchy — not icons

### Images

- All images must use `next/image` component (no `<img>` tags, no CSS `background-image` for content images)
- Photos get `rounded-2xl`
- Hero background is the one exception — uses CSS background-image with gradient overlay

## Homepage Design

### 1. Header (fixed nav)

- Background: `ada-navy`, height `h-16 lg:h-20`
- Left: Logo SVG + "ASIAN DOULA ALLIANCE" (Outfit 600, tracking-wide)
- Center: Nav links "About" / "Certification" with dropdown menus
- Right: Pill button "Get Certified →" (primary purple)
- Mobile: Hamburger → full-screen overlay with slide-in animation
- Structure stays the same; styles updated to match design system

### 2. Hero — full viewport, left-aligned

- Background: `hero.jpg` + `linear-gradient(135deg, rgba(12,34,49,0.8), rgba(26,51,70,0.75))`
- Text left-aligned within `max-w-[60%]`
- H1: DM Serif Display, `text-4xl md:text-5xl lg:text-6xl`
- Subtitle: Outfit 300, `text-lg md:text-xl`, `text-white/55`
- Two pill buttons: "For Doulas →" (primary purple) + "For Families →" (white outline)
- Entry animation: staggered fadeSlideUp on title → subtitle → buttons
- This is the only section with entry animations

### 3. Who We Are — asymmetric two-column

- Background: `cream` (#fdfcfa)
- Left column (wider): Overline "WHO WE ARE" + DM Serif heading + two paragraphs of Outfit body text
- Right column: Rounded photo (`rounded-2xl`)
- No icons, no cards — pure text + image
- Grid: `grid-cols-[1.3fr_1fr]` at `lg:` breakpoint, stacked below `lg:`
- All asymmetric grids use `lg:` as the breakpoint for two-column → stacked

### 4. Stats Band — full-width purple gradient

- Background: `linear-gradient(135deg, #606090, #6969c1)`
- Three stats centered inline: `164+` / `5` / `6`
- Numbers: Outfit 600, `text-4xl`, white
- Labels: Outfit 400, `text-sm`, `text-white/60`
- Counter animation preserved (scroll-triggered, one of the approved key animations)
- Compact section — less vertical padding than other sections

### 5. Path to Certification — asymmetric two-column (reversed)

- Background: `white`
- Left column: 3 step cards stacked vertically
  - Each card: `lavender-light` background, `rounded-xl`, padded
  - Large number "01" / "02" / "03" in Outfit 600, `text-xl`, `ada-purple`
  - Title (Outfit 600) + one-line description (Outfit 400)
- Right column (wider): Overline "CERTIFICATION" + DM Serif heading + body text + pill button "Learn More →"
- No Lucide icons on steps

### 6. Testimonial — centered large quote

- Background: `cream` (#fdfcfa)
- Quote: DM Serif Display italic, `text-xl md:text-2xl`, centered, `max-w-2xl`
- Attribution: "— Name, Role" in Outfit 400
- Dot indicators for pagination
- Arrow buttons appear on hover only
- **No auto-rotation** — manual navigation only (WCAG 2.2.2 fix)

### 7. Contact — two-column form

- Background: `lavender-light` (#f8f7fc)
- Left column: DM Serif heading "Get in Touch" + Outfit body text + contact info (phone, email, hours)
- Right column: White form card (`rounded-xl`, subtle shadow)
  - Input fields: `rounded-lg`, light border
  - Submit: pill button, primary purple
- **No purple gradient** — replaced by subtle lavender background
- Contact info displayed as plain text, no icon circles

### 8. Footer

- Structure unchanged (4-column grid)
- Typography updated to Outfit
- Spacing increased for breathing room
- Bottom bar: centered copyright

## Inner Page Design Rules

### Inner Page Hero Banner (shared by all inner pages)

- Background: `ada-navy` solid (no fake gradient)
- Padding: `pt-32 pb-16 md:pt-40 md:pb-20` (shorter than homepage hero)
- Centered: Overline (page category) + DM Serif title + Outfit subtitle
- Overline: Outfit 600, `text-sm`, `text-ada-purple-hover` (#6969C1 — lighter purple reads well on navy)

### About Us Page

- Who We Are: asymmetric two-column (text + rounded photo), same pattern as homepage
- Our Story: centered narrow column (`max-w-3xl`), pure prose, no cards
- Team section: **comment out the entire Team section in JSX** until real team data is available (current placeholder names like "Executive Director" look unfinished)
- Highlight cards: remove Lucide icons, replace with purple numbering or bold text
- CTA buttons: pill shape, same as homepage

### About Us Sub-pages (History, Mission & Values)

- **History**: Timeline component preserved, restyle with Outfit + DM Serif
- **Mission & Values**:
  - Remove four-color icon cards (rose/blue/amber/emerald backgrounds)
  - Mission section: centered `max-w-3xl`, overline + DM Serif heading + prose
  - Vision section: same pattern, alternate background
  - Core Values: simple list — purple number + bold name + one-sentence description per value
- CTA: navy background band + centered text + pill button

### Become a Doula Sub-pages (sidebar layout)

- Sidebar + content area structure preserved
- Sidebar: active item indicated by purple left border (`border-l-2 border-ada-purple`)
- Content: breadcrumb → DM Serif page title → Outfit body
- Steps component: matches homepage style (numbered cards, `lavender-light`, `rounded-xl`)
- **Remove duplicate value badges** (already on homepage)
- CTA card: `lavender-light` background, `rounded-xl`

### Articles

- List page: category tabs + article card grid preserved
- Card style: `rounded-xl`, subtle shadow on hover, title in DM Serif
- Detail page: narrow reading column `max-w-3xl`, table-of-contents sidebar preserved

### Universal Rules

- No Lucide icons in content (only functional UI icons)
- All buttons: pill shape, Outfit 400–500
- Section backgrounds: rotate white / cream / lavender-light / off-white; occasional navy for CTA bands
- All images: `next/image` component, `rounded-2xl`
- No `style jsx` — all animations via Tailwind classes or globals.css keyframes

## Animation Policy

- **Hero only**: staggered fadeSlideUp on title → subtitle → buttons
- **Stats counter**: scroll-triggered number count-up (existing implementation preserved)
- **Hover states**: all interactive elements get smooth color transitions (`transition-colors`)
- **No ScrollAnimate wrapper** on content sections — content appears immediately
- **Mobile menu**: slide-in transition (new, currently instant show/hide)
- Everything else: static. Let typography and layout carry the page.

## Technical Changes

### Files to modify

- `globals.css` — update CSS custom properties to new palette
- `tailwind.config.ts` — update `ada` color tokens, add new tokens, update font families
- `src/app/layout.tsx` — swap Google Font imports (DM Serif Display + Outfit)
- `src/app/(public)/layout.tsx` — update font class
- `src/components/public/header.tsx` — restyle, add mobile slide-in
- `src/components/public/footer.tsx` — restyle with Outfit, spacing
- `src/components/public/hero.tsx` — new CTA text, left-align, gradient, pill buttons
- `src/components/public/counter.tsx` — restyle typography
- `src/components/public/testimonial-carousel.tsx` — remove auto-rotate, restyle, hover arrows
- `src/components/public/contact-form.tsx` — remove purple gradient, new layout
- `src/components/public/scroll-animate.tsx` — keep but stop using it on most sections
- `src/app/(public)/page.tsx` — restructure all sections per spec
- `src/app/(public)/about-us/page.tsx` — restyle, hide team placeholder
- `src/app/(public)/about-us/mission-value/page.tsx` — remove icon cards, simplify
- `src/app/(public)/about-us/history/page.tsx` — restyle timeline
- `src/app/(public)/become-a-doula/steps-to-certification/page.tsx` — remove value badges, restyle steps
- All other become-a-doula sub-pages — apply sidebar + typography changes
- `src/app/(public)/articles/page.tsx` — restyle cards
- `src/app/(public)/articles/[slug]/page.tsx` — restyle reading view

### Files to delete or deprecate

- Remove `scroll-animate.tsx` usage from most pages (keep component for potential future use)
- Remove unused Lucide icon imports from all pages

### Dependencies

- No new npm packages needed
- Google Fonts swap: remove Poppins + Inter, add DM Serif Display + Outfit
- Consider adding `next/font/google` for DM Serif Display and Outfit (better than link tag)

## Out of Scope

- No changes to admin pages
- No changes to exam system pages
- No changes to API routes or database
- No new features — purely visual
- No content rewriting beyond CTA button text
