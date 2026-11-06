import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getLocale, getTranslations } from 'next-intl/server';
import { Breadcrumb, CtaBox, Hero, LinkList } from '@/components/site';
import type { Locale } from '@/i18n/config';
import { CERTIFICATE, CONTACT, EXAM, TRAINING, range, usd } from '@/lib/facts';
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
  Notes,
  RailSection,
  Rows,
  SplitSection,
  StepList,
  TableHead,
  TopicGrid,
  h2Class,
  h3Class,
  noteClass,
  td,
  thCol,
} from '../_components/blocks';
import { certFormat, languageList, photoDate } from '../_lib/facts';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('birthDoula.meta');
  return { title: t('title'), description: t('description') };
}

/** The Birth Doula Program topics, in board order. */
const TOPICS = ['stages', 'comfort', 'breathing', 'medicalTeams', 'family', 'traditions', 'emergency', 'postpartum'] as const;

export default async function BirthDoulaCertificationPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('birthDoula');
  const tc = await getTranslations('certifications');
  const tSite = await getTranslations('site');
  const sessions = await getUpcomingExamSessions();
  const nextBirth = sessions.find((s) => s.examType === 'birth') ?? null;
  const nextPostpartum = sessions.find((s) => s.examType === 'postpartum') ?? null;
  const birthDate = nextBirth ? formatExamDate(nextBirth.date, locale) : null;

  const languages = languageList(locale, (code) => tc(`shared.languages.${code as 'en' | 'zh' | 'ja' | 'ko'}`));
  const date = photoDate(locale);
  const validity = tc('shared.validity', { years: CERTIFICATE.validityYears });
  const askHref = `mailto:${CONTACT.email}?subject=${encodeURIComponent(t('mailSubject'))}`;
  const examLink = (chunks: ReactNode) => <InlineArrow href="/exam-dates">{chunks}</InlineArrow>;

  const steps = [
    {
      title: t('steps.s1.title'),
      body: t.rich('steps.s1.body', { link: (chunks) => <InlineArrow href="/programs">{chunks}</InlineArrow> }),
    },
    { title: t('steps.s2.title'), body: t('steps.s2.body', { count: TOPICS.length }) },
    {
      title: t('steps.s3.title'),
      body: birthDate
        ? t.rich('steps.s3.bodyNext', { date: birthDate, d: D, link: examLink })
        : t('steps.s3.bodyNone'),
    },
    {
      title: t('steps.s4.title'),
      body: t.rich('steps.s4.body', {
        format: certFormat('birth'),
        validity,
        b: B,
        registry: (chunks) => (
          <InlineArrow href="/verify" tone="registry">
            {chunks}
          </InlineArrow>
        ),
      }),
    },
  ];

  const compareRows: [ReactNode, ReactNode][] = [
    [t('compare.role.birth'), t('compare.role.postpartum')],
    [t('compare.place.birth'), t('compare.place.postpartum')],
    [t('compare.focus.birth'), t('compare.focus.postpartum')],
    [
      t('compare.program.birth'),
      t('compare.program.postpartum', { count: TRAINING.moduleCount, days: range(TRAINING.inPersonDays) }),
    ],
    [
      t('compare.exam.birth'),
      t('compare.exam.postpartum', {
        written: EXAM.writtenMinutes,
        practical: EXAM.practicalMinutes,
        fee: usd(EXAM.feeUsd),
      }),
    ],
    [t('compare.certificate', { format: certFormat('birth') }), t('compare.certificate', { format: certFormat('postpartum') })],
  ];

  const links = [
    { href: '/certifications/postpartum-doula', key: 'postpartum' },
    { href: '/certifications/ibclc', key: 'ibclc' },
    { href: '/programs/scholarship', key: 'scholarships' },
    { href: '/programs', key: 'courses' },
    { href: '/for-doulas/code-of-conduct', key: 'conduct' },
    { href: '/verify', key: 'verify' },
  ] as const;

  const mail = (chunks: ReactNode) => <InlineLink href={`mailto:${CONTACT.email}`}>{chunks}</InlineLink>;
  const faq = [
    { q: t('faq.next.q'), a: t('faq.next.a') },
    { q: t('faq.languages.q'), a: t('faq.languages.a', { languages }) },
    { q: t('faq.postpartumFirst.q'), a: t('faq.postpartumFirst.a') },
    { q: t('faq.cost.q'), a: t.rich('faq.cost.a', { email: CONTACT.email, mail }) },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: tc('shared.candidates'), path: '/certifications' },
              { name: t('breadcrumb'), path: '/certifications/birth-doula' },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(courseJsonLd({ name: t('courseName'), description: t('courseDescription') })),
        }}
      />
      <Breadcrumb items={[{ label: tc('shared.candidates'), href: '/certifications' }, { label: t('breadcrumb') }]} />

      <Hero
        title={t('hero.title')}
        line={t('hero.line')}
        deadline={birthDate ? tSite('hero.nextExam', { type: tSite('examType.birth'), date: birthDate }) : undefined}
        actions={[
          { href: '/programs', label: t('hero.findCohort') },
          { href: askHref, label: tc('shared.askCohort') },
        ]}
        image={{ src: '/images/2026/ada-care-seated.jpg', alt: t('hero.imageAlt') }}
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
        id="topics-title"
        title={t('topics.title')}
        intro={t('topics.intro')}
        photo={{
          src: '/images/2026/ada-trainer-teaching.jpg',
          alt: t('topics.imageAlt'),
          caption: t('topics.caption', { date }),
          ratio: '1 / 1',
          position: '70% 50%',
        }}
      >
        <TopicGrid label={t('topics.listLabel')} items={TOPICS.map((k) => t(`topics.items.${k}`))} />
        <h3 id="details-title" className={h3Class}>
          {t('details.title')}
        </h3>
        <Rows
          rows={[
            { label: t('details.cohorts.label'), value: t('details.cohorts.value') },
            { label: t('details.exam.label'), value: t('details.exam.value') },
            { label: t('details.languages.label'), value: languages },
            { label: t('details.prerequisites.label'), value: t('details.prerequisites.value') },
            { label: t('details.validity.label'), value: validity },
            {
              label: t('details.tuition.label'),
              value: t.rich('details.tuition.value', {
                link: (chunks) => <InlineArrow href="/programs/scholarship">{chunks}</InlineArrow>,
              }),
            },
          ]}
        />
      </SplitSection>

      <RailSection
        id="compare-title"
        main={
          <>
            <h2 id="compare-title" className={h2Class}>
              {t('compare.title')}
            </h2>
            <p className="m-0 text-ada2-body [text-wrap:pretty]">{t('compare.intro')}</p>
            <DataTable caption={t('compare.caption')} minWidth={0}>
              <TableHead>
                <th scope="col" className={`${thCol} w-1/2`}>{t('compare.colBirth')}</th>
                <th scope="col" className={`${thCol} w-1/2`}>{t('compare.colPostpartum')}</th>
              </TableHead>
              <tbody>
                {compareRows.map(([birth, postpartum], i) => (
                  <tr key={i}>
                    <td className={td}>{birth}</td>
                    <td className={td}>{postpartum}</td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            <Notes>
              <p className={noteClass}>
                {nextPostpartum
                  ? t.rich('compare.noteExamNext', {
                      date: formatExamDate(nextPostpartum.date, locale),
                      nw: NW,
                      link: (chunks) => <InlineLink href="/exam-dates">{chunks}</InlineLink>,
                    })
                  : t.rich('compare.noteExamNone', {
                      link: (chunks) => <InlineLink href="/exam-dates">{chunks}</InlineLink>,
                    })}
              </p>
              <p className={noteClass}>{t('compare.noteRecord')}</p>
            </Notes>
          </>
        }
        rail={<CtaBox title={t('cta.title')} action={{ href: askHref, label: tc('shared.askCohort') }} />}
      />

      <div className="pt-24">
        <LinkList
          title={tc('shared.forCandidates')}
          items={links.map((l) => ({
            href: l.href,
            label: tc(`shared.links.${l.key}.label`),
            description: tc(`shared.links.${l.key}.description`, { count: TRAINING.moduleCount }),
          }))}
        />
      </div>

      <FaqSection
        title={tc('shared.questions')}
        note={tc.rich('shared.notAnswered', { email: CONTACT.email, link: mail })}
        items={faq}
      />
    </>
  );
}
