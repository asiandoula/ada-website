import type { Metadata } from 'next';
import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import { Breadcrumb, CtaBox, DatesTable, Hero, Pill, RuledRows, Tiles } from '@/components/site';
import type { Locale } from '@/i18n/config';
import {
  CONTACT,
  EXAM,
  PROGRAM_LANGUAGES,
  TRAINING,
  TRAINING_MODULES,
  range,
  usd,
  type ModuleKey,
  type ProgramLanguage,
} from '@/lib/facts';
import { getUpcomingExamSessions } from '@/lib/exam-sessions';
import { breadcrumbJsonLd } from '@/lib/json-ld';
import { formatExamDate } from '@/lib/site-dates';
import { DisclosureList, Rows, h2Class, h3Class, inlineLink } from '../for-doulas/_components/page-kit';

/** US emergency number, named in the Safety & Emergency module. */
const EMERGENCY_NUMBER = '911';

/** List formatting ("English, Mandarin, Japanese and Korean"): en uses en-GB, like the site's dates. */
const INTL_LOCALE: Record<Locale, string> = { en: 'en-GB', 'zh-cn': 'zh-CN', 'zh-tw': 'zh-TW', ja: 'ja-JP', ko: 'ko-KR' };

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('education.meta');
  const description = t('description', { count: TRAINING.moduleCount });
  return {
    title: t('title'),
    description,
    openGraph: { title: t('title'), description, images: [{ url: '/images/hero.webp', width: 1200, height: 630 }] },
  };
}

export default async function ProgramsPage() {
  const t = await getTranslations('education');
  const tSite = await getTranslations('site');
  const locale = (await getLocale()) as Locale;

  // Exam dates come only from exam_sessions. Training sessions are not in the database.
  const sessions = await getUpcomingExamSessions();
  const next = sessions[0] ?? null;
  const nextPostpartum = sessions.find((s) => s.examType === 'postpartum') ?? null;
  const typeLabel = (type: 'postpartum' | 'birth') => (type === 'birth' ? tSite('examType.birth') : tSite('examType.postpartum'));

  const fee = usd(EXAM.feeUsd);
  const days = range(TRAINING.inPersonDays);
  const moduleCount = TRAINING.moduleCount;

  const languageName: Record<ProgramLanguage, string> = {
    en: t('language.en'),
    zh: t('language.zh'),
    ja: t('language.ja'),
    ko: t('language.ko'),
  };
  const languages = new Intl.ListFormat(INTL_LOCALE[locale] ?? 'en-GB', { style: 'long', type: 'conjunction' }).format(
    PROGRAM_LANGUAGES.map((l) => languageName[l.code])
  );

  const cjk = {
    zh: (c: React.ReactNode) => <span lang="zh-Hans">{c}</span>,
    ko: (c: React.ReactNode) => <span lang="ko">{c}</span>,
    ja: (c: React.ReactNode) => <span lang="ja">{c}</span>,
  };
  const moduleText: Record<ModuleKey, React.ReactNode> = {
    postpartumRecovery: t('module.postpartumRecovery'),
    newbornCare: t('module.newbornCare'),
    breastfeedingSupport: t('module.breastfeedingSupport'),
    culturalTraditions: t.rich('module.culturalTraditions', cjk),
    nutrition: t('module.nutrition'),
    emotionalWellness: t('module.emotionalWellness'),
    safetyEmergency: t('module.safetyEmergency', { provider: TRAINING.cpr.provider, emergency: EMERGENCY_NUMBER }),
  };
  const moduleTitle: Record<ModuleKey, string> = {
    postpartumRecovery: t('moduleTitle.postpartumRecovery'),
    newbornCare: t('moduleTitle.newbornCare'),
    breastfeedingSupport: t('moduleTitle.breastfeedingSupport'),
    culturalTraditions: t('moduleTitle.culturalTraditions'),
    nutrition: t('moduleTitle.nutrition'),
    emotionalWellness: t('moduleTitle.emotionalWellness'),
    safetyEmergency: t('moduleTitle.safetyEmergency'),
  };

  const tileFacts = [
    ...(nextPostpartum ? [{ label: t('tiles.nextExam'), value: formatExamDate(nextPostpartum.date, locale) }] : []),
    { label: t('tiles.examFee'), value: t('tiles.examFeeValue', { fee }) },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([{ name: t('breadcrumb'), path: '/programs' }])),
        }}
      />
      <Breadcrumb items={[{ label: t('breadcrumb') }]} />

      <Hero
        title={t('hero.title')}
        line={t('hero.line')}
        deadline={
          next
            ? tSite('hero.nextExam', { type: typeLabel(next.examType), date: formatExamDate(next.date, locale) })
            : undefined
        }
        actions={[
          { href: '#exam-dates', label: t('hero.examDates') },
          { href: '#train-the-trainer', label: t('hero.teach') },
        ]}
        image={{ src: '/images/2026/ada-trainer-slide.jpg', alt: t('hero.photoAlt'), position: '40% 50%' }}
      />

      <div className="pt-20">
        <Tiles
          title={t('tiles.title')}
          primary={{
            title: t('tiles.postpartumTitle'),
            href: '#modules',
            description: t('tiles.postpartumText', { count: moduleCount, days }),
            facts: tileFacts,
            action: { href: '#exam-dates', label: t('tiles.examDates') },
            link: { href: '/certifications/postpartum-doula', label: t('tiles.credential') },
          }}
          others={[
            {
              title: t('tiles.birthTitle'),
              href: '/certifications/birth-doula',
              description: t('tiles.birthText'),
              links: [
                { href: '/certifications/birth-doula', label: t('tiles.birthProgram') },
                { href: '/support/contact', label: t('tiles.birthCohort') },
              ],
            },
            {
              title: t('tiles.coursesTitle'),
              href: '#teach',
              description: t('tiles.coursesText'),
              links: [
                { href: '/certifications/ibclc', label: t('tiles.ibclc') },
                { href: '#continuing-education', label: t('tiles.ce') },
                { href: '#train-the-trainer', label: t('tiles.teach') },
              ],
            },
          ]}
        />
      </div>

      <RuledRows
        className="pt-24"
        title={t('how.title')}
        id="how-title"
        image={{ src: '/images/2026/ada-course-practice.jpg', alt: t('how.photoAlt'), caption: t('how.photoCaption') }}
        rows={[
          { label: t('how.curriculum'), value: t('how.curriculumText') },
          { label: t('how.teaching'), value: t('how.teachingText') },
          { label: t('how.examination'), value: t('how.examinationText') },
          { label: t('how.registry'), value: t('how.registryText') },
          { label: t('how.languages'), value: t('how.languagesText', { languages }) },
        ]}
        link={{ href: '#exam-dates', label: t('how.link') }}
      />

      <section id="modules" aria-labelledby="modules-title" className="bg-white pt-24 scroll-mt-6">
        <div className="ada2-wrap flex flex-col gap-7">
          <div className="flex flex-col gap-3">
            <h2 id="modules-title" className={h2Class}>
              {t('program.title')}
            </h2>
            <p className="m-0 max-w-[820px] text-ada2-body [text-wrap:pretty]">{t('program.intro')}</p>
          </div>
          <div className="flex flex-wrap items-start gap-x-16 gap-y-10">
            <div className="flex-[3_1_560px] min-w-0 flex flex-col gap-3">
              <h3 className={h3Class}>{t('program.modulesTitle', { count: moduleCount })}</h3>
              <Rows
                className="hidden sm:flex"
                labelWidth={220}
                rows={TRAINING_MODULES.map((m) => ({ label: moduleTitle[m.key], value: moduleText[m.key] }))}
              />
              <DisclosureList
                className="sm:hidden"
                items={TRAINING_MODULES.map((m) => ({ title: moduleTitle[m.key], body: <p className="m-0">{moduleText[m.key]}</p> }))}
              />
            </div>
            <div className="flex-[2_1_360px] min-w-0 flex flex-col gap-3">
              <h3 className={h3Class}>{t('program.detailsTitle')}</h3>
              <Rows
                compact
                labelWidth={128}
                rows={[
                  { label: t('program.format'), value: t('program.formatValue', { days }) },
                  { label: t('program.includes'), value: t('program.includesValue', { provider: TRAINING.cpr.provider }) },
                  { label: t('program.tuition'), value: t('program.tuitionValue') },
                  {
                    label: t('program.scholarships'),
                    value: t.rich('program.scholarshipsValue', {
                      link: (c) => (
                        <Link href="/programs/scholarship" className={`${inlineLink} whitespace-nowrap`}>
                          {c}
                        </Link>
                      ),
                    }),
                  },
                  { label: t('program.leadsTo'), value: t('program.leadsToValue', { fee }) },
                ]}
              />
              <CtaBox
                className="mt-5 flex-none max-w-none"
                title={
                  nextPostpartum
                    ? t('program.ctaNext', { date: formatExamDate(nextPostpartum.date, locale) })
                    : t('program.ctaNone')
                }
                action={{ href: '#exam-dates', label: t('program.ctaAction') }}
              />
            </div>
          </div>
        </div>
      </section>

      <section id="exam-dates" aria-labelledby="exam-dates-title" className="bg-white pt-24 scroll-mt-6">
        <div className="ada2-wrap">
          <DatesTable
            sessions={sessions}
            id="exam-dates-title"
            title={t('dates.title')}
            intro={t('dates.intro', { fee })}
          />
        </div>
      </section>

      <section id="teach" aria-labelledby="teach-title" className="bg-white pt-24 pb-[104px] scroll-mt-6">
        <div className="ada2-wrap flex flex-wrap items-start gap-x-16 gap-y-10">
          <div className="flex-[3_1_560px] min-w-0 flex flex-col gap-5">
            <h2 id="teach-title" className={h2Class}>
              {t('teach.title')}
            </h2>
            <Rows
              labelWidth={220}
              rows={[
                { id: 'continuing-education', label: t('teach.ce'), value: t('teach.ceText') },
                { id: 'train-the-trainer', label: t('teach.trainer'), value: t('teach.trainerText') },
                { label: t('teach.provider'), value: t('teach.providerText') },
              ]}
            />
            <p className="m-0 text-[16px] leading-[25px] text-ada2-body [text-wrap:pretty]">
              {t.rich('teach.apply', {
                email: CONTACT.email,
                mail: (c) => (
                  <a href={`mailto:${CONTACT.email}`} className={`${inlineLink} whitespace-nowrap`}>
                    {c}
                  </a>
                ),
              })}
            </p>
          </div>
          <aside
            aria-labelledby="verify-trainer-title"
            className="flex-[2_1_360px] min-w-0 box-border flex flex-col items-start gap-4 pt-7 px-7 pb-[30px] bg-ada2-band border-t-2 border-ada2-blossom"
          >
            <h2 id="verify-trainer-title" className="m-0 text-[28px] leading-[35px] font-light text-ada2-ink [text-wrap:balance]">
              {t('teach.verifyTitle')}
            </h2>
            <p className="m-0 text-[16px] leading-[25px] text-ada2-body [text-wrap:pretty]">{t('teach.verifyText')}</p>
            <Pill href="/verify" variant="registry" icon="search">
              {t('teach.verifyAction')}
            </Pill>
          </aside>
        </div>
      </section>
    </>
  );
}
