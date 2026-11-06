/**
 * /exam-day (board TestDay).
 *
 * States only what src/lib/facts.ts holds, plus the live site's generic ID
 * line ("bring a valid government-issued photo ID"). The board's accepted-ID
 * table, arrival time, check-in, personal-items, test-security and
 * rescheduling sections have no confirmed facts, so they are left out.
 * The next exam date appears only from a real session.
 */
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import { Breadcrumb, CtaBox, inlineLinkClassName } from '@/components/site';
import type { Locale } from '@/i18n/config';
import { getNextExamSession } from '@/lib/exam-sessions';
import { CERTIFICATE, EXAM, PROFICIENCY_LEVELS, range, usd } from '@/lib/facts';
import { formatExamDate } from '@/lib/site-dates';
import {
  contactTags,
  contactValues,
  linkTag,
  PageColumns,
  PageIntro,
  PageSection,
  programLanguages,
  Rows,
} from '../exam-dates/_components';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('examDay.meta');
  return {
    title: t('title'),
    description: t('description'),
    alternates: { canonical: '/exam-day' },
  };
}

function ChevronDownIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="#6B7280" strokeWidth={1.5} aria-hidden focusable={false} className="flex-none">
      <path d="M3.5 6L8 10.5 12.5 6" />
    </svg>
  );
}

export default async function ExamDayPage() {
  const [t, tSite, locale, next] = await Promise.all([
    getTranslations('examDay'),
    getTranslations('site'),
    getLocale() as Promise<Locale>,
    getNextExamSession('postpartum'),
  ]);

  const high = PROFICIENCY_LEVELS.find((l) => l.key === 'highlyProficient')!.min;
  const score = { max: EXAM.maxScore, pass: EXAM.passScore, high, highBelow: high - 1 };
  const languages = programLanguages(
    { en: t('languages.en'), zh: t('languages.zh'), ja: t('languages.ja'), ko: t('languages.ko') },
    locale, 'disjunction');

  const sections = [
    { id: 'before', label: t('toc.before') },
    { id: 'on-the-day', label: t('toc.onTheDay') },
    { id: 'after', label: t('toc.after') },
  ];

  const examDate = next ? (
    <>
      {tSite('hero.nextExam', { type: tSite('examType.postpartum'), date: formatExamDate(next.date, locale) })}{' '}
      <Link href="/exam-dates" className={inlineLinkClassName}>
        {t('before.dateLink')}
      </Link>
    </>
  ) : (
    t.rich('before.dateNoSession', { link: linkTag('/exam-dates') })
  );

  return (
    <>
      <Breadcrumb items={[{ label: t('breadcrumb.candidates'), href: '/certifications' }, { label: t('breadcrumb.current') }]} />
      <PageColumns rail={<CtaBox title={t('cta.title')} action={{ href: '/support/contact', label: t('cta.action') }} />}>
        <PageIntro title={t('title')} lead={t('lead')} note={t('scope')} />

        <nav aria-labelledby="toc-title" className="flex flex-col gap-2">
          <h2 id="toc-title" className="m-0 text-[17px] leading-[22px] font-semibold text-ada2-ink">
            {t('toc.title')}
          </h2>
          <ul className="m-0 p-0 list-none grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-x-8 border-t-2 border-ada2-ink">
            {sections.map((s) => (
              <li key={s.id} className="border-b border-ada2-hairline">
                <a
                  href={`#${s.id}`}
                  className="flex items-center justify-between gap-3 min-h-[48px] px-1 text-ada2-body text-[16px] leading-[22px] no-underline hover:bg-ada2-band hover:text-ada2-body"
                >
                  {s.label}
                  <ChevronDownIcon />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <PageSection id="before" title={t('before.title')}>
          <Rows
            rows={[
              { label: t('before.register'), value: t.rich('before.registerValue', { ...contactValues, ...contactTags }) },
              { label: t('before.date'), value: examDate },
              { label: t('before.language'), value: t('before.languageValue', { languages }) },
            ]}
          />
        </PageSection>

        <PageSection id="on-the-day" title={t('onTheDay.title')}>
          <figure className="m-0 flex flex-col gap-2.5">
            <Image
              src="/images/2026/ada-exam-practical.jpg"
              alt={t('onTheDay.imageAlt')}
              width={1600}
              height={1067}
              sizes="(min-width: 1120px) 900px, 100vw"
              className="block w-full h-auto aspect-[16/9] object-cover"
            />
            <figcaption className="text-[14px] leading-5 text-ada2-muted">{t('onTheDay.caption')}</figcaption>
          </figure>
          <Rows
            rows={[
              { label: t('onTheDay.bring'), value: t('onTheDay.bringValue') },
              { label: t('onTheDay.where'), value: EXAM.location.oneLine },
              { label: t('onTheDay.written'), value: t('onTheDay.writtenValue', { minutes: EXAM.writtenMinutes }) },
              { label: t('onTheDay.practical'), value: t('onTheDay.practicalValue', { minutes: EXAM.practicalMinutes }) },
            ]}
          />
        </PageSection>

        <PageSection id="after" title={t('after.title')}>
          <Rows
            rows={[
              { label: t('after.results'), value: t('after.resultsValue', { days: range(EXAM.resultsBusinessDays) }) },
              { label: t('after.score'), value: t('after.scoreValue', score) },
              {
                label: t('after.pass'),
                value: t.rich('after.passValue', {
                  years: CERTIFICATE.validityYears,
                  link: (chunks) => (
                    <Link href="/verify" className="font-semibold text-ada2-blossom underline underline-offset-[3px] hover:text-ada2-blossom-hover">
                      {chunks}
                    </Link>
                  ),
                }),
              },
              {
                label: t('after.fail'),
                value: t.rich('after.failValue', {
                  days: EXAM.retakeWaitDays,
                  fee: usd(EXAM.retakeFeeUsd),
                  link: linkTag('/exam-dates'),
                }),
              },
            ]}
          />
        </PageSection>
      </PageColumns>
    </>
  );
}
