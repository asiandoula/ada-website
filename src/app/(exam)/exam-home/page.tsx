import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import { ArrowLink } from '@/components/site/pill';
import { ArrowIcon } from '@/components/site/icons';
import { htmlLang } from '@/i18n/config';
import { EXAM_LANGS, getExamContent, type ExamLang } from '@/lib/exam-content';
import { EXAM } from '@/lib/facts';
import { cn } from '@/lib/utils';

interface PageProps {
  searchParams: Promise<{ session?: string }>;
}

/** "Choose your exam language", each in its own language (shown under the H1). */
const LANG_PROMPTS: Record<ExamLang, string> = {
  en: 'Choose your exam language',
  'zh-cn': '选择考试语言',
  'zh-tw': '選擇考試語言',
  ja: '試験の言語を選んでください',
  ko: '시험 언어를 선택하세요',
};

const LANG_FONT: Record<ExamLang, string> = {
  en: '',
  'zh-cn': 'font-noto-sc',
  'zh-tw': 'font-noto-tc',
  ja: 'font-noto-jp',
  ko: 'font-noto-kr',
};

export default async function ExamHomePage({ searchParams }: PageProps) {
  const { session } = await searchParams;
  const t = await getTranslations('examHome.start');
  // Part names in the site language, from the exam content (it covers all five languages).
  const ui = getExamContent((await getLocale()) as ExamLang).ui;
  const title = t('title');
  const prompts = EXAM_LANGS.filter((l) => LANG_PROMPTS[l.code] !== title);

  return (
    <div className="ada2-wrap pt-12 pb-20 flex flex-wrap items-start gap-x-16 gap-y-12">
      <div className="flex-[999_1_640px] min-w-0 flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <p className="m-0 text-[17px] leading-6 text-ada2-body">{t('eyebrow')}</p>
          <h1 className="m-0 text-[clamp(40px,3.9vw,56px)] leading-[1.15] font-light text-ada2-ink [text-wrap:balance]">
            {title}
          </h1>
          <p className="m-0 flex flex-wrap gap-x-5 gap-y-1 text-[22px] leading-[31px] font-light text-ada2-body">
            {prompts.map((l) => (
              <span key={l.code} lang={htmlLang[l.code]} className={LANG_FONT[l.code]}>
                {LANG_PROMPTS[l.code]}
              </span>
            ))}
          </p>
          <p className="m-0 max-w-[760px] text-ada2-body [text-wrap:pretty]">{t('lead')}</p>
        </div>

        <nav aria-label={t('languagesLabel')}>
          <ul className="m-0 p-0 list-none border-t-2 border-ada2-ink">
            {EXAM_LANGS.map((lang) => {
              const href = session
                ? `/exam-home/${lang.code}?session=${session}`
                : `/exam-home/${lang.code}`;
              return (
                <li key={lang.code} className="border-b border-ada2-hairline">
                  <Link
                    href={href}
                    lang={htmlLang[lang.code]}
                    className="group flex items-center justify-between gap-6 min-h-[88px] box-border px-6 py-3 text-ada2-ink no-underline hover:bg-ada2-band hover:text-ada2-ink"
                  >
                    <span className="flex flex-wrap items-baseline gap-x-5 gap-y-1 min-w-0">
                      <span className={cn('text-[30px] leading-9 font-semibold', LANG_FONT[lang.code])}>
                        {lang.nativeLabel}
                      </span>
                      {lang.label !== lang.nativeLabel ? (
                        <span lang="en" className="text-[18px] leading-6 text-ada2-muted">
                          {lang.label}
                        </span>
                      ) : null}
                    </span>
                    <ArrowIcon size={24} className="flex-none" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <section aria-labelledby="parts-title" className="flex flex-col gap-4">
          <h2 id="parts-title" className="m-0 text-[36px] leading-[44px] font-light text-ada2-ink [text-wrap:balance]">
            {t('partsTitle')}
          </h2>
          <p className="m-0 text-ada2-body [text-wrap:pretty]">{t('partsLead')}</p>
          <ul className="m-0 p-0 list-none border-t-2 border-ada2-ink">
            <li className="py-4 px-6 border-b border-ada2-hairline text-[20px] leading-7 text-ada2-ink [font-variant-numeric:tabular-nums_lining-nums]">
              {t('partWritten', { part: `${ui.part1} · ${ui.writtenExam}`, minutes: EXAM.writtenMinutes })}
            </li>
            <li className="py-4 px-6 border-b border-ada2-hairline text-[20px] leading-7 text-ada2-ink [font-variant-numeric:tabular-nums_lining-nums]">
              {t('partPractical', { part: `${ui.part2} · ${ui.practicalExam}`, minutes: EXAM.practicalMinutes })}
            </li>
          </ul>
        </section>
      </div>

      <aside
        aria-labelledby="checkin-title"
        className="flex-[1_1_300px] max-w-[380px] min-w-0 box-border px-8 pt-8 pb-9 bg-ada2-band flex flex-col gap-4"
      >
        <h2 id="checkin-title" className="m-0 text-[28px] leading-[35px] font-light text-ada2-ink [text-wrap:balance]">
          {t('checkInTitle')}
        </h2>
        <dl className="m-0 flex flex-col border-t-2 border-ada2-ink">
          {(
            [
              ['idTitle', 'idBody'],
              ['startTitle', 'startBody'],
              ['helpTitle', 'helpBody'],
            ] as const
          ).map(([dt, dd]) => (
            <div key={dt} className="flex flex-col gap-0.5 py-3.5 border-b border-ada2-hairline">
              <dt className="text-[17px] leading-6 font-semibold text-ada2-ink">{t(dt)}</dt>
              <dd className="m-0 text-[16px] leading-6 text-ada2-body [text-wrap:pretty]">{t(dd)}</dd>
            </div>
          ))}
        </dl>
        <ArrowLink href="/exam-day" className="self-start">
          {t('examDayLink')}
        </ArrowLink>
      </aside>
    </div>
  );
}
