'use client';

/**
 * Exam-day copy follows the EXAM language (the [lang] route segment the
 * candidate chose), not the site cookie locale. The [lang] layout loads the
 * `examHome` namespace for that language and for English and provides both
 * here; client screens read them with useExamCopy().
 *
 * Outside a provider (no [lang] segment) it falls back to the site locale.
 */
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { createTranslator, useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/config';
import { BiText } from './bi-text';

type Messages = Record<string, unknown>;
type Values = Record<string, string | number>;
export type ExamTranslate = (key: string, values?: Values) => string;

interface ExamCopy {
  lang: Locale;
  t: ExamTranslate;
  en: ExamTranslate;
}

const ExamCopyContext = createContext<ExamCopy | null>(null);

function translator(locale: Locale, body: Messages): ExamTranslate {
  const t = createTranslator({ locale, messages: { examHome: body }, namespace: 'examHome' });
  return (key, values) => (t as unknown as ExamTranslate)(key, values);
}

export function ExamCopyProvider({
  lang,
  messages,
  enMessages,
  children,
}: {
  lang: Locale;
  /** The `examHome` namespace body for `lang`. */
  messages: Messages;
  /** The `examHome` namespace body for English. */
  enMessages: Messages;
  children: ReactNode;
}) {
  const value = useMemo<ExamCopy>(
    () => ({ lang, t: translator(lang, messages), en: translator('en', enMessages) }),
    [lang, messages, enMessages]
  );
  return <ExamCopyContext.Provider value={value}>{children}</ExamCopyContext.Provider>;
}

export function useExamCopy() {
  const ctx = useContext(ExamCopyContext);
  const siteT = useTranslations('examHome');
  const siteLocale = useLocale() as Locale;
  return useMemo(() => {
    const lang = ctx?.lang ?? siteLocale;
    const t: ExamTranslate = ctx?.t ?? ((k, v) => siteT(k as never, v as never));
    const en: ExamTranslate = ctx?.en ?? t;
    /** Exam-language line plus the English line for the proctor. */
    const Bi = ({
      k,
      values,
      className,
      altClassName,
      stack,
    }: {
      k: string;
      values?: Values;
      className?: string;
      altClassName?: string;
      stack?: boolean;
    }) => (
      <BiText
        lang={lang}
        main={t(k, values)}
        alt={en(k, values)}
        className={className}
        altClassName={altClassName}
        stack={stack}
      />
    );
    return { lang, t, en, Bi };
  }, [ctx, siteT, siteLocale]);
}
