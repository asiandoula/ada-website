# Exam System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an in-person exam portal with language selection, written/practical exam flows with countdown timers and audio, plus admin session control.

**Architecture:** Hardcoded exam content in `src/lib/exam-content.ts` (5 languages). Client-side exam pages poll a Supabase `exam_sessions` table for admin-controlled start/stop. Audio files hosted in `/public/audio/exam/`. Admin manages sessions from a new tab in `/admin/exams`.

**Tech Stack:** Next.js 14 App Router, TypeScript, Supabase, Tailwind CSS

**Spec:** `docs/superpowers/specs/2026-04-10-exam-system-design.md`

---

## File Structure

```
# New files
src/lib/exam-content.ts                              — All exam content (5 langs, modules, UI strings)
src/components/exam/countdown-timer.tsx               — Countdown component with 15-min warning
src/components/exam/audio-player.tsx                  — Simple audio play/pause with progress
src/app/(public)/exam-home/page.tsx                   — Language selector (REPLACE existing)
src/app/(public)/exam-home/[lang]/page.tsx            — Exam entry (Part 1 / Part 2)
src/app/(public)/exam-home/[lang]/written/page.tsx    — Written exam (instructions → countdown)
src/app/(public)/exam-home/[lang]/practical/page.tsx  — Practical exam (module stepper)
src/app/api/exam-session/route.ts                     — GET/POST session status
src/app/admin/(authenticated)/exams/sessions/page.tsx — Admin session management
supabase/migrations/015_exam_sessions.sql             — New table
public/audio/exam/                                    — Audio files (downloaded from Framer)
```

```
# Modified files
src/app/(public)/exam-home/layout.tsx                 — Add minimal exam layout chrome
src/app/admin/(authenticated)/exams/page.tsx           — Add "Sessions" tab link
```

```
# Unchanged (coexists)
src/app/(public)/exam-home/exam-chs/[id]/             — Existing exam result lookup
```

---

### Task 1: Download Audio Files from Framer CDN

**Files:**
- Create: `public/audio/exam/` directory with all MP3 files

- [ ] **Step 1: Create audio directory and download all files**

```bash
cd /Users/sixumeng/Cooings-Brain/Projects/ada--website-rebuild/repo
mkdir -p public/audio/exam

# Written exam instruction audio
curl -o public/audio/exam/written-instructions.mp3 "https://framerusercontent.com/assets/j8eTJz0wvYgFmyd61KlhslpZxc.mp3"

# Practical exam instruction audio
curl -o public/audio/exam/practical-instructions.mp3 "https://framerusercontent.com/assets/CXfhz12vqVd1BHRpa6nhhbv1h0.mp3"

# Module 1: CPR
curl -o public/audio/exam/m1-cpr.mp3 "https://framerusercontent.com/assets/ktEMgtfmpXSlQfoaHzHfVvKE.mp3"

# Module 2: Foreign Object First Aid
curl -o public/audio/exam/m2-foreign-object.mp3 "https://framerusercontent.com/assets/lpEVREc6tVHASrNAw77mm6le0.mp3"

# Module 3: Choking Treatment
curl -o public/audio/exam/m3-choking.mp3 "https://framerusercontent.com/assets/OIb2qlnNzbNiETSRTYFzIGK3ZwQ.mp3"

# Module 4: Newborn Carrying - step 1 (横抱)
curl -o public/audio/exam/m4-carry-cradle.mp3 "https://framerusercontent.com/assets/8LETJyUKAMLLrhGQMugWeLfP0.mp3"
# Module 4: step 2 (竖抱)
curl -o public/audio/exam/m4-carry-upright.mp3 "https://framerusercontent.com/assets/nFtVYNMnfSnR4CzC4zQcl26ihtU.mp3"
# Module 4: step 3 (飞机抱) — no unique audio, reuse default
curl -o public/audio/exam/m4-carry-airplane.mp3 "https://framerusercontent.com/assets/737jMndEwHAdy0XSyRj7UV8yU.mp3"

# Module 5: Burping - step 1 (竖抱拍嗝)
curl -o public/audio/exam/m5-burp-upright.mp3 "https://framerusercontent.com/assets/OceCi5PwEE4Xm6IycZfQvm8DreI.mp3"
# Module 5: step 2 (坐姿拍嗝)
curl -o public/audio/exam/m5-burp-sitting.mp3 "https://framerusercontent.com/assets/1rCOBQadkqYGxn8hSiInCTNPdPk.mp3"
# Module 5: step 3 (摇嗝法)
curl -o public/audio/exam/m5-burp-rocking.mp3 "https://framerusercontent.com/assets/QXWFBybNzxiSf4pEFxitcw4G8s.mp3"

# Module 6: Baby Bath - 9 steps
curl -o public/audio/exam/m6-bath-s1-prep.mp3 "https://framerusercontent.com/assets/kKz91ihra3JWc4sKPTpDJZnc7x4.mp3"
curl -o public/audio/exam/m6-bath-s2-undress.mp3 "https://framerusercontent.com/assets/Bo4Zll5OEBXy3oWY5I4RU7B6AUU.mp3"
curl -o public/audio/exam/m6-bath-s3-water.mp3 "https://framerusercontent.com/assets/r02F6RqTMCyi9cR4tgJSJxYJmus.mp3"
curl -o public/audio/exam/m6-bath-s4-wash-head.mp3 "https://framerusercontent.com/assets/sIZO0VElEgSOZP8ooB3wrSCAkbs.mp3"
curl -o public/audio/exam/m6-bath-s5-wash-body.mp3 "https://framerusercontent.com/assets/pxJbdzQOrufqASxFlWq351gx0.mp3"
curl -o public/audio/exam/m6-bath-s6-massage.mp3 "https://framerusercontent.com/assets/HVDtHUSIzNsvXekw0CbTBXJCY.mp3"
curl -o public/audio/exam/m6-bath-s7-umbilical.mp3 "https://framerusercontent.com/assets/IJMv4xtYDFk0iVV7JpzG5jckDc.mp3"
curl -o public/audio/exam/m6-bath-s8-diaper.mp3 "https://framerusercontent.com/assets/FevRdA7XiBBQxUVeVVpAIdSjQ.mp3"
curl -o public/audio/exam/m6-bath-s9-finish.mp3 "https://framerusercontent.com/assets/lDM8M4BdzEQh1tvUqXNWDVkoy0.mp3"

# Module 7: Baby Gas Exercise
curl -o public/audio/exam/m7-gas-exercise.mp3 "https://framerusercontent.com/assets/N35n8IQgr0ZDw4inXyed1nY8Us.mp3"

# Module 8: Breastfeeding Positions - 5 steps
curl -o public/audio/exam/m8-bf-cradle.mp3 "https://framerusercontent.com/assets/soYEy2Uq2NseiTlTo50EOBLXiZY.mp3"
curl -o public/audio/exam/m8-bf-cross.mp3 "https://framerusercontent.com/assets/IqkJEh7urVynifANAArJlQMGiA.mp3"
curl -o public/audio/exam/m8-bf-football.mp3 "https://framerusercontent.com/assets/DVR6I98YOeNXjircdEDhyoN6eM.mp3"
curl -o public/audio/exam/m8-bf-sidelying.mp3 "https://framerusercontent.com/assets/ZmCzg7fPgrxiebiwEwjKh1TxE.mp3"
curl -o public/audio/exam/m8-bf-laidback.mp3 "https://framerusercontent.com/assets/CtNyLFheLZNYYrlKUx8PLYNk9x4.mp3"

# Module 9: Lactation Practices
curl -o public/audio/exam/m9-lactation.mp3 "https://framerusercontent.com/assets/9Pes1F2b8fQdDquDNyzp1FIRug.mp3"
```

- [ ] **Step 2: Verify all files downloaded**

```bash
ls -la public/audio/exam/ | wc -l
# Expected: 28 files (26 module audios + 2 instruction audios)
ls -la public/audio/exam/
# Verify all files have non-zero size
```

- [ ] **Step 3: Commit**

```bash
git add public/audio/exam/
git commit -m "assets: download exam audio files from Framer CDN"
```

---

### Task 2: Create Exam Content Data File

**Files:**
- Create: `src/lib/exam-content.ts`

- [ ] **Step 1: Create the exam content file with types and Chinese content**

Create `src/lib/exam-content.ts` with full type definitions and `zh-cn` content. This file contains ALL exam data — UI strings, written exam rules, and all 9 practical modules with their sub-steps.

The file must export:
- `type ExamLang` — union of 5 language codes
- `type PracticalStep` — single exam step with title, scenario, requirement, duration, audio
- `type PracticalModule` — module with array of steps
- `type ExamContent` — complete content for one language (ui strings + written rules + modules)
- `const EXAM_LANGS` — array of `{code, label, nativeLabel}` for all 5 languages
- `function getExamContent(lang: ExamLang): ExamContent` — returns content for a language

Content source: the spec at `docs/superpowers/specs/2026-04-10-exam-system-design.md` section 4 has all 9 modules with their exact Chinese text, sub-steps, durations, and audio filenames.

For non-Chinese languages:
- `en`: translate UI strings to English. Module `englishTitle` fields are already in the spec. Keep scenario/requirement in Chinese (bilingual exam).
- `zh-tw`: same content as `zh-cn` but with traditional Chinese UI strings.
- `ja`: Japanese UI strings, module content in Chinese.
- `ko`: Korean UI strings, module content in Chinese.

Audio paths use format: `/audio/exam/FILENAME.mp3` (from Task 1).

- [ ] **Step 2: Verify build**

Run: `cd /Users/sixumeng/Cooings-Brain/Projects/ada--website-rebuild/repo && npm run build`
Expected: Compiles successfully.

- [ ] **Step 3: Commit**

```bash
git add src/lib/exam-content.ts
git commit -m "feat: add exam content data file with 5-language support"
```

---

### Task 3: Create Countdown Timer Component

**Files:**
- Create: `src/components/exam/countdown-timer.tsx`

- [ ] **Step 1: Create the countdown timer component**

Create `src/components/exam/countdown-timer.tsx` — a client component that:

Props:
```typescript
{
  durationSeconds: number;        // total duration in seconds
  startedAt?: string;             // ISO timestamp — if provided, calculates remaining from this
  onTimeUp?: () => void;          // callback when timer reaches 0
  warningAtSeconds?: number;      // show warning state (default: 900 = 15 min)
  size?: 'sm' | 'lg';            // sm for module steps, lg for written exam
}
```

Behavior:
- If `startedAt` provided: remaining = `durationSeconds - (now - startedAt)`. If already expired, show 0.
- If no `startedAt`: counts down from `durationSeconds` starting when component mounts.
- Displays `MM:SS` format (or `HH:MM:SS` if >= 1 hour).
- When remaining <= `warningAtSeconds`, text turns `text-red-500` and pulses.
- When reaches 0, calls `onTimeUp` and displays "Time's up! 时间到！".
- Uses `useEffect` with `setInterval(1000)`.

Styling: `lg` shows large centered timer (text-6xl), `sm` shows inline timer (text-2xl). Use existing project styles (`font-dm-serif`, `text-ada-navy`, etc.).

- [ ] **Step 2: Verify build**

Run: `cd /Users/sixumeng/Cooings-Brain/Projects/ada--website-rebuild/repo && npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/components/exam/countdown-timer.tsx
git commit -m "feat: add countdown timer component with warning state"
```

---

### Task 4: Create Audio Player Component

**Files:**
- Create: `src/components/exam/audio-player.tsx`

- [ ] **Step 1: Create the audio player component**

Create `src/components/exam/audio-player.tsx` — a client component.

Props:
```typescript
{
  src: string;         // audio file path e.g. "/audio/exam/m1-cpr.mp3"
  autoPlay?: boolean;  // default false
}
```

Behavior:
- Play/pause toggle button (use `lucide-react` `Play` and `Pause` icons).
- Progress bar showing current position / total duration.
- Time display: `0:00 / 1:34` format.
- Uses native `<audio>` element ref.
- Styled as a compact horizontal bar: `rounded-lg bg-zinc-100 p-3 flex items-center gap-3`.

- [ ] **Step 2: Verify build**

Run: `cd /Users/sixumeng/Cooings-Brain/Projects/ada--website-rebuild/repo && npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/components/exam/audio-player.tsx
git commit -m "feat: add audio player component for exam pages"
```

---

### Task 5: Update Exam Layout

**Files:**
- Modify: `src/app/(public)/exam-home/layout.tsx`

- [ ] **Step 1: Update the exam layout with minimal chrome**

Replace `src/app/(public)/exam-home/layout.tsx` with a minimal exam layout that has:
- ADA logo at top center (use `/ada-logo.svg`, height 40px)
- Children in the middle
- Footer: "© 2025 Asian Doula Alliance | All rights reserved." centered at bottom
- Background: white, min-height: 100vh
- Keep the existing metadata (robots noindex)

```tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Exam',
  robots: { index: false, follow: false },
};

export default function ExamLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="py-6 flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/ada-logo.svg" alt="Asian Doula Alliance" className="h-10" />
      </header>
      <main className="flex-1">{children}</main>
      <footer className="py-4 text-center text-xs text-zinc-400">
        © 2025 Asian Doula Alliance | All rights reserved.
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/sixumeng/Cooings-Brain/Projects/ada--website-rebuild/repo && npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/app/\(public\)/exam-home/layout.tsx
git commit -m "feat: update exam layout with minimal chrome"
```

---

### Task 6: Language Selector Page

**Files:**
- Modify: `src/app/(public)/exam-home/page.tsx` (replace existing content)

- [ ] **Step 1: Replace the exam-home page with language selector**

The current `src/app/(public)/exam-home/page.tsx` does NOT exist as a page (only `exam-chs/[id]/page.tsx` exists). Create `src/app/(public)/exam-home/page.tsx` as a server component:

- Title: "ASIANDOULA" in large tracking-wide text (Poppins-style, use `font-outfit font-medium text-3xl tracking-[0.08em] text-ada-purple`)
- Subtitle: "Examination Committee" in smaller tracking-wide text
- Main heading: "Certified Postpartum Doula Examination"
- Chinese subtitle: "产后导乐国际认证考试"
- "Organized by the Asian Doula Alliance Certification Board"
- Instruction: "🌐 Please Select Exam Language:"
- 5 language buttons in a column, each linking to `/exam-home/[lang]`:
  - English → `/exam-home/en`
  - 简体中文 (Simplified Chinese) → `/exam-home/zh-cn`
  - 繁體中文 (Traditional Chinese) → `/exam-home/zh-tw`
  - 日本語 (Japanese) → `/exam-home/ja`
  - 한국어 (Korean) → `/exam-home/ko`
- If URL has `?session=XXX` query param, preserve it in all language links.
- Center everything vertically and horizontally. Max-width 600px.

Read the `searchParams` prop to get the session code and pass it through.

- [ ] **Step 2: Verify build**

Run: `cd /Users/sixumeng/Cooings-Brain/Projects/ada--website-rebuild/repo && npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/app/\(public\)/exam-home/page.tsx
git commit -m "feat: add exam language selector page"
```

---

### Task 7: Exam Entry Page (Part 1 / Part 2 Selector)

**Files:**
- Create: `src/app/(public)/exam-home/[lang]/page.tsx`

- [ ] **Step 1: Create the exam entry page**

Create `src/app/(public)/exam-home/[lang]/page.tsx` as a server component.

- Validate `lang` param is one of `en|zh-cn|zh-tw|ja|ko`. If not, `notFound()`.
- Import `getExamContent` from `@/lib/exam-content` and get localized content.
- Display:
  - Exam title (localized)
  - "Organized by the Asian Doula Alliance Certification Board" (localized)
  - Two large cards side by side:
    - **Card 1:** "Part I" + localized "Written Exam" title → links to `/exam-home/[lang]/written`
    - **Card 2:** "Part II" + localized "Practical Exam" title → links to `/exam-home/[lang]/practical`
  - Preserve `?session=XXX` in both links.
- Cards styled as `rounded-2xl border border-gray-200 p-8 hover:shadow-lg transition cursor-pointer` with `Link` wrapper.
- Center content, max-width 800px.

- [ ] **Step 2: Verify build**

Run: `cd /Users/sixumeng/Cooings-Brain/Projects/ada--website-rebuild/repo && npm run build`

- [ ] **Step 3: Commit**

```bash
git add "src/app/(public)/exam-home/[lang]/page.tsx"
git commit -m "feat: add exam entry page with part 1/2 selector"
```

---

### Task 8: Written Exam Page

**Files:**
- Create: `src/app/(public)/exam-home/[lang]/written/page.tsx`

- [ ] **Step 1: Create the written exam page**

Create `src/app/(public)/exam-home/[lang]/written/page.tsx` as a `'use client'` component.

Two states managed by `useState<'instructions' | 'active'>`:

**Instructions state:**
- Title: "第一部分 笔试考试 / Part I Written Examination" (localized)
- Subtitle: "笔试考试须知" (localized)
- Audio player component with the written instruction audio
- 5 exam rules displayed as numbered list (from `getExamContent(lang).writtenRules`)
- "Begin Exam" button at bottom → switches to `active` state

**Active state:**
- Large countdown timer (`<CountdownTimer size="lg" durationSeconds={3600} />`)
- Timer centered on page
- "Part I: Written Examination" title above timer

Session integration:
- Read `session` from URL searchParams (`useSearchParams`).
- If session provided, poll `/api/exam-session?code=XXX` every 5 seconds.
- When session status becomes `active` and `exam_part === 'written'`, auto-switch to active state and use `startedAt` from session for countdown sync.

If no session param, exam starts when user clicks "Begin Exam" with local-only countdown.

- [ ] **Step 2: Verify build**

Run: `cd /Users/sixumeng/Cooings-Brain/Projects/ada--website-rebuild/repo && npm run build`

- [ ] **Step 3: Commit**

```bash
git add "src/app/(public)/exam-home/[lang]/written/page.tsx"
git commit -m "feat: add written exam page with instructions and countdown"
```

---

### Task 9: Practical Exam Page

**Files:**
- Create: `src/app/(public)/exam-home/[lang]/practical/page.tsx`

- [ ] **Step 1: Create the practical exam page**

Create `src/app/(public)/exam-home/[lang]/practical/page.tsx` as a `'use client'` component.

This is the most complex page. It manages a linear stepper through all modules and sub-steps.

State:
```typescript
const [phase, setPhase] = useState<'instructions' | 'active'>('instructions');
const [currentStep, setCurrentStep] = useState(0);  // index into flattened step array
```

**Instructions phase:**
- Title: "第二部分 实操考试 / Part II Practical Examination" (localized)
- "实操考试流程说明" subtitle
- "考试共9项考核模块。每项考核模块有具体的考核内容和时间限制。请按照提示依次完成。" (localized)
- Audio player with practical instruction audio
- "Begin Exam" button → switches to `active` phase

**Active phase:**
- Flatten all modules into a linear array of steps. For example, Module 4 has 3 sub-steps, Module 6 has 9 sub-steps, etc. Total ~30 steps.
- Display current step:
  - Module title (e.g. "第一项：心肺复苏 / Item 1: CPR")
  - If sub-step, show sub-step name (e.g. "横抱")
  - "情景描述：" + scenario text
  - "考核要求：" + requirement text
  - "考核时间：" + duration label
  - Audio player (auto-play)
  - Countdown timer for this step's duration
  - When timer expires: show "时间到！" for 30 seconds (grace period), then auto-advance
  - "Next" button for manual advance
- Progress indicator: "Step X / Y" at top
- When all steps complete: show "考试结束 / Exam Complete" message

Flattening logic: iterate `content.modules`, for each module iterate `module.steps`. Build a flat array with module context attached to each step.

- [ ] **Step 2: Verify build**

Run: `cd /Users/sixumeng/Cooings-Brain/Projects/ada--website-rebuild/repo && npm run build`

- [ ] **Step 3: Commit**

```bash
git add "src/app/(public)/exam-home/[lang]/practical/page.tsx"
git commit -m "feat: add practical exam page with module stepper"
```

---

### Task 10: Database Migration for exam_sessions

**Files:**
- Create: `supabase/migrations/015_exam_sessions.sql`

- [ ] **Step 1: Create the migration file**

Create `supabase/migrations/015_exam_sessions.sql`:

```sql
-- Exam sessions for admin-controlled exam management
CREATE TABLE IF NOT EXISTS exam_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_code TEXT UNIQUE NOT NULL,
  exam_type TEXT NOT NULL DEFAULT 'postpartum',
  status TEXT NOT NULL DEFAULT 'pending',
  exam_part TEXT NOT NULL DEFAULT 'written',
  location TEXT,
  scheduled_date DATE NOT NULL,
  started_at TIMESTAMPTZ,
  duration_minutes INT NOT NULL DEFAULT 60,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Allow authenticated users (admins) full access
ALTER TABLE exam_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage exam sessions" ON exam_sessions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow anonymous read access (exam pages need to poll status)
CREATE POLICY "Anyone can read exam sessions" ON exam_sessions
  FOR SELECT
  TO anon
  USING (true);
```

- [ ] **Step 2: Run migration against production Supabase**

Run this migration via the Supabase dashboard SQL editor or CLI. The project uses direct SQL migrations (not Supabase CLI migrations).

```bash
# If using psql:
# psql $DATABASE_URL -f supabase/migrations/015_exam_sessions.sql
```

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/015_exam_sessions.sql
git commit -m "feat: add exam_sessions table migration"
```

---

### Task 11: Exam Session API

**Files:**
- Create: `src/app/api/exam-session/route.ts`

- [ ] **Step 1: Create the API route**

Create `src/app/api/exam-session/route.ts`:

**GET handler:** Public — reads session by `code` query param.

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 });

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('exam_sessions')
    .select('*')
    .eq('session_code', code)
    .single();

  if (error || !data) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

  return NextResponse.json(data);
}
```

**POST handler:** Admin only — creates or updates a session.

```typescript
export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  const body = await request.json();
  const { action, ...fields } = body;

  if (action === 'create') {
    const { data, error } = await supabase
      .from('exam_sessions')
      .insert({
        session_code: fields.session_code,
        exam_type: fields.exam_type || 'postpartum',
        location: fields.location,
        scheduled_date: fields.scheduled_date,
        duration_minutes: fields.duration_minutes || 60,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  }

  if (action === 'start') {
    const { data, error } = await supabase
      .from('exam_sessions')
      .update({
        status: 'active',
        exam_part: fields.exam_part,
        started_at: new Date().toISOString(),
      })
      .eq('id', fields.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  }

  if (action === 'end') {
    const { data, error } = await supabase
      .from('exam_sessions')
      .update({ status: 'completed' })
      .eq('id', fields.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/sixumeng/Cooings-Brain/Projects/ada--website-rebuild/repo && npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/app/api/exam-session/route.ts
git commit -m "feat: add exam session API (GET/POST)"
```

---

### Task 12: Admin Session Management Page

**Files:**
- Create: `src/app/admin/(authenticated)/exams/sessions/page.tsx`
- Modify: `src/app/admin/(authenticated)/exams/page.tsx` (add link)

- [ ] **Step 1: Create the admin sessions page**

Create `src/app/admin/(authenticated)/exams/sessions/page.tsx` as a `'use client'` component.

Features:
- "Create Session" form: session code (auto-generated as `IRV-YYYYMMDD-001`), date picker, location text input, exam type select (postpartum/birth), duration minutes input (default 60).
- Session list: table of all sessions with status badges.
- For the current active/pending session, show control panel:
  - "Start Written Exam" button → POST `/api/exam-session` with `action: 'start', exam_part: 'written'`
  - "Start Practical Exam" button → POST with `action: 'start', exam_part: 'practical'`
  - "End Exam" button → POST with `action: 'end'`
  - Copyable exam URL: `/exam-home/en?session=SESSION_CODE`
- Use existing admin patterns: `createClient()` from `@/lib/supabase/client`, `Button`, `Badge`, `Input` from `@/components/ui/`.
- Refresh data after each action.

- [ ] **Step 2: Add link from exams page**

In `src/app/admin/(authenticated)/exams/page.tsx`, add a "Sessions" link button next to the existing "+ Record Exam" button in the header:

```tsx
<Link href="/admin/exams/sessions">
  <Button variant="outline">
    Exam Sessions
  </Button>
</Link>
```

- [ ] **Step 3: Verify build**

Run: `cd /Users/sixumeng/Cooings-Brain/Projects/ada--website-rebuild/repo && npm run build`

- [ ] **Step 4: Commit**

```bash
git add "src/app/admin/(authenticated)/exams/sessions/page.tsx" "src/app/admin/(authenticated)/exams/page.tsx"
git commit -m "feat: add admin exam session management page"
```

---

### Task 13: Integration Test — Full Flow Verification

- [ ] **Step 1: Verify all pages load**

Start the dev server and manually test:

```bash
cd /Users/sixumeng/Cooings-Brain/Projects/ada--website-rebuild/repo && npm run dev
```

Test these URLs:
- `http://localhost:3000/exam-home` — language selector loads, 5 language buttons visible
- `http://localhost:3000/exam-home/zh-cn` — exam entry page, Part 1/Part 2 cards
- `http://localhost:3000/exam-home/zh-cn/written` — instructions page with rules and audio player
- `http://localhost:3000/exam-home/zh-cn/practical` — instructions page with module overview and audio
- `http://localhost:3000/exam-home/en` — English version loads with translated UI
- `http://localhost:3000/exam-home/exam-chs/test` — existing exam result page still works (coexistence)
- `http://localhost:3000/admin/exams` — has "Exam Sessions" link
- `http://localhost:3000/admin/exams/sessions` — session management page loads

- [ ] **Step 2: Test written exam countdown**

- Click "Begin Exam" on written page
- Verify countdown starts at 60:00 and counts down
- Verify 15-minute warning state triggers

- [ ] **Step 3: Test practical exam flow**

- Click "Begin Exam" on practical page
- Verify first module shows (心肺复苏 / CPR)
- Verify audio plays
- Verify countdown shows 2:00 and counts down
- Click "Next" to advance through several steps
- Verify module transitions work

- [ ] **Step 4: Final build check**

```bash
cd /Users/sixumeng/Cooings-Brain/Projects/ada--website-rebuild/repo && npm run build
```

Expected: Build succeeds. Only pre-existing admin prerender errors (Supabase env vars).
