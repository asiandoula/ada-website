import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getLocale, getTranslations } from 'next-intl/server';
import { Breadcrumb, CtaBox, Hero, LinkList } from '@/components/site';
import type { Locale } from '@/i18n/config';
import { CERTIFICATE, CONTACT, EXAM, RENEWAL, TRAINING, TRAINING_MODULES, range, usd } from '@/lib/facts';
import { getUpcomingExamSessions } from '@/lib/exam-sessions';
import { breadcrumbJsonLd, courseJsonLd } from '@/lib/json-ld';
import { formatExamDate } from '@/lib/site-dates';
import {
  B,
  D,
  DataTable,
  FaqSection,
  InlineArrow,
  InlineLink,
  NW,
  RailSection,
  Rows,
  SplitSection,
  StepList,
  TableHead,
  h2Class,
  noteClass,
  thCol,
} from '../_components/blocks';
import { certFormat, languageList, photoDate } from '../_lib/facts';
import { FeeRows, ModuleDescription } from './_parts';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('postpartum.meta');
  return { title: t('title'), description: t('description') };
}

export default async function PostpartumDoulaPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('postpartum');
  const tc = await getTranslations('certifications');
  const tSite = await getTranslations('site');
  const [next] = await getUpcomingExamSessions({ type: 'postpartum', limit: 1 });
  const nextDate = next ? formatExamDate(next.date, locale) : null;
  // The rail box is narrow: CJK dates drop the weekday there so the no-wrap date fits.
  const ctaDate = next ? formatExamDate(next.date, locale, { weekday: locale === 'en' }) : null;

  const languages = languageList(locale, (code) => tc(`shared.languages.${code as 'en' | 'zh' | 'ja' | 'ko'}`));
  const date = photoDate(locale);
  const validity = tc('shared.validity', { years: CERTIFICATE.validityYears });
  const examLink = (chunks: ReactNode) => <InlineArrow href="/exam-dates">{chunks}</InlineArrow>;

  const steps = [
    {
      title: t('steps.s1.title'),
      body: t.rich('steps.s1.body', {
        count: TRAINING.moduleCount,
        days: range(TRAINING.inPersonDays),
        b: B,
        link: (chunks) => <InlineArrow href="/programs">{chunks}</InlineArrow>,
      }),
    },
    {
      title: t('steps.s2.title'),
      body: nextDate
        ? t.rich('steps.s2.bodyNext', { date: nextDate, fee: usd(EXAM.feeUsd), b: B, d: D, link: examLink })
        : t.rich('steps.s2.bodyNone', { fee: usd(EXAM.feeUsd), b: B, link: examLink }),
    },
    {
      title: t('steps.s3.title'),
      body: t.rich('steps.s3.body', {
        location: EXAM.location.oneLine,
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
      }),
    },
    {
      title: t('steps.s5.title'),
      body: t.rich('steps.s5.body', {
        format: certFormat('postpartum'),
        validity,
        fee: usd(RENEWAL.feeUsd),
        b: B,
        registry: (chunks) => (
          <InlineArrow href="/verify" tone="registry">
            {chunks}
          </InlineArrow>
        ),
      }),
    },
  ];

  const modules = TRAINING_MODULES.map((m) => ({
    label: t(`modules.${m.key}.title`),
    value: <ModuleDescription moduleKey={m.key} />,
  }));

  const links = [
    { href: '/certifications/postpartum-doula/exam', key: 'handbook' },
    { href: '/exam-dates', key: 'examDates' },
    { href: '/exam-day', key: 'examDay' },
    { href: '/for-doulas/renew', key: 'renew' },
    { href: '/programs/scholarship', key: 'scholarships' },
    { href: '/for-doulas/code-of-conduct', key: 'conduct' },
  ] as const;

  const faq = [
    { q: t('faq.experience.q'), a: t('faq.experience.a') },
    {
      q: t('faq.register.q'),
      a: t.rich('faq.register.a', {
        email: CONTACT.email,
        phone: CONTACT.phone.display,
        mail: (chunks) => <InlineLink href={`mailto:${CONTACT.email}`}>{chunks}</InlineLink>,
        tel: (chunks) => <InlineLink href={`tel:${CONTACT.phone.tel}`}>{chunks}</InlineLink>,
      }),
    },
    {
      q: t('faq.retake.q'),
      a: t('faq.retake.a', { fee: usd(EXAM.retakeFeeUsd), days: EXAM.retakeWaitDays }),
    },
    { q: t('faq.languages.q'), a: t('faq.languages.a', { languages }) },
    { q: t('faq.afterPass.q'), a: t('faq.afterPass.a', { validity }) },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: tc('shared.candidates'), path: '/certifications' },
              { name: t('breadcrumb'), path: '/certifications/postpartum-doula' },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(courseJsonLd({ name: t('courseName'), description: t('meta.description') })),
        }}
      />
      <Breadcrumb items={[{ label: tc('shared.candidates'), href: '/certifications' }, { label: t('breadcrumb') }]} />

      <Hero
        title={t('hero.title')}
        line={t('hero.line')}
        deadline={nextDate ? tSite('hero.nextExam', { type: tSite('examType.postpartum'), date: nextDate }) : undefined}
        actions={[
          { href: '/exam-dates', label: tc('shared.register') },
          { href: '/programs', label: tc('shared.findCourse') },
        ]}
        image={{ src: '/images/2026/ada-care-focus.jpg', alt: t('hero.imageAlt') }}
      />

      <SplitSection
        id="steps-title"
        first
        title={t('steps.title')}
        intro={t('steps.intro')}
        photo={{
          src: '/images/2026/ada-exam-practical.jpg',
          alt: tc('steps.imageAlt'),
          caption: tc('steps.caption', { date }),
        }}
      >
        <StepList steps={steps} labelledBy="steps-title" />
      </SplitSection>

      <SplitSection
        id="exam-title"
        title={t('exam.title')}
        intro={t('exam.intro', { count: TRAINING.moduleCount })}
        photo={{
          src: '/images/2026/ada-trainer-teaching.jpg',
          alt: t('exam.imageAlt'),
          caption: t('exam.caption', { date }),
          ratio: '1 / 1',
          position: '70% 50%',
        }}
      >
        <Rows rows={modules} labelWidth={220} />
      </SplitSection>

      <RailSection
        id="fees-title"
        main={
          <>
            <h2 id="fees-title" className={h2Class}>
              {t('fees.title')}
            </h2>
            <DataTable caption={t('fees.caption')} minWidth={600}>
              <TableHead>
                <th scope="col" className={thCol}>{t('fees.colFee')}</th>
                <th scope="col" className={thCol}>{t('fees.colAmount')}</th>
                <th scope="col" className={thCol}>{t('fees.colNotes')}</th>
              </TableHead>
              <tbody>
                <FeeRows />
              </tbody>
            </DataTable>
            <p className={noteClass}>{t('fees.footnote')}</p>
          </>
        }
        rail={
          ctaDate ? (
            <CtaBox title={t.rich('cta.withDate', { date: ctaDate, nw: NW })} action={{ href: '/exam-dates', label: tc('shared.register') }} />
          ) : (
            <CtaBox title={t('cta.noDate')} action={{ href: '/support/contact', label: t('cta.askDate') }} />
          )
        }
      />

      <div className="pt-24">
        <LinkList
          title={tc('shared.forCandidates')}
          items={links.map((l) => ({
            href: l.href,
            label: tc(`shared.links.${l.key}.label`),
            description:
              l.key === 'renew'
                ? t('links.renew', { years: CERTIFICATE.validityYears })
                : tc(`shared.links.${l.key}.description`),
          }))}
        />
      </div>

      <FaqSection
        title={tc('shared.questions')}
        note={tc.rich('shared.notAnswered', {
          email: CONTACT.email,
          link: (chunks) => <InlineLink href={`mailto:${CONTACT.email}`}>{chunks}</InlineLink>,
        })}
        items={faq}
      />
    </>
  );
}
