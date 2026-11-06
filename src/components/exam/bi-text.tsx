/**
 * Exam-day screens are bilingual (canvas ExamHome / ExamWritten / ExamPractical):
 * the exam language first, then English for the proctor, e.g. "暂停 Pause".
 * When the exam language is English, or the two strings are the same (ja/ko
 * copy that is still English), only one is shown.
 *
 * Server-compatible (no hooks): used by server pages and by the client copy hook.
 */
import type { ReactNode } from 'react';
import { htmlLang, type Locale } from '@/i18n/config';
import { cn } from '@/lib/utils';

/** The English line, or null when it would repeat the main line. */
export function altLine(lang: Locale, main: string, alt: string | null | undefined): string | null {
  if (lang === 'en' || !alt) return null;
  return alt.trim() === main.trim() ? null : alt;
}

export function BiText({
  lang,
  main,
  alt,
  className,
  altClassName,
  stack = false,
}: {
  lang: Locale;
  main: ReactNode;
  /** The English line. Pass the raw string; it is dropped when it repeats `main`. */
  alt?: string | null;
  className?: string;
  /** Default: same size, regular weight. */
  altClassName?: string;
  /** Put the English line under the main line instead of after it. */
  stack?: boolean;
}) {
  const shown = typeof main === 'string' ? altLine(lang, main, alt) : lang === 'en' ? null : alt ?? null;
  return (
    <span className={cn(stack ? 'inline-flex flex-col' : 'inline', className)}>
      <span lang={htmlLang[lang]}>{main}</span>
      {shown ? (
        <>
          {stack ? null : ' '}
          <span lang="en" className={cn('font-normal', altClassName)}>
            {shown}
          </span>
        </>
      ) : null}
    </span>
  );
}
