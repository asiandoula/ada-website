import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { getLocale, getTranslations } from 'next-intl/server';
import { ArrowLink, Breadcrumb, Hero, LinkList } from '@/components/site';
import { ArrowIcon } from '@/components/site/icons';
import type { Locale } from '@/i18n/config';
import { CERTIFICATE, EXAM, RENEWAL, TRAINING, range, usd } from '@/lib/facts';
import { getUpcomingExamSessions } from '@/lib/exam-sessions';
import { breadcrumbJsonLd } from '@/lib/json-ld';
import { formatExamDate } from '@/lib/site-dates';
import {
  B,
  D,
  DataTable,
  InlineArrow,
  Notes,
  SplitSection,
  StepList,
  TableHead,
  h2Class,
  noteClass,
  td,
  thCol,
} from './_components/blocks';
import { CERT_PREFIX, languageList, photoDate } from './_lib/facts';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('certifications.meta');
  return { title: t('title'), description: t('description') };
}

export default async function CertificationsPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('certifications');
  const tSite = await getTranslations('site');
  const sessions = await getUpcomingExamSessions();
  const next = sessions[0] ?? null;
  const nextPostpartum = sessions.find((s) => s.examType === 'postpartum') ?? null;

  const languages = languageList(locale, (code) => t(`shared.languages.${code as 'en' | 'zh' | 'ja' | 'ko'}`));
  const date = photoDate(locale);
  const validity = t('shared.validity', { years: CERTIFICATE.validityYears });
  const renewEvery = t('shared.renewEvery', { years: CERTIFICATE.validityYears });

  const examLink = (chunks: ReactNode) => <InlineArrow href="/exam-dates">{chunks}</InlineArrow>;

  const steps = [
    {
      title: t('steps.s1.title'),
      body: t.rich('steps.s1.body', {
        days: range(TRAINING.inPersonDays),
        b: B,
        link: (chunks) => <InlineArrow href="/programs">{chunks}</InlineArrow>,
      }),
    },
    {
      title: t('steps.s2.title'),
      body: nextPostpartum
        ? t.rich('steps.s2.bodyNext', {
            date: formatExamDate(nextPostpartum.date, locale),
            fee: usd(EXAM.feeUsd),
            b: B,
            d: D,
            link: examLink,
          })
        : t.rich('steps.s2.bodyNone', { fee: usd(EXAM.feeUsd), b: B, link: examLink }),
    },
    {
      title: t('steps.s3.title'),
      body: t.rich('steps.s3.body', {
        written: EXAM.writtenMinutes,
        practical: EXAM.practicalMinutes,
        b: B,
        link: (chunks) => <InlineArrow href="/exam-day">{chunks}</InlineArrow>,
      }),
    },
    {
      title: t('steps.s4.title'),
      body: t.rich('steps.s4.body', {
        days: range(EXAM.resultsBusinessDays),
        pass: EXAM.passScore,
        max: EXAM.maxScore,
        b: B,
        registry: (chunks) => (
          <InlineArrow href="/verify" tone="registry">
            {chunks}
          </InlineArrow>
        ),
      }),
    },
    {
      title: t('steps.s5.title'),
      body: t.rich('steps.s5.body', {
        validity,
        fee: usd(RENEWAL.feeUsd),
        b: B,
        link: (chunks) => <InlineArrow href="/for-doulas/renew">{chunks}</InlineArrow>,
      }),
    },
  ];

  const credentialRows = [
    {
      href: '/certifications/postpartum-doula',
      name: t('credentials.postpartum.name'),
      prefix: CERT_PREFIX.postpartum,
      how: t('credentials.postpartum.how', {
        written: EXAM.writtenMinutes,
        practical: EXAM.practicalMinutes,
        pass: EXAM.passScore,
        max: EXAM.maxScore,
        fee: usd(EXAM.feeUsd),
      }),
      period: validity,
      renewal: renewEvery,
    },
    {
      href: '/certifications/birth-doula',
      name: t('credentials.birth.name'),
      prefix: CERT_PREFIX.birth,
      how: t('credentials.birth.how'),
      period: validity,
      renewal: renewEvery,
    },
    {
      href: '/certifications/ibclc',
      name: t('credentials.ibclc.name'),
      prefix: null,
      how: t('credentials.ibclc.how'),
      period: t('credentials.ibclc.period'),
      renewal: t('credentials.ibclc.renewal'),
    },
  ];

  const links = [
    { href: '/exam-dates', key: 'examDates' },
    { href: '/for-doulas/renew', key: 'renew' },
    { href: '/exam-day', key: 'examDay' },
    { href: '/programs', key: 'education' },
    { href: '/portal', key: 'portal' },
    { href: '/for-doulas/code-of-conduct', key: 'conduct' },
  ] as const;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: tSite('breadcrumb.home'), path: '/' },
              { name: t('shared.candidates'), path: '/certifications' },
            ])
          ),
        }}
      />
      <Breadcrumb items={[{ label: t('shared.candidates') }]} />

      <Hero
        title={t('hero.title')}
        line={t('hero.line', { languages })}
        deadline={
          next
            ? tSite('hero.nextExam', {
                type: next.examType === 'birth' ? tSite('examType.birth') : tSite('examType.postpartum'),
                date: formatExamDate(next.date, locale),
              })
            : undefined
        }
        actions={[
          { href: '/exam-dates', label: t('shared.register') },
          { href: '/programs', label: t('shared.findCourse') },
        ]}
        image={{ src: '/images/2026/ada-exam-written.jpg', alt: t('hero.imageAlt') }}
      />

      {/* Credentials ADA issues */}
      <section aria-labelledby="creds-title" className="bg-white pt-20">
        <div className="ada2-wrap flex flex-col gap-4">
          <h2 id="creds-title" className={h2Class}>
            {t('credentials.title')}
          </h2>
          <p className="m-0 max-w-[880px] text-ada2-body [text-wrap:pretty]">{t('credentials.intro')}</p>
          <DataTable caption={t('credentials.caption')} minWidth={880} className="leading-[23px]">
            <TableHead>
              <th scope="col" className={`${thCol} w-[22%]`}>{t('credentials.colCredential')}</th>
              <th scope="col" className={thCol}>{t('credentials.colPrefix')}</th>
              <th scope="col" className={`${thCol} w-[34%]`}>{t('credentials.colHow')}</th>
              <th scope="col" className={thCol}>{t('credentials.colPeriod')}</th>
              <th scope="col" className={thCol}>{t('credentials.colRenewal')}</th>
            </TableHead>
            <tbody>
              {credentialRows.map((row) => (
                <tr key={row.href}>
                  <th scope="row" className="text-left align-top py-3 px-4 font-semibold">
                    <Link
                      href={row.href}
                      className="inline-flex items-center gap-2 min-h-[44px] -my-2.5 text-ada2-ink text-[17px] leading-[23px] font-semibold no-underline hover:text-black hover:underline underline-offset-[3px]"
                    >
                      {row.name}
                      <ArrowIcon size={16} className="flex-none" />
                    </Link>
                  </th>
                  <td className="align-top py-3 px-4 font-semibold text-ada2-ink whitespace-nowrap">
                    {row.prefix ?? (
                      <>
                        <span aria-hidden="true">—</span>
                        <span className="ada2-sr">{t('credentials.noPrefix')}</span>
                      </>
                    )}
                  </td>
                  <td className={`${td} py-3`}>{row.how}</td>
                  <td className={`${td} py-3`}>{row.period}</td>
                  <td className={`${td} py-3`}>{row.renewal}</td>
                </tr>
              ))}
            </tbody>
          </DataTable>
          <Notes>
            <p className={noteClass}>{t('credentials.noteStanding')}</p>
            <p className={noteClass}>{t('credentials.noteRenewal', { fee: usd(RENEWAL.feeUsd) })}</p>
            <p className={noteClass}>{t('credentials.noteIbclc')}</p>
          </Notes>
          <ArrowLink href="/verify" tone="registry" className="self-start">
            {t('credentials.lookup')}
          </ArrowLink>
        </div>
      </section>

      {/* How certification works */}
      <SplitSection
        id="steps-title"
        title={t('steps.title')}
        intro={t('steps.intro')}
        photo={{
          src: '/images/2026/ada-exam-practical.jpg',
          alt: t('steps.imageAlt'),
          caption: t('steps.caption', { date }),
        }}
      >
        <StepList steps={steps} labelledBy="steps-title" />
      </SplitSection>

      <div className="pt-24 pb-[104px]">
        <LinkList
          title={t('links.title')}
          items={links.map((l) => ({
            href: l.href,
            label: t(`shared.links.${l.key}.label`),
            description: t(`shared.links.${l.key}.description`, { count: TRAINING.moduleCount }),
          }))}
        />
      </div>
    </>
  );
}
