import Image from 'next/image';
import type { ReactNode } from 'react';
import { getLocale, getTranslations } from 'next-intl/server';
import { ArrowLink, CtaBox, Pill } from '@/components/site';
import { htmlLang, type Locale } from '@/i18n/config';
import { CERTIFICATE, CONTACT, EXAM, PROFICIENCY_LEVELS, RENEWAL, usd } from '@/lib/facts';
import { formatExamDate } from '@/lib/site-dates';
import { computeProficiencyLevel, cn } from '@/lib/utils';
import { ScoreBreakdown } from './score-breakdown';

export const SUBCATEGORIES = [
  'score_terminology',
  'score_newborn',
  'score_lactation',
  'score_emergency',
  'score_practical',
  'score_postpartum',
  'score_knowledge',
  'score_ethics',
] as const;

/** Grey levels for the score scale, lightest = Not Proficient (as on the board). */
const LEVEL_SWATCH = {
  highlyProficient: 'bg-ada2-muted',
  proficient: 'bg-ada2-kit-rule',
  notProficient: 'bg-ada2-band-rule',
} as const;

const PHOTO_DATE = Date.UTC(2024, 7, 1);

function ResultTag({ passed, label }: { passed: boolean; label: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 box-border min-h-[30px] px-3 border-[1.5px] border-solid rounded-[2px]',
        'font-bold text-[13px] leading-none tracking-[0.08em] uppercase whitespace-nowrap',
        passed
          ? 'bg-ada2-good-bg text-ada2-good-text border-transparent'
          : 'bg-white text-ada2-lapsed-text border-ada2-lapsed'
      )}
    >
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true" focusable="false">
        {passed ? <path d="M3.5 8.5l3 3 6-7" /> : <path d="M4 8h8" />}
      </svg>
      {label}
    </span>
  );
}

export interface ResultViewProps {
  doula: { full_name: string; full_name_zh: string | null; doula_id_code: string };
  examResult: {
    overall_score: number | string;
    passed: boolean;
    exam_date: string | null;
    session: string | null;
    exam_type: string | null;
  } & Record<(typeof SUBCATEGORIES)[number], number | string | null>;
  certificateCode: string | null;
}

/** The result sheet (canvas ExamResult). Presentational: the page above does the reads. */
export async function ResultView({ doula, examResult, certificateCode }: ResultViewProps) {
  const t = await getTranslations('examHome.result');
  const locale = (await getLocale()) as Locale;
  const passed = examResult.passed;
  const overallScore = Number(examResult.overall_score);

  const scores = SUBCATEGORIES.map((key) => ({
    key,
    label: t(`areas.${key}`),
    score: Number(examResult[key]) || 0,
  }));

  // Level from the overall score, with the cutoffs in facts.ts / utils.ts.
  const levelLabel = computeProficiencyLevel(overallScore);
  const level = PROFICIENCY_LEVELS.find((l) => l.label === levelLabel) ?? null;
  const highly = PROFICIENCY_LEVELS.find((l) => l.key === 'highlyProficient')!;
  const proficient = PROFICIENCY_LEVELS.find((l) => l.key === 'proficient')!;
  const rangeText = {
    highlyProficient: t('levelRange.highlyProficient', { min: highly.min }),
    proficient: t('levelRange.proficient', { min: proficient.min, max: (proficient.below ?? EXAM.maxScore) - 1 }),
    notProficient: t('levelRange.notProficient', { pass: EXAM.passScore }),
  };
  const scale = [
    { key: 'notProficient' as const, from: 0, to: EXAM.passScore },
    { key: 'proficient' as const, from: EXAM.passScore, to: highly.min },
    { key: 'highlyProficient' as const, from: highly.min, to: EXAM.maxScore },
  ];
  const markerPct = Math.max(0, Math.min(100, (overallScore / EXAM.maxScore) * 100));

  const typeKey = examResult.exam_type === 'birth' ? 'birth' : 'postpartum';
  const resultWord = passed ? t('passed') : t('notPassed');
  const photoDate = new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : htmlLang[locale], {
    year: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(PHOTO_DATE);

  const identity = [
    {
      label: t('candidate'),
      value: (
        <>
          {doula.full_name}
          {doula.full_name_zh ? (
            <span lang="zh-Hans" className="ml-2 font-normal text-ada2-muted">
              {doula.full_name_zh}
            </span>
          ) : null}
        </>
      ),
      strong: true,
    },
    {
      label: t('doulaId'),
      value: <span className="font-semibold text-ada2-blossom">{doula.doula_id_code}</span>,
    },
    {
      label: t('examDate'),
      value: examResult.exam_date ? formatExamDate(examResult.exam_date, locale) : t('notRecorded'),
    },
    { label: t('session'), value: examResult.session || t('notRecorded') },
  ];

  const nextRows: { label: string; value: ReactNode }[] = [];
  if (passed && certificateCode) {
    nextRows.push({
      label: t('recordTitle'),
      value: (
        <div className="flex flex-col items-start gap-4">
          <p className="m-0 [text-wrap:pretty]">{t('recordBody')}</p>
          <Pill href={`/verify/${certificateCode}`} variant="registry" icon="search">
            {t('recordAction')}
          </Pill>
        </div>
      ),
    });
  }
  if (passed) {
    nextRows.push({
      label: t('renewTitle'),
      value: (
        <div className="flex flex-col items-start gap-1">
          <p className="m-0 [text-wrap:pretty]">
            {t('renewBody', { years: CERTIFICATE.validityYears, fee: usd(RENEWAL.feeUsd) })}
          </p>
          <ArrowLink href="/for-doulas/renew">{t('renewLink')}</ArrowLink>
        </div>
      ),
    });
  } else {
    nextRows.push({
      label: t('retakeTitle'),
      value: (
        <p className="m-0 [text-wrap:pretty]">
          {t('retakeBody', { days: EXAM.retakeWaitDays, fee: usd(EXAM.retakeFeeUsd) })}
        </p>
      ),
    });
  }
  nextRows.push({
    label: t('questionsTitle'),
    value: (
      <p className="m-0 [text-wrap:pretty]">
        {t('questionsBody', { email: CONTACT.email, phone: CONTACT.phone.display.replace(/ /g, '\u00A0') })}
      </p>
    ),
  });

  return (
    <div className="ada2-wrap pt-12 pb-20 flex flex-col gap-14">
      {/* Head */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <p className="m-0 text-[17px] leading-6 text-ada2-body">
            {t('eyebrow', { credential: t(`types.${typeKey}`) })}
          </p>
          <h1 className="m-0 text-[clamp(40px,3.9vw,56px)] leading-[1.15] font-light text-ada2-ink [text-wrap:balance]">
            {t('title')}
          </h1>
        </div>
        <dl className="m-0 flex flex-wrap gap-x-12 gap-y-4 py-4 border-y border-ada2-hairline [font-variant-numeric:tabular-nums_lining-nums]">
          {identity.map((item) => (
            <div key={item.label} className="flex flex-col gap-0.5 min-w-0">
              <dt className="text-[15px] leading-5 font-semibold text-ada2-muted">{item.label}</dt>
              <dd className={cn('m-0 text-[20px] leading-7 text-ada2-ink break-words', item.strong && 'font-semibold')}>
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Overall score */}
      <section
        aria-labelledby="overall-title"
        className="box-border flex flex-wrap gap-x-16 gap-y-10 bg-ada2-band border-t-2 border-ada2-ink px-[clamp(20px,2.6vw,36px)] pt-8 pb-9"
      >
        <div className="flex-[1_1_300px] min-w-0 flex flex-col gap-4">
          <h2 id="overall-title" className="m-0 text-[17px] leading-[22px] font-semibold text-ada2-ink">
            {t('overall')}
          </h2>
          <p className="m-0 flex items-baseline gap-3 text-ada2-ink [font-variant-numeric:tabular-nums_lining-nums]">
            <span className="text-[96px] leading-none font-light">{overallScore}</span>
            <span className="text-[28px] leading-none font-light text-ada2-body">{t('outOf', { max: EXAM.maxScore })}</span>
          </p>
          <p className="m-0 flex flex-wrap items-center gap-x-4 gap-y-2">
            <ResultTag passed={passed} label={resultWord} />
            {level ? (
              <span className="text-[24px] leading-[30px] font-semibold text-ada2-ink">{t(`levels.${level.key}`)}</span>
            ) : null}
          </p>
          <p className="m-0 text-ada2-ink">{t('passMark', { pass: EXAM.passScore, max: EXAM.maxScore })}</p>
        </div>

        <div className="flex-[1_1_420px] min-w-0 flex flex-col gap-5">
          <h3 className="m-0 text-[17px] leading-[22px] font-semibold text-ada2-ink">{t('whereFalls')}</h3>
          <div
            role="img"
            aria-label={t('scaleLabel', { score: overallScore, min: 0, max: EXAM.maxScore })}
            className="relative pt-2 pb-8"
          >
            <div className="relative flex h-5">
              {scale.map((seg) => (
                <span
                  key={seg.key}
                  className={cn('h-full border-r-2 border-solid border-ada2-band last:border-r-0', LEVEL_SWATCH[seg.key])}
                  style={{ width: `${((seg.to - seg.from) / EXAM.maxScore) * 100}%` }}
                />
              ))}
              <span
                className="absolute -top-3 -bottom-3 w-1 -ml-0.5 bg-ada2-ink"
                style={{ left: `${markerPct}%` }}
              />
            </div>
            {[0, EXAM.passScore, highly.min, EXAM.maxScore].map((n) => (
              <span
                key={n}
                aria-hidden="true"
                className={cn(
                  'absolute bottom-0 text-[14px] leading-5 text-ada2-body [font-variant-numeric:tabular-nums_lining-nums]',
                  n === EXAM.passScore && 'font-bold text-ada2-ink',
                  n === 0 ? 'left-0' : n === EXAM.maxScore ? 'right-0' : '-translate-x-1/2'
                )}
                style={n === 0 || n === EXAM.maxScore ? undefined : { left: `${(n / EXAM.maxScore) * 100}%` }}
              >
                {n}
              </span>
            ))}
          </div>
          <ul className="m-0 p-0 list-none flex flex-col border-t border-ada2-hairline">
            {[...scale].reverse().map((seg) => {
              const mine = level?.key === seg.key;
              return (
                <li key={seg.key} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5 border-b border-ada2-hairline">
                  <span aria-hidden="true" className={cn('flex-none w-7 h-4 border border-solid border-ada2-tag-border', LEVEL_SWATCH[seg.key])} />
                  <span className="flex-1 min-w-0 text-[17px] leading-6 text-ada2-ink">
                    <span className={mine ? 'font-semibold' : undefined}>{t(`levels.${seg.key}`)}</span>
                    <span className="text-ada2-body"> · {rangeText[seg.key]}</span>
                  </span>
                  {mine ? <span className="flex-none text-[15px] leading-5 font-semibold text-ada2-ink">{t('yourLevel')}</span> : null}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Score Breakdown (client component for animation) */}
      <ScoreBreakdown
        title={t('areasTitle')}
        lead={t('areasLead', { max: EXAM.maxScore, pass: EXAM.passScore })}
        caption={t('areasCaption', { pass: EXAM.passScore })}
        colArea={t('colArea')}
        colScore={t('colScore')}
        colAgainst={t('colAgainst', { pass: EXAM.passScore })}
        rows={scores}
        pass={EXAM.passScore}
        max={EXAM.maxScore}
        atOrAbove={t('atOrAbove', { pass: EXAM.passScore })}
        below={t('below', { pass: EXAM.passScore })}
        overall={{
          label: t('overallRow'),
          score: overallScore,
          text: level ? `${t(`levels.${level.key}`)} · ${resultWord}` : resultWord,
        }}
      />

      {/* What happens next */}
      <div className="flex flex-wrap items-start gap-x-16 gap-y-10">
        <section aria-labelledby="next-title" className="flex-[999_1_600px] min-w-0 flex flex-col gap-5">
          <h2 id="next-title" className="m-0 text-[36px] leading-[44px] font-light text-ada2-ink [text-wrap:balance]">
            {t('nextTitle')}
          </h2>
          <dl className="m-0 flex flex-col border-t-2 border-ada2-ink">
            {nextRows.map((row) => (
              <div key={row.label} className="flex flex-wrap gap-x-8 gap-y-1 py-4 border-b border-ada2-hairline">
                <dt className="flex-[0_0_200px] font-semibold text-ada2-ink">{row.label}</dt>
                <dd className="flex-[1_1_300px] min-w-0 m-0 text-[18px] leading-[30px] text-ada2-body">{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="flex-[1_1_300px] max-w-[380px] min-w-0 flex flex-col gap-7">
          <CtaBox
            title={t('cta')}
            action={{ href: '/portal', label: t('ctaAction') }}
            className="flex-none max-w-none"
          />
          <figure className="m-0 flex flex-col gap-2.5">
            <Image
              src="/images/2026/ada-care-seated.jpg"
              alt={t('photoAlt')}
              width={1600}
              height={1067}
              sizes="(min-width: 1120px) 380px, 100vw"
              className="block w-full h-auto aspect-[3/2] object-cover"
            />
            <figcaption className="text-[14px] leading-5 text-ada2-muted">{t('photoCaption', { date: photoDate })}</figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
