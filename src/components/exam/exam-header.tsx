'use client';

/**
 * Exam-day chrome (canvas ExamHome / ExamWritten / ExamPractical / ExamResult):
 * logo tile + "ADA Examination / Asian Doula Alliance" on the left; the session
 * code (from ?session=) and the exam language on the right. On the result
 * screens (/exam-home/exam-chs/…) the right side is the site language switch.
 *
 * The logo is not a link: a stray tap must not leave a running exam.
 */
import Image from 'next/image';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useTransition, type ReactNode } from 'react';
import { setLocale } from '@/i18n/actions';
import { htmlLang, localeNames, locales, type Locale } from '@/i18n/config';
import { EXAM_LANGS } from '@/lib/exam-content';
import { cn } from '@/lib/utils';

function GlobeGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="1.5" aria-hidden="true" focusable="false" className="flex-none">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" />
    </svg>
  );
}

const LOCALE_FONT: Record<Locale, string> = {
  en: '',
  'zh-cn': 'font-noto-sc',
  'zh-tw': 'font-noto-tc',
  ja: 'font-noto-jp',
  ko: 'font-noto-kr',
};

/** The bar itself, with an optional right side. Also the Suspense fallback. */
export function ExamHeaderBar({ children }: { children?: ReactNode }) {
  const t = useTranslations('examHome.chrome');
  return (
    <header className="bg-white border-b border-ada2-hairline print:hidden">
      <div className="ada2-wrap flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-3.5">
        <div className="flex items-center gap-3 min-w-0">
          <span aria-hidden="true" className="flex-none flex items-center justify-center w-11 h-11 bg-ada2-indigo">
            <Image src="/images/2026/ada-mark-white.svg" alt="" width={34} height={34} unoptimized className="block" />
          </span>
          <span className="flex flex-col min-w-0">
            <span className="text-[20px] leading-6 font-semibold text-ada2-ink">{t('product')}</span>
            <span className="text-[14px] leading-[18px] text-ada2-muted">Asian Doula Alliance</span>
          </span>
        </div>
        {children}
      </div>
    </header>
  );
}

function SessionCode({ code }: { code: string }) {
  const t = useTranslations('examHome.chrome');
  return (
    <p className="m-0 flex items-baseline gap-2.5 text-[16px] leading-[22px] text-ada2-body">
      <span>{t('session')}</span>
      <span className="font-semibold text-ada2-ink [font-variant-numeric:tabular-nums_lining-nums] break-all">{code}</span>
    </p>
  );
}

function LocaleSwitch() {
  const t = useTranslations('examHome.chrome');
  const current = useLocale() as Locale;
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  function choose(next: Locale) {
    if (next === current) return;
    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });
  }
  return (
    <nav aria-label={t('language')} className="flex flex-wrap items-center gap-x-1 text-[16px] leading-[22px] text-ada2-body">
      <GlobeGlyph />
      <span className="ml-1.5 mr-1">{t('language')}</span>
      {locales.map((loc) => {
        const isCurrent = loc === current;
        return (
          <button
            key={loc}
            type="button"
            lang={htmlLang[loc]}
            aria-current={isCurrent ? 'true' : undefined}
            disabled={pending}
            onClick={() => choose(loc)}
            className={cn(
              'inline-flex items-center min-h-[44px] px-1.5 bg-transparent border-0 cursor-pointer text-ada2-ink',
              LOCALE_FONT[loc],
              isCurrent ? 'font-semibold' : 'underline underline-offset-[3px] hover:text-black',
              'disabled:cursor-wait'
            )}
          >
            {localeNames[loc]}
          </button>
        );
      })}
    </nav>
  );
}

function ExamLanguage({ code }: { code: string }) {
  const t = useTranslations('examHome.chrome');
  const lang = EXAM_LANGS.find((l) => l.code === code);
  if (!lang) return null;
  return (
    <p className="m-0 flex items-center gap-2 text-[16px] leading-[22px] text-ada2-body">
      <GlobeGlyph />
      <span>{t('language')}</span>
      <span lang={htmlLang[lang.code]} className={cn('font-semibold text-ada2-ink', LOCALE_FONT[lang.code])}>
        {lang.nativeLabel}
      </span>
    </p>
  );
}

export function ExamHeader() {
  const params = useParams<{ lang?: string }>();
  const searchParams = useSearchParams();
  const pathname = usePathname() ?? '';
  const session = searchParams.get('session');
  const isResult = pathname.startsWith('/exam-home/exam-chs');
  const lang = typeof params?.lang === 'string' ? params.lang : null;

  const right =
    isResult ? (
      <LocaleSwitch />
    ) : session || lang ? (
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        {session ? <SessionCode code={session} /> : null}
        {session && lang ? <span aria-hidden="true" className="hidden sm:block w-px h-6 bg-ada2-hairline" /> : null}
        {lang ? <ExamLanguage code={lang} /> : null}
      </div>
    ) : null;

  return <ExamHeaderBar>{right}</ExamHeaderBar>;
}
