# Exam System — Design Spec

**Date:** 2026-04-10
**Status:** Approved
**Scope:** Replicate Framer exam portal into Next.js with Admin session control, 5 languages

## Context

The Framer site has a practical exam portal at `/exam-home` used during in-person certification exams. It guides examinees through written and practical exam steps with countdown timers and audio instructions. This spec covers migrating it to the Next.js site with Admin session management.

The existing `/exam-home/exam-chs/[id]` (exam result lookup) system is unrelated and remains unchanged.

## 1. Route Structure

```
/exam-home                          → Language selector (5 languages)
/exam-home/[lang]                   → Exam entry: Part 1 / Part 2 selector
/exam-home/[lang]/written           → Written exam: rules → countdown
/exam-home/[lang]/practical         → Practical exam: 9 modules with steps
```

**`[lang]` values:** `en`, `zh-cn`, `zh-tw`, `ja`, `ko`

**Coexistence:** New routes use `/exam-home/[lang]/...`. Existing `/exam-home/exam-chs/[id]` is untouched (the `exam-chs` segment won't match any `[lang]` value).

All exam pages use a minimal layout (no site header/footer) — just the ADA logo, exam content, and copyright.

## 2. Admin Session Control

### Data Model

New `exam_sessions` table:

```sql
CREATE TABLE exam_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_code TEXT UNIQUE NOT NULL,         -- e.g. "IRV-20260410-001"
  exam_type TEXT NOT NULL DEFAULT 'postpartum',
  status TEXT NOT NULL DEFAULT 'pending',    -- pending / active / completed
  exam_part TEXT NOT NULL DEFAULT 'written', -- written / practical
  location TEXT,
  scheduled_date DATE NOT NULL,
  started_at TIMESTAMPTZ,
  duration_minutes INT NOT NULL DEFAULT 60,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

Only one active session at a time. Status flow: `pending` → `active` → `completed`.

### Admin UI

Add a "Sessions" tab to the existing `/admin/exams` page:

- **Create Session:** session code, date, location, exam type
- **Session Card:** shows current session with status badge + controls:
  - "Start Written Exam" → sets `status=active`, `exam_part=written`, records `started_at`
  - "Start Practical Exam" → sets `status=active`, `exam_part=practical`, records `started_at`
  - "End Exam" → sets `status=completed`
- **Session URL:** displays copyable URL `/exam-home/en?session=SESSION_CODE`

### Exam-side Connection

Exam pages read session status via API polling (every 5 seconds, GET `/api/exam-session?code=XXX`). When Admin clicks "Start", exam pages detect `status=active` and begin countdown automatically.

Without a session param, exam pages work in standalone mode with local-only countdown (manual start button).

### API Endpoint

`GET /api/exam-session?code=XXX` — returns session status, exam_part, started_at, duration_minutes. No auth required (read-only, no sensitive data).

`POST /api/exam-session` — Admin only (authenticated). Create/update session status.

## 3. Page Behavior

### Language Selector (`/exam-home`)

- Title: "ASIANDOULA" + "Examination Committee"
- Subtitle: "Certified Postpartum Doula Examination" + "产后导乐国际认证考试"
- 5 language cards (flags optional): English, 简体中文, 繁體中文, 日本語, 한국어
- Click → `/exam-home/[lang]?session=XXX` (preserves session param)

### Exam Entry (`/exam-home/[lang]`)

- Exam title (localized)
- "Organized by the Asian Doula Alliance Certification Board"
- Two cards: "Part 1: Written Exam" / "Part 2: Practical Exam"
- If session active, show session info (location, date) and current status

### Written Exam (`/exam-home/[lang]/written`)

Client component with two states:

**State 1 — Instructions:**
- 5 exam rules (localized):
  1. Exam duration: 1 hour
  2. No unrelated items in exam room
  3. Raise hand for procedural issues
  4. 15-minute warning before end
  5. Stop writing and submit when time expires
- Audio player (instruction audio)
- "Begin Exam" button

**State 2 — Exam Active:**
- Large countdown timer (from session `started_at` + `duration_minutes`, or local start)
- 15-minute warning highlight
- "Time's up!" message when countdown reaches 0

### Practical Exam (`/exam-home/[lang]/practical`)

Client component managing a linear flow through all modules and their sub-steps.

**9 Modules, 30+ steps total.** Each step shows:
- Module title (e.g. "第一项：心肺复苏 / Item 1: CPR")
- Scenario description
- Assessment requirements
- Duration and countdown timer
- Audio player (unique audio per step)
- Auto-advance to next step when timer expires (with 30s grace period showing "时间到!")
- "Next" button for manual advance

Module/step progression is linear — no skipping, no going back.

## 4. Exam Content Data

### Written Exam Rules (Chinese source, translate to 5 languages)

1. 考试时长为一小时
2. 请遵守考场纪律，严禁携带与考试无关的物品进入考场
3. 考试中遇到任何程序性问题请举手示意
4. 距离考试结束15分钟时，监考老师会统一进行提醒
5. 考试结束后请立即停笔并按照要求提交试卷

### Practical Exam Modules (9 modules, from Framer JS bundle)

#### Module 1: 心肺复苏 / CPR
- Scenario: 在客户家里，一名1个月大的新生儿突然失去意识，新生儿躺在地上，身体僵直，没有明显的呼吸起伏，情况十分危急。
- Requirement: 请按照标准急救流程，对模拟新生儿进行正确的心肺复苏操作。
- Duration: 120s
- Audio: `CXfhz12vqVd1BHRpa6nhhbv1h0.mp3`

#### Module 2: 异物梗塞急救 / Foreign Object First Aid
- Scenario: 在客户家里，一名1个月大的新生儿正在进食，突然剧烈咳嗽，随后无法发出声音，脸色迅速变得青紫。您需要立即采取措施，帮助新生儿恢复正常呼吸。
- Requirement: 请演示如何在新生儿发生气道梗阻时，正确实施急救。
- Duration: 120s
- Audio: `lpEVREc6tVHASrNAw77mm6le0.mp3`

#### Module 3: 呛奶处理 / Choking Treatment
- Scenario: 一名新生儿刚刚喝完奶，突然呼吸急促，疑似呛奶。家长抱着新生儿，慌乱无措地向您求助。您需要迅速判断情况，并采取正确的处理方式，确保新生儿安全。
- Requirement: 请展示如何处理新生儿呛奶情况，确保气道通畅并避免误吸风险。
- Duration: 60s
- Audio: `OIb2qlnNzbNiETSRTYFzIGK3ZwQ.mp3`

#### Module 4: 新生儿抱姿 / Newborn Carrying Position (3 sub-steps)
- Scenario: 请考生展示常见的新生儿抱姿：
- Sub-steps:
  1. 横抱 (Cradle hold) — 10s — Audio: `8LETJyUKAMLLrhGQMugWeLfP0.mp3`
  2. 竖抱 (Upright hold) — 10s — Audio: `nFtVYNMnfSnR4CzC4zQcl26ihtU.mp3`
  3. 飞机抱 (Airplane hold) — 10s — Audio: (silent, use default)

#### Module 5: 拍嗝技巧 / Burping Technique (3 sub-steps)
- Scenario: 请考生展示以下常见的新生儿拍嗝方法
- Sub-steps:
  1. 竖抱拍嗝 (Upright burping) — 15s — Audio: `OceCi5PwEE4Xm6IycZfQvm8DreI.mp3`
  2. 坐姿拍嗝 (Sitting burping) — 15s — Audio: `1rCOBQadkqYGxn8hSiInCTNPdPk.mp3`
  3. 摇嗝法 (Rocking method) — 15s — Audio: `QXWFBybNzxiSf4pEFxitcw4G8s.mp3`

#### Module 6: 婴儿洗澡 / Baby Baths (9 sub-steps)
- Scenario: 请根据屏幕上的提示，模拟完整的婴儿洗澡流程。
- Sub-steps:
  1. 第一步：物品准备 — 60s — Audio: `kKz91ihra3JWc4sKPTpDJZnc7x4.mp3`
  2. 第二步：脱纸尿裤与衣物 — 60s — Audio: `Bo4Zll5OEBXy3oWY5I4RU7B6AUU.mp3`
  3. 第三步：准备澡盆及调控水温 — 30s — Audio: `r02F6RqTMCyi9cR4tgJSJxYJmus.mp3`
  4. 第四步：洗头与洗脸 — 60s — Audio: `sIZO0VElEgSOZP8ooB3wrSCAkbs.mp3`
  5. 第五步：洗澡 — (no explicit duration, use 120s) — Audio: `pxJbdzQOrufqASxFlWq351gx0.mp3`
  6. 第六步：抚触护理 — 180s — Audio: `HVDtHUSIzNsvXekw0CbTBXJCY.mp3`
  7. 第七步：脐部护理 — 15s — Audio: `IJMv4xtYDFk0iVV7JpzG5jckDc.mp3`
  8. 第八步：臀部护理及包皮护理 — 60s — Audio: `FevRdA7XiBBQxUVeVVpAIdSjQ.mp3`
  9. 第九步：洗澡结束 — (穿衣打襁褓) — Audio: `lDM8M4BdzEQh1tvUqXNWDVkoy0.mp3`

#### Module 7: 婴儿排气操 / Baby Exhaustion Exercise
- Requirement: 请示范并口述五个及以上的标准的婴儿排气操动作，并简述每个动作的意义。
- Duration: (open, use 180s default)
- Audio: `N35n8IQgr0ZDw4inXyed1nY8Us.mp3`

#### Module 8: 亲喂姿势 / Breast Feeding Positions (5 sub-steps)
- Scenario: 请考生展示以下母乳妈妈的亲喂姿势
- Sub-steps:
  1. 摇篮式 (Cradle hold) — 15s — Audio: `soYEy2Uq2NseiTlTo50EOBLXiZY.mp3`
  2. 交叉式 (Cross-cradle) — 15s — Audio: `IqkJEh7urVynifANAArJlQMGiA.mp3`
  3. 橄榄球式 (Football hold) — 15s — Audio: `DVR6I98YOeNXjircdEDhyoN6eM.mp3`
  4. 侧卧式 (Side-lying) — 15s — Audio: `ZmCzg7fPgrxiebiwEwjKh1TxE.mp3`
  5. 半躺式 (Laid-back) — 15s — Audio: `CtNyLFheLZNYYrlKUx8PLYNk9x4.mp3`

#### Module 9: 泌乳实操 / Lactation Practices
- Requirement: 请您表述并示范通乳过程中常用的乳房按摩手法，不少于五种。在每种手法操作前，请简要说明该手法的名称、动作要领及其作用。
- Note: 操作应动作温和，体现专业性与规范性。
- Duration: (open, use 300s default)
- Audio: `9Pes1F2b8fQdDquDNyzp1FIRug.mp3`

### Written Exam Audio
- Instruction audio: `j8eTJz0wvYgFmyd61KlhslpZxc.mp3`

### Audio Hosting
Download all audio files from Framer CDN and host in `/public/audio/exam/`. This ensures long-term availability independent of Framer.

## 5. Multilingual Content

### File Structure

`src/lib/exam-content.ts` — single file exporting all exam content keyed by language.

```typescript
type ExamLang = 'en' | 'zh-cn' | 'zh-tw' | 'ja' | 'ko';

type PracticalStep = {
  title: string;
  subtitle?: string;        // sub-step name (e.g. "横抱")
  scenario: string;
  requirement: string;
  durationLabel: string;
  durationSeconds: number;
  audio: string;             // filename in /audio/exam/
};

type PracticalModule = {
  title: string;
  englishTitle: string;
  steps: PracticalStep[];
};

type ExamContent = {
  // UI strings
  ui: {
    examTitle: string;
    committee: string;
    organizedBy: string;
    part1: string;
    part2: string;
    writtenExam: string;
    practicalExam: string;
    beginExam: string;
    nextStep: string;
    timeUp: string;
    timeRemaining: string;
    scenarioLabel: string;
    requirementLabel: string;
    durationLabel: string;
  };
  writtenRules: string[];
  modules: PracticalModule[];
};
```

**Translation approach:** Chinese is the source language (from Framer). English titles already exist in the Framer data. For `zh-tw`, `ja`, `ko`: provide best-effort translations of UI strings; module content stays in simplified Chinese with English titles (these are professional exam terms that don't need full translation — the exam is administered by bilingual proctors).

## 6. Component Architecture

```
src/app/(public)/exam-home/
  layout.tsx                    — minimal exam layout (logo + copyright, no site nav)
  page.tsx                      — language selector
  [lang]/
    page.tsx                    — exam entry (Part 1 / Part 2)
    written/
      page.tsx                  — WrittenExam client component (instructions → countdown)
    practical/
      page.tsx                  — PracticalExam client component (module stepper)

src/lib/exam-content.ts         — all hardcoded exam content (5 languages)
src/components/exam/
  countdown-timer.tsx           — reusable countdown with 15-min warning
  audio-player.tsx              — simple audio player (play/pause, progress bar)
  exam-session-provider.tsx     — context provider for session polling

src/app/api/exam-session/
  route.ts                      — GET (read session) + POST (create/update, admin only)

src/app/admin/(authenticated)/exams/
  sessions/
    page.tsx                    — session management UI
```

## 7. Out of Scope

- Online quiz / auto-grading (no multiple choice questions)
- Student login or identity verification on exam pages
- Exam result recording (existing Admin system handles this separately)
- Video content (Framer had video players but content was audio-only)
- Full professional translation of exam content to all 5 languages (UI strings yes, medical exam scenarios kept in Chinese + English)
