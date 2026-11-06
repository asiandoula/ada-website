/**
 * /exam-dates (boards ExamDatesB / ExamDatesZh).
 *
 * Dates come only from exam_sessions via getUpcomingExamSessions(); with none,
 * DatesTable shows the live site's fallback. The database holds no
 * registration, late-registration or results-by dates, so this page prints
 * none, and the board's sample dates, fee placeholders and policy rows are
 * left out. Every figure comes from src/lib/facts.ts.
 */
import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { ArrowLink, Breadcrumb, CtaBox, DatesTable } from '@/components/site';
import type { Locale } from '@/i18n/config';
import { getUpcomingExamSessions } from '@/lib/exam-sessions';
import { CERTIFICATE, EXAM, PROFICIENCY_LEVELS, RENEWAL, range, usd } from '@/lib/facts';
import { formatExamDate } from '@/lib/site-dates';
import {
  contactTags,
  contactValues,
  DataTable,
  linkTag,
  LinkRows,
  PageColumns,
  PageIntro,
  PageSection,
  programLanguages,
  Rows,
} from './_components';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('examDates.meta');
  return {
    title: t('title'),
    description: t('description'),
    alternates: { canonical: '/exam-dates' },
  };
}

/** The certificate-number pattern of generateCertificateNumber() in src/lib/utils.ts. */
const CERTIFICATE_FORMAT = 'ADA-PD-YYYY-NNNN';

export default async function ExamDatesPage() {
  const [t, tSite, locale, sessions] = await Promise.all([
    getTranslations('examDates'),
    getTranslations('site'),
    getLocale() as Promise<Locale>,
    getUpcomingExamSessions(),
  ]);

  const postpartum = sessions.filter((s) => s.examType === 'postpartum');
  const birth = sessions.filter((s) => s.examType === 'birth');
  const next = sessions[0] ?? null;

  const high = PROFICIENCY_LEVELS.find((l) => l.key === 'highlyProficient')!.min;
  const score = { max: EXAM.maxScore, pass: EXAM.passScore, high, highBelow: high - 1 };
  const languages = programLanguages(
    { en: t('languages.en'), zh: t('languages.zh'), ja: t('languages.ja'), ko: t('languages.ko') },
    locale, 'disjunction');

  const rail = next ? (
    <CtaBox
      title={tSite('hero.nextExam', {
        type: tSite(`examType.${next.examType}`),
        date: formatExamDate(next.date, locale),
      })}
      action={{ href: '/support/contact', label: t('cta.register') }}
    />
  ) : (
    <CtaBox title={t('cta.noSession')} action={{ href: '/support/contact', label: t('cta.contact') }} />
  );

  return (
    <>
      <Breadcrumb items={[{ label: t('breadcrumb.candidates'), href: '/certifications' }, { label: t('breadcrumb.current') }]} />
      <PageColumns rail={rail}>
        <PageIntro title={t('title')} lead={t('lead')} />

        <PageSection id="postpartum-doula" title={t('postpartum.title')} gap="sm">
          <p className="m-0 text-ada2-body [text-wrap:pretty]">
            {t('postpartum.intro', { address: EXAM.location.oneLine, fee: usd(EXAM.feeUsd) })}
          </p>
          {/* DatesTable's root is a flex item (basis 640px); a row wrapper keeps that basis horizontal. */}
          <div className="flex">
            <DatesTable sessions={postpartum} />
          </div>
        </PageSection>

        <PageSection id="before" title={t('before.title')}>
          <Rows
            rows={[
              { label: t('before.who'), value: t('before.whoValue') },
              { label: t('before.how'), value: t.rich('before.howValue', { ...contactValues, ...contactTags }) },
              { label: t('before.language'), value: t('before.languageValue', { languages }) },
              { label: t('before.id'), value: t.rich('before.idValue', { link: linkTag('/exam-day') }) },
            ]}
          />
        </PageSection>

        {birth.length > 0 ? (
          <PageSection id="birth-doula" title={t('birth.title')} gap="sm">
            <div className="flex">
              <DatesTable sessions={birth} />
            </div>
            <p className="m-0 text-ada2-body [text-wrap:pretty]">
              {t.rich('birth.programValue', { link: linkTag('/certifications/birth-doula') })}
            </p>
          </PageSection>
        ) : (
          <PageSection id="birth-doula" title={t('birth.title')}>
            <Rows
              rows={[
                { label: t('birth.dates'), value: t.rich('birth.datesValue', { link: linkTag('/support/contact') }) },
                {
                  label: t('birth.program'),
                  value: t.rich('birth.programValue', { link: linkTag('/certifications/birth-doula') }),
                },
              ]}
            />
          </PageSection>
        )}

        <PageSection id="fees" title={t('fees.title')} gap="sm">
          <p className="m-0 text-ada2-body [text-wrap:pretty]">{t('fees.intro')}</p>
          <DataTable
            caption={t('fees.caption')}
            columns={[{ label: t('fees.fee') }, { label: t('fees.amount') }, { label: t('fees.when') }]}
            rows={[
              [t('fees.exam'), <strong key="a" className="font-semibold text-ada2-ink">{usd(EXAM.feeUsd)}</strong>, t('fees.examWhen')],
              [
                t('fees.retake'),
                <strong key="a" className="font-semibold text-ada2-ink">{usd(EXAM.retakeFeeUsd)}</strong>,
                t('fees.retakeWhen', { pass: EXAM.passScore, max: EXAM.maxScore, days: EXAM.retakeWaitDays }),
              ],
              [
                t('fees.renewal'),
                <strong key="a" className="font-semibold text-ada2-ink">{usd(RENEWAL.feeUsd)}</strong>,
                t('fees.renewalWhen', { years: CERTIFICATE.validityYears }),
              ],
              [
                t('fees.assistance'),
                t('fees.assistanceAmount'),
                t.rich('fees.assistanceWhen', { link: linkTag('/programs/scholarship') }),
              ],
            ]}
          />
        </PageSection>

        <PageSection id="results" title={t('results.title')}>
          <Rows
            rows={[
              { label: t('results.when'), value: t('results.whenValue', { days: range(EXAM.resultsBusinessDays) }) },
              { label: t('results.result'), value: t('results.resultValue', score) },
              {
                label: t('results.pass'),
                value: t.rich('results.passValue', {
                  years: CERTIFICATE.validityYears,
                  format: CERTIFICATE_FORMAT,
                  b: (chunks) => (
                    <span className="font-semibold whitespace-nowrap [font-variant-numeric:tabular-nums_lining-nums]">{chunks}</span>
                  ),
                }),
              },
              {
                label: t('results.fail'),
                value: t('results.failValue', { fee: usd(EXAM.retakeFeeUsd), days: EXAM.retakeWaitDays }),
              },
            ]}
          />
          <ArrowLink href="/verify" tone="registry" className="self-start">
            {t('results.lookup')}
          </ArrowLink>
        </PageSection>

        <PageSection id="policies" title={t('policies.title')}>
          <LinkRows
            items={[
              { href: '/exam-day', label: t('policies.examDay'), description: t('policies.examDayDescription') },
              { href: '/for-doulas/code-of-conduct', label: t('policies.conduct'), description: t('policies.conductDescription') },
              { href: '/support/contact', label: t('policies.contact'), description: t('policies.contactDescription') },
            ]}
          />
        </PageSection>
      </PageColumns>
    </>
  );
}
