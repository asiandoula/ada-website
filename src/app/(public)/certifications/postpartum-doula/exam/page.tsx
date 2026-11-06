import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getLocale, getTranslations } from 'next-intl/server';
import { ArrowLink, Breadcrumb, CtaBox, DatesTable } from '@/components/site';
import type { Locale } from '@/i18n/config';
import { CERTIFICATE, CONTACT, EXAM, RENEWAL, SITE, TRAINING, TRAINING_MODULES, range, usd } from '@/lib/facts';
import { getUpcomingExamSessions } from '@/lib/exam-sessions';
import { breadcrumbJsonLd } from '@/lib/json-ld';
import { formatExamDate } from '@/lib/site-dates';
import {
  B,
  DataTable,
  InlineLink,
  NW,
  Photo,
  QuestionList,
  Rows,
  StepList,
  TableHead,
  h2Class,
  h3Class,
  noteClass,
  td,
  thCol,
  thRow,
} from '../../_components/blocks';
import { CERT_PREFIX, certCode, certFormat, languageList, photoDate, proficiencyArgs } from '../../_lib/facts';
import { FeeRows, ModuleDescription } from '../_parts';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('handbook.meta');
  return { title: t('title'), description: t('description') };
}

const SECTIONS = ['apply', 'requirements', 'exam', 'fees', 'results', 'renewal', 'conduct', 'questions'] as const;

function DownChevron() {
  return (
    <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="#6B7280" strokeWidth={1.5} aria-hidden="true" focusable="false" className="flex-none">
      <path d="M3.5 6L8 10.5 12.5 6" />
    </svg>
  );
}

export default async function CandidateHandbookPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('handbook');
  const tp = await getTranslations('postpartum');
  const tc = await getTranslations('certifications');
  const sessions = await getUpcomingExamSessions({ type: 'postpartum' });
  const next = sessions[0] ?? null;
  // The rail box is narrow: CJK dates drop the weekday there so the no-wrap date fits.
  const ctaDate = next ? formatExamDate(next.date, locale, { weekday: locale === 'en' }) : null;

  const languages = languageList(locale, (code) => tc(`shared.languages.${code as 'en' | 'zh' | 'ja' | 'ko'}`));
  const date = photoDate(locale);
  const validity = tc('shared.validity', { years: CERTIFICATE.validityYears });
  const score = { pass: EXAM.passScore, max: EXAM.maxScore };
  const mail = (chunks: ReactNode) => <InlineLink href={`mailto:${CONTACT.email}`}>{chunks}</InlineLink>;
  const tel = (chunks: ReactNode) => <InlineLink href={`tel:${CONTACT.phone.tel}`}>{chunks}</InlineLink>;

  const keyFacts = [
    { label: t('facts.credential'), value: CERT_PREFIX.postpartum },
    { label: t('facts.examFee'), value: t('facts.examFeeValue', { fee: usd(EXAM.feeUsd) }) },
    {
      label: t('facts.exam'),
      value: t('facts.examValue', { written: EXAM.writtenMinutes, practical: EXAM.practicalMinutes }),
    },
    { label: t('facts.passMark'), value: t('facts.passMarkValue', score) },
    { label: t('facts.period'), value: validity },
  ];

  const requirements = [
    {
      title: t('requirements.r1.title'),
      body: t.rich('requirements.r1.body', { count: TRAINING.moduleCount, days: range(TRAINING.inPersonDays), b: B }),
    },
    { title: t('requirements.r2.title', { fee: usd(EXAM.feeUsd) }), body: t('requirements.r2.body') },
    {
      title: t('requirements.r3.title'),
      body: t.rich('requirements.r3.body', { link: (chunks) => <InlineLink href="/exam-day">{chunks}</InlineLink> }),
    },
    { title: t('requirements.r4.title'), body: t.rich('requirements.r4.body', { ...score, b: B }) },
    {
      title: t('requirements.r5.title'),
      body: t.rich('requirements.r5.body', { link: (chunks) => <InlineLink href="#conduct">{chunks}</InlineLink> }),
    },
  ];

  const sectionTitle = (key: (typeof SECTIONS)[number]) => t(`toc.${key}`);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: tc('shared.candidates'), path: '/certifications' },
              { name: tp('breadcrumb'), path: '/certifications/postpartum-doula' },
              { name: t('breadcrumb'), path: '/certifications/postpartum-doula/exam' },
            ])
          ),
        }}
      />
      <Breadcrumb
        items={[
          { label: tc('shared.candidates'), href: '/certifications' },
          { label: tp('breadcrumb'), href: '/certifications/postpartum-doula' },
          { label: t('breadcrumb') },
        ]}
      />

      <div className="ada2-wrap pt-12 pb-[104px] flex flex-wrap items-start gap-x-12 gap-y-10">
        <div className="flex-[999_1_640px] min-w-0 flex flex-col gap-16">
          {/* Title and key facts */}
          <div className="flex flex-col gap-4">
            <h1 className="m-0 text-[clamp(40px,3.9vw,56px)] leading-[1.15] font-light text-ada2-ink [text-wrap:balance]">
              {t('title')}
            </h1>
            <p className="m-0 max-w-[760px] text-[22px] leading-[31px] font-light text-ada2-body [text-wrap:pretty]">
              {t('lead')}
            </p>
            <p className="m-0 max-w-[760px] text-ada2-body [text-wrap:pretty]">{t('scope')}</p>
            <dl className="mt-2 mb-0 flex flex-wrap gap-x-12 gap-y-4 py-4 border-t-2 border-ada2-ink border-b border-b-ada2-hairline [font-variant-numeric:tabular-nums_lining-nums]">
              {keyFacts.map((f) => (
                <div key={String(f.label)} className="flex flex-col gap-0.5">
                  <dt className="text-[14px] leading-5 font-semibold text-ada2-muted">{f.label}</dt>
                  <dd className="m-0 text-[20px] leading-7 font-semibold text-ada2-ink">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* On this page */}
          <nav aria-labelledby="otp-title" className="flex flex-col gap-2">
            <h2 id="otp-title" className="m-0 text-[17px] leading-[22px] font-semibold text-ada2-ink">
              {t('toc.title')}
            </h2>
            <ul className="m-0 p-0 list-none grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-x-8 border-t-2 border-ada2-ink">
              {SECTIONS.map((key) => (
                <li key={key} className="border-b border-ada2-hairline">
                  <a
                    href={`#${key}`}
                    className="flex items-center justify-between gap-3 min-h-[48px] px-1 text-ada2-body text-[16px] leading-[22px] no-underline hover:bg-ada2-band hover:text-ada2-body"
                  >
                    {sectionTitle(key)}
                    <DownChevron />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Who can apply */}
          <section id="apply" aria-labelledby="apply-title" className="flex flex-col gap-5 scroll-mt-4">
            <h2 id="apply-title" className={h2Class}>
              {sectionTitle('apply')}
            </h2>
            <Rows
              rows={[
                { label: t('apply.graduates.label'), value: t('apply.graduates.value') },
                { label: t('apply.experience.label'), value: t('apply.experience.value') },
              ]}
            />
            <ArrowLink href="/programs" className="self-start">
              {tc('shared.findCourse')}
            </ArrowLink>
          </section>

          {/* Requirements */}
          <section id="requirements" aria-labelledby="req-title" className="flex flex-col gap-5 scroll-mt-4">
            <h2 id="req-title" className={h2Class}>
              {sectionTitle('requirements')}
            </h2>
            <StepList steps={requirements} labelledBy="req-title" />
          </section>

          {/* The examination */}
          <section id="exam" aria-labelledby="exam-title" className="flex flex-col gap-5 scroll-mt-4">
            <h2 id="exam-title" className={h2Class}>
              {sectionTitle('exam')}
            </h2>
            <p className="m-0 text-ada2-body [text-wrap:pretty]">{t('exam.intro', { location: EXAM.location.oneLine })}</p>
            <Photo
              src="/images/2026/ada-exam-written.jpg"
              alt={t('exam.imageAlt')}
              caption={t('exam.caption', { date })}
              ratio="5 / 2"
              position="50% 62%"
            />
            <DataTable caption={t('exam.caption2')} minWidth={640}>
              <TableHead>
                <th scope="col" className={`${thCol} w-[22%]`}>
                  <span className="ada2-sr">{t('exam.colDetail')}</span>
                </th>
                <th scope="col" className={`${thCol} w-[39%]`}>{t('exam.colWritten')}</th>
                <th scope="col" className={`${thCol} w-[39%]`}>{t('exam.colPractical')}</th>
              </TableHead>
              <tbody>
                <tr>
                  <th scope="row" className={thRow}>{t('exam.length.label')}</th>
                  <td className={td}>{t('exam.length.written', { minutes: EXAM.writtenMinutes })}</td>
                  <td className={td}>{t('exam.length.practical', { minutes: EXAM.practicalMinutes })}</td>
                </tr>
                <tr>
                  <th scope="row" className={thRow}>{t('exam.format.label')}</th>
                  <td className={td}>{t('exam.format.written')}</td>
                  <td className={td}>{t('exam.format.practical')}</td>
                </tr>
                <tr>
                  <th scope="row" className={thRow}>{t('exam.content.label')}</th>
                  <td className={td}>{t('exam.content.written')}</td>
                  <td className={td}>{t('exam.content.practical')}</td>
                </tr>
                <tr>
                  <th scope="row" className={thRow}>{t('exam.languages.label')}</th>
                  <td className={td} colSpan={2}>
                    {t('exam.languages.value', { languages })}
                  </td>
                </tr>
              </tbody>
            </DataTable>

            <h3 className={h3Class}>{t('covers.title')}</h3>
            <p className="m-0 text-ada2-body [text-wrap:pretty]">{t('covers.intro', { count: TRAINING.moduleCount })}</p>
            <DataTable caption={t('covers.caption')} minWidth={0}>
              <TableHead>
                <th scope="col" className={`${thCol} w-[30%]`}>{t('covers.colModule')}</th>
                <th scope="col" className={thCol}>{t('covers.colCovers')}</th>
              </TableHead>
              <tbody>
                {TRAINING_MODULES.map((m) => (
                  <tr key={m.key}>
                    <th scope="row" className={thRow}>{tp(`modules.${m.key}.title`)}</th>
                    <td className={td}>
                      <ModuleDescription moduleKey={m.key} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>

            <h3 className={h3Class}>{t('booking.title')}</h3>
            {/* A block wrapper: DatesTable is a flex item sized for rows, not for this column. */}
            <div className={sessions.length === 0 ? '-mb-5' : undefined}>
              <DatesTable sessions={sessions} id="booking-dates" />
            </div>
            <Rows
              className={sessions.length === 0 ? 'border-t-0' : undefined}
              rows={[
                {
                  label: t('booking.how.label'),
                  value: t.rich('booking.how.value', {
                    email: CONTACT.email,
                    phone: CONTACT.phone.display,
                    mail,
                    tel,
                  }),
                },
              ]}
            />
            <ArrowLink href="/exam-day" className="self-start">
              {t('booking.examDay')}
            </ArrowLink>
          </section>

          {/* Fees */}
          <section id="fees" aria-labelledby="fees-title" className="flex flex-col gap-5 scroll-mt-4">
            <h2 id="fees-title" className={h2Class}>
              {sectionTitle('fees')}
            </h2>
            <DataTable caption={tp('fees.caption')} minWidth={600}>
              <TableHead>
                <th scope="col" className={thCol}>{tp('fees.colFee')}</th>
                <th scope="col" className={thCol}>{tp('fees.colAmount')}</th>
                <th scope="col" className={thCol}>{t('fees.colWhen')}</th>
              </TableHead>
              <tbody>
                <FeeRows />
              </tbody>
            </DataTable>
            <p className={noteClass}>{tp('fees.footnote')}</p>
          </section>

          {/* Results and your certificate */}
          <section id="results" aria-labelledby="results-title" className="flex flex-col gap-5 scroll-mt-4">
            <h2 id="results-title" className={h2Class}>
              {sectionTitle('results')}
            </h2>
            <Rows
              rows={[
                { label: t('results.when.label'), value: t('results.when.value', { days: range(EXAM.resultsBusinessDays) }) },
                {
                  label: t('results.result.label'),
                  value: t.rich('results.result.value', { ...score, ...proficiencyArgs(), b: B }),
                },
                { label: t('results.pass.label'), value: t('results.pass.value') },
                {
                  label: t('results.fail.label'),
                  value: t('results.fail.value', { fee: usd(EXAM.retakeFeeUsd), days: EXAM.retakeWaitDays }),
                },
              ]}
            />
            <h3 className={h3Class}>{t('number.title')}</h3>
            <Rows
              rows={[
                {
                  label: certFormat('postpartum'),
                  value: t('number.format', { pd: certCode('postpartum'), bd: certCode('birth') }),
                },
                { label: t('number.record.label'), value: t('number.record.value') },
              ]}
            />
            <ArrowLink href="/verify" tone="registry" className="self-start">
              {tc('shared.checkRegistry')}
            </ArrowLink>
          </section>

          {/* Renewal */}
          <section id="renewal" aria-labelledby="renewal-title" className="flex flex-col gap-5 scroll-mt-4">
            <h2 id="renewal-title" className={h2Class}>
              {sectionTitle('renewal')}
            </h2>
            <p className="m-0 text-ada2-body [text-wrap:pretty]">{t('renewal.intro', { validity })}</p>
            <Rows
              rows={[
                { label: t('renewal.need.label'), value: t('renewal.need.value', { ...score, fee: usd(RENEWAL.feeUsd) }) },
                { label: t('renewal.start.label'), value: t('renewal.start.value') },
              ]}
            />
            <ArrowLink href="/for-doulas/renew" className="self-start">
              {t('renewal.link')}
            </ArrowLink>
          </section>

          {/* Code of Conduct */}
          <section id="conduct" aria-labelledby="conduct-title" className="flex flex-col gap-5 scroll-mt-4">
            <h2 id="conduct-title" className={h2Class}>
              {sectionTitle('conduct')}
            </h2>
            <p className="m-0 text-ada2-body [text-wrap:pretty]">{t('conduct.intro')}</p>
            <Rows
              rows={[
                { label: t('conduct.professional.label'), value: t('conduct.professional.value') },
                { label: t('conduct.client.label'), value: t('conduct.client.value') },
                { label: t('conduct.ethics.label'), value: t('conduct.ethics.value') },
                {
                  label: t('conduct.enforcement.label'),
                  value: t.rich('conduct.enforcement.value', { email: CONTACT.email, mail }),
                },
              ]}
            />
            <div className="flex flex-wrap gap-x-14 gap-y-2">
              <ArrowLink href="/for-doulas/code-of-conduct">{t('conduct.readFull')}</ArrowLink>
              <ArrowLink href={`mailto:${CONTACT.email}`}>{t('conduct.report')}</ArrowLink>
            </div>
          </section>

          {/* Questions */}
          <section id="questions" aria-labelledby="faq-title" className="flex flex-col gap-5 scroll-mt-4">
            <h2 id="faq-title" className={h2Class}>
              {sectionTitle('questions')}
            </h2>
            <QuestionList
              items={[
                {
                  q: t('questions.course.q'),
                  a: t.rich('questions.course.a', {
                    link: (chunks) => <InlineLink href="/programs">{chunks}</InlineLink>,
                  }),
                },
                { q: t('questions.language.q'), a: t('questions.language.a', { languages }) },
                {
                  q: t('questions.check.q'),
                  a: t.rich('questions.check.a', {
                    url: `${SITE.host}/verify`,
                    link: (chunks) => <InlineLink href="/verify">{chunks}</InlineLink>,
                  }),
                },
              ]}
            />
            <p className="m-0 text-[16px] leading-[25px] text-ada2-muted [text-wrap:pretty]">
              {tc.rich('shared.notAnswered', { email: CONTACT.email, link: mail })}
            </p>
          </section>
        </div>

        {ctaDate ? (
          <CtaBox title={tp.rich('cta.withDate', { date: ctaDate, nw: NW })} action={{ href: '/exam-dates', label: tc('shared.register') }} />
        ) : (
          <CtaBox title={tp('cta.noDate')} action={{ href: '/support/contact', label: tp('cta.askDate') }} />
        )}
      </div>
    </>
  );
}

