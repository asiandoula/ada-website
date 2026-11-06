/**
 * Page-level helpers for the /certifications pages (Direction C, 2026-11).
 * Every figure still comes from src/lib/facts.ts or the code; this file only
 * formats them for messages.
 */
import type { Locale } from '@/i18n/config';
import { PROGRAM_LANGUAGES, PROFICIENCY_LEVELS } from '@/lib/facts';
import { generateCertificateNumber } from '@/lib/utils';

/** The graded ADA training photos were taken in August 2024 (direction-C §9). */
const PHOTO_TAKEN = Date.UTC(2024, 7, 1);

const INTL_LOCALE: Record<Locale, string> = {
  'en': 'en-GB',
  'zh-cn': 'zh-CN',
  'zh-tw': 'zh-TW',
  'ja': 'ja-JP',
  'ko': 'ko-KR',
};

/** Photo caption date: en "August 2024" · zh-cn "2024年8月". */
export function photoDate(locale: Locale): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale] ?? 'en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(PHOTO_TAKEN);
}

/** "English, Chinese (Mandarin), Japanese and Korean" in the page's language. */
export function languageList(locale: Locale, name: (code: string) => string): string {
  const names = PROGRAM_LANGUAGES.map((l) => name(l.code));
  return new Intl.ListFormat(INTL_LOCALE[locale] ?? 'en-GB', { style: 'long', type: 'conjunction' }).format(names);
}

/**
 * Certificate number prefixes as generateCertificateNumber() in src/lib/utils.ts
 * writes them ("ADA-PD-2026-0142" → "ADA-PD"), so the page can never drift
 * from the numbers the admin actually issues.
 */
function prefixOf(type: 'postpartum' | 'birth'): string {
  return generateCertificateNumber(type, 0).split('-').slice(0, 2).join('-');
}

export const CERT_PREFIX = {
  postpartum: prefixOf('postpartum'),
  birth: prefixOf('birth'),
} as const;

/** The number pattern shown to candidates, e.g. "ADA-PD-YYYY-NNNN". */
export function certFormat(type: 'postpartum' | 'birth'): string {
  return `${CERT_PREFIX[type]}-YYYY-NNNN`;
}

/** The two letters after "ADA-", e.g. "PD". */
export function certCode(type: 'postpartum' | 'birth'): string {
  return CERT_PREFIX[type].split('-')[1];
}

/** Proficiency cutoffs from PROFICIENCY_LEVELS (90+ / 70–89 / below 70). */
export function proficiencyArgs() {
  const high = PROFICIENCY_LEVELS.find((l) => l.key === 'highlyProficient')!;
  const proficient = PROFICIENCY_LEVELS.find((l) => l.key === 'proficient')!;
  return {
    high: high.min,
    proficientTop: (proficient.below ?? high.min) - 1,
  };
}
