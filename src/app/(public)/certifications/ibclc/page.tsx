import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getLocale, getTranslations } from 'next-intl/server';
import { Breadcrumb, CtaBox, Hero, LinkList, Pill, StatusTag } from '@/components/site';
import type { Locale } from '@/i18n/config';
import { CONTACT, TRAINING } from '@/lib/facts';
import { breadcrumbJsonLd, courseJsonLd } from '@/lib/json-ld';
import {
  B,
  DataTable,
  FaqSection,
  InlineLink,
  NW,
  Notes,
  RailSection,
  Rows,
  SplitSection,
  TableHead,
  TopicGrid,
  h2Class,
  noteClass,
  td,
  thCol,
  thRow,
} from '../_components/blocks';
import { languageList, photoDate } from '../_lib/facts';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('ibclc.meta');
  return { title: t('title'), description: t('description') };
}

/** Course topics from the live IBCLC page, in its order. */
const TOPICS = ['anatomy', 'oral', 'management', 'challenges', 'pharmacology', 'special', 'cultural', 'strategies'] as const;

export default async function IBCLCExamPrepPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('ibclc');
  const tc = await getTranslations('certifications');

  const languages = languageList(locale, (code) => tc(`shared.languages.${code as 'en' | 'zh' | 'ja' | 'ko'}`));
  const date = photoDate(locale);
  const askHref = `mailto:${CONTACT.email}?subject=${encodeURIComponent(t('mailSubject'))}`;
  const mail = (chunks: ReactNode) => <InlineLink href={`mailto:${CONTACT.email}`}>{chunks}</InlineLink>;

  const requirementRows = [
    { label: t('req.health.label'), value: t('req.health.value') },
    { label: t('req.lactation.label'), value: t.rich('req.lactation.value', { b: B }) },
    { label: t('req.clinical.label'), value: t('req.clinical.value') },
    { label: t('req.exam.label'), value: t('req.exam.value') },
  ];

  const links = [
    { href: '/certifications/postpartum-doula', key: 'postpartum' },
    { href: '/certifications/birth-doula', key: 'birth' },
    { href: '/programs/scholarship', key: 'scholarships' },
    { href: '/programs', key: 'courses' },
    { href: '/verify', key: 'verify' },
    { href: '/support/contact', key: 'contact' },
  ] as const;

  const faq = [
    { q: t('faq.what.q'), a: t('faq.what.a') },
    { q: t('faq.issue.q'), a: t('faq.issue.a') },
    { q: t('faq.adaFirst.q'), a: t('faq.adaFirst.a') },
    { q: t('faq.next.q'), a: t('faq.next.a') },
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
              { name: t('breadcrumb'), path: '/certifications/ibclc' },
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
        title={t.rich('hero.title', { nw: NW })}
        line={t('hero.line')}
        actions={[
          { href: '/programs', label: t('hero.findCohort') },
          { href: askHref, label: tc('shared.askCohort') },
        ]}
        image={{ src: '/images/2026/ada-trainer-slide.jpg', alt: t('hero.imageAlt') }}
      />

      <RailSection
        id="req-title"
        first
        main={
          <>
            <h2 id="req-title" className={h2Class}>
              {t.rich('req.title', { nw: NW })}
            </h2>
            <p className="m-0 text-ada2-body [text-wrap:pretty]">{t.rich('req.intro', { b: B })}</p>
            <DataTable caption={t('req.caption')} minWidth={0}>
              <TableHead>
                <th scope="col" className={`${thCol} w-[30%]`}>{t('req.colRequirement')}</th>
                <th scope="col" className={thCol}>{t('req.colAda')}</th>
              </TableHead>
              <tbody>
                {requirementRows.map((r, i) => (
                  <tr key={i}>
                    <th scope="row" className={thRow}>{r.label}</th>
                    <td className={td}>{r.value}</td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            <Notes>
              <p className={noteClass}>
                {t.rich('req.note1', {
                  link: (chunks) => (
                    <InlineLink href="https://iblce.org" external>
                      {chunks}
                    </InlineLink>
                  ),
                })}
              </p>
              <p className={noteClass}>{t('req.note2')}</p>
              <p className={noteClass}>{t('req.note3')}</p>
            </Notes>
          </>
        }
        rail={<CtaBox title={t('cta.title')} action={{ href: askHref, label: tc('shared.askCohort') }} />}
      />

      <SplitSection id="topics-title" title={t('topics.title')} intro={t('topics.intro')}>
        <TopicGrid label={t('topics.listLabel')} items={TOPICS.map((k) => t(`topics.items.${k}`))} />
      </SplitSection>

      <SplitSection
        id="who-title"
        title={t('who.title')}
        intro={t('who.intro')}
        photo={{
          src: '/images/2026/ada-course-practice.jpg',
          alt: t('who.imageAlt'),
          caption: t('who.caption', { date }),
        }}
      >
        <Rows
          rows={[
            { label: t('who.openTo.label'), value: t('who.openTo.value') },
            { label: t('who.credential.label'), value: t('who.credential.value') },
            { label: t('who.format.label'), value: t('who.format.value') },
            { label: t('who.cohorts.label'), value: t('who.cohorts.value') },
            { label: t('who.languages.label'), value: languages },
            { label: t('who.tuition.label'), value: t.rich('who.tuition.value', { email: CONTACT.email, mail }) },
          ]}
        />
      </SplitSection>

      <SplitSection
        id="record-title"
        title={t('record.title')}
        intro={t('record.intro')}
        aside={
          <div className="pt-1">
            <Pill href="/verify" variant="registry" icon="search">
              {tc('shared.checkRegistry')}
            </Pill>
          </div>
        }
      >
        <Rows
          rows={[
            { label: t('record.record.label'), value: t('record.record.value') },
            {
              label: t('record.status.label'),
              value: (
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <StatusTag status="completed" />
                  <span>{t('record.status.note')}</span>
                </span>
              ),
            },
            { label: t('record.isNot.label'), value: t('record.isNot.value') },
          ]}
        />
      </SplitSection>

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
