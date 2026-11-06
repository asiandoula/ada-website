/**
 * Date helpers for public pages. Safe in server and client components.
 *
 * `exam_sessions.scheduled_date` is a Postgres DATE ("YYYY-MM-DD"). Never pass it
 * to `new Date()` and format in local time: "2026-12-05" is UTC midnight and
 * renders as 4 Dec in California. Everything here treats a DATE as a calendar
 * day (formatted in UTC), and "today" as the calendar day in Pacific time,
 * because ADA and its exam site are in Irvine, California.
 */
import type { Locale } from '@/i18n/config';

export const ADA_TIME_ZONE = 'America/Los_Angeles';

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Today's calendar date in Pacific time, as "YYYY-MM-DD". */
export function todayInPacific(now: Date = new Date()): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: ADA_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

/** "YYYY-MM-DD" → Date at UTC midnight (for formatting with timeZone: 'UTC'). */
export function parseIsoDate(iso: string): Date | null {
  const m = ISO_DATE.exec(iso.slice(0, 10));
  if (!m) return null;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Whole calendar days from `fromIso` to `toIso` (negative if `toIso` is earlier). */
export function daysBetween(fromIso: string, toIso: string): number | null {
  const a = parseIsoDate(fromIso);
  const b = parseIsoDate(toIso);
  if (!a || !b) return null;
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

/**
 * True from `days` days before `dateIso` up to and including the day itself
 * (KitC alert rule: show from 14 days before the exam until exam day).
 */
export function isWithinDays(dateIso: string, days: number, todayIso: string = todayInPacific()): boolean {
  const diff = daysBetween(todayIso, dateIso);
  return diff !== null && diff >= 0 && diff <= days;
}

const INTL_LOCALE: Record<Locale, string> = {
  'en': 'en-GB', // day-month order: "Sat 5 Dec 2026"
  'zh-cn': 'zh-CN',
  'zh-tw': 'zh-TW',
  'ja': 'ja-JP',
  'ko': 'ko-KR',
};

function parts(date: Date, locale: Locale, opts: Intl.DateTimeFormatOptions, timeZone: string) {
  const out: Record<string, string> = {};
  for (const p of new Intl.DateTimeFormat(INTL_LOCALE[locale] ?? 'en-GB', { ...opts, timeZone }).formatToParts(date)) {
    if (p.type !== 'literal') out[p.type] = p.value;
  }
  return out;
}

function formatDay(date: Date, locale: Locale, timeZone: string, withWeekday: boolean): string {
  if (locale === 'en') {
    const p = parts(date, locale, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }, timeZone);
    return withWeekday ? `${p.weekday} ${p.day} ${p.month} ${p.year}` : `${p.day} ${p.month} ${p.year}`;
  }
  const p = parts(date, locale, { weekday: 'short', day: 'numeric', month: 'numeric', year: 'numeric' }, timeZone);
  if (locale === 'ko') {
    const base = `${p.year}년 ${p.month}월 ${p.day}일`;
    return withWeekday ? `${base} (${p.weekday})` : base;
  }
  // zh-cn, zh-tw, ja: 2026年12月5日（周六）
  const base = `${p.year}年${p.month}月${p.day}日`;
  return withWeekday ? `${base}（${p.weekday}）` : base;
}

/**
 * A DATE column as page copy.
 *   en "Sat 5 Dec 2026" · zh-cn "2026年12月5日（周六）" · zh-tw "2026年12月5日（週六）"
 *   ja "2026年12月5日（土）" · ko "2026년 12월 5일 (토)"
 * Returns the input unchanged if it is not a valid YYYY-MM-DD string.
 */
export function formatExamDate(iso: string, locale: Locale, opts: { weekday?: boolean } = {}): string {
  const d = parseIsoDate(iso);
  if (!d) return iso;
  return formatDay(d, locale, 'UTC', opts.weekday ?? true);
}

/**
 * The record sheet's RETRIEVED stamp time, in Pacific time.
 *   en "THU 5 NOV 2026 · 10:42 PT" (the sheet sets it in uppercase mono)
 *   zh-cn "2026年11月5日（周四） · 10:42 PT"
 */
export function formatRetrievedAt(at: Date, locale: Locale): string {
  const day = formatDay(at, locale, ADA_TIME_ZONE, true);
  const t = parts(at, 'en', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }, ADA_TIME_ZONE);
  return `${locale === 'en' ? day.toUpperCase() : day} · ${t.hour}:${t.minute} PT`;
}
