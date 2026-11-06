/**
 * Locale formatting for the About and Families pages, so lists and dates are
 * built from facts in code and never typed into a message string.
 */
import type { Locale } from '@/i18n/config';

const INTL_LOCALE: Record<Locale, string> = {
  'en': 'en-GB', // "A, B and C" (no serial comma), "August 2024"
  'zh-cn': 'zh-CN', // "A、B和C", "2024年8月"
  'zh-tw': 'zh-TW',
  'ja': 'ja-JP',
  'ko': 'ko-KR',
};

export function asLocale(value: string): Locale {
  return (value in INTL_LOCALE ? value : 'en') as Locale;
}

/** ["Medi-Cal", "Kaiser", "Cigna"] → "Medi-Cal, Kaiser and Cigna" / "Medi-Cal、Kaiser和Cigna". */
export function formatList(items: readonly string[], locale: Locale, type: 'conjunction' | 'disjunction' = 'conjunction'): string {
  return new Intl.ListFormat(INTL_LOCALE[locale], { style: 'long', type }).format(items);
}

/** "2024-08" → "August 2024" / "2024年8月". */
export function formatMonth(yearMonth: string, locale: Locale): string {
  const [y, m] = yearMonth.split('-').map(Number);
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(y, (m || 1) - 1, 1))
  );
}
