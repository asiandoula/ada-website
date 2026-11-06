/**
 * Server side of the exam-language copy (see src/components/exam/exam-copy.tsx).
 * The exam screens follow the [lang] route segment, not the site cookie, so
 * the `examHome` namespace is loaded for that language and for English.
 */
import { createTranslator } from 'next-intl';
import { loadMessages } from '@/i18n/request';
import { locales, type Locale } from '@/i18n/config';
import type { ExamLang } from '@/lib/exam-content';

type Messages = Record<string, unknown>;
type Values = Record<string, string | number>;
export type ExamTranslate = (key: string, values?: Values) => string;

export const EXAM_LANG_CODES: readonly ExamLang[] = ['en', 'zh-cn', 'zh-tw', 'ja', 'ko'];

export function isExamLang(lang: string): lang is ExamLang {
  return (EXAM_LANG_CODES as readonly string[]).includes(lang);
}

/** The exam language as a site Locale (they share codes); English if unknown. */
export function examLocale(lang: string): Locale {
  return (locales as readonly string[]).includes(lang) ? (lang as Locale) : 'en';
}

/** The `examHome` namespace bodies for `lang` and English. */
export async function loadExamMessages(lang: Locale): Promise<{ own: Messages; en: Messages }> {
  const [own, en] = await Promise.all([loadMessages(lang), loadMessages('en')]);
  return { own: (own.examHome ?? {}) as Messages, en: (en.examHome ?? {}) as Messages };
}

function translator(locale: Locale, body: Messages): ExamTranslate {
  const t = createTranslator({ locale, messages: { examHome: body }, namespace: 'examHome' });
  return (key, values) => (t as unknown as ExamTranslate)(key, values);
}

export async function getExamCopy(lang: Locale): Promise<{ lang: Locale; t: ExamTranslate; en: ExamTranslate }> {
  const { own, en } = await loadExamMessages(lang);
  return { lang, t: translator(lang, own), en: translator('en', en) };
}
