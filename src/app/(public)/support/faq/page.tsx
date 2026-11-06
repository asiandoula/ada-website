import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { Breadcrumb, CtaBox } from '@/components/site';
import type { Locale } from '@/i18n/config';
import {
  CERTIFICATE,
  CONTACT,
  ENTITY,
  EXAM,
  INSURANCE_RECOGNITION,
  PROGRAM_LANGUAGES,
  RENEWAL,
  TRAINING,
  TRAINING_MODULES,
  range,
  usd,
} from '@/lib/facts';
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/json-ld';
import { InnerPage, JumpList, PageIntro, PageSection } from '../_kit/page-shell';
import { FaqAccordion, type FaqItemView } from './faq-accordion';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('faq.meta');
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: `${t('title')} | Asian Doula Alliance`,
      description: t('description'),
      images: [{ url: '/images/hero.webp', width: 1200, height: 630 }],
    },
  };
}

const LIST_LOCALE: Record<Locale, string> = {
  en: 'en-US',
  'zh-cn': 'zh-CN',
  'zh-tw': 'zh-TW',
  ja: 'ja-JP',
  ko: 'ko-KR',
};

type GroupKey = 'candidates' | 'doulas' | 'families' | 'insurers' | 'providers' | 'about';

/**
 * The live FAQ answers (faq-data.ts, now in messages/<locale>/faq.json),
 * regrouped by audience as on FAQ.dc.html. Every figure is an argument from
 * facts.ts. Removed from the old data: the partner-agency mention, "5
 * languages", insurers not in INSURANCE_RECOGNITION, and the exam-site address
 * as a training location (it appears here only as the exam location).
 */
export default async function FAQPage() {
  const t = await getTranslations('faq');
  const locale = (await getLocale()) as Locale;
  const list = (items: readonly string[]) =>
    new Intl.ListFormat(LIST_LOCALE[locale] ?? 'en-US', { style: 'long', type: 'conjunction' }).format(items);

  const langName: Record<(typeof PROGRAM_LANGUAGES)[number]['code'], string> = {
    en: t('lang.en'),
    zh: t('lang.zh'),
    ja: t('lang.ja'),
    ko: t('lang.ko'),
  };
  const moduleName: Record<(typeof TRAINING_MODULES)[number]['key'], string> = {
    postpartumRecovery: t('modules.postpartumRecovery'),
    newbornCare: t('modules.newbornCare'),
    breastfeedingSupport: t('modules.breastfeedingSupport'),
    culturalTraditions: t('modules.culturalTraditions'),
    nutrition: t('modules.nutrition'),
    emotionalWellness: t('modules.emotionalWellness'),
    safetyEmergency: t('modules.safetyEmergency'),
  };
  const languages = list(PROGRAM_LANGUAGES.map((l) => langName[l.code]));
  const insurers = list([...INSURANCE_RECOGNITION]);
  const email = CONTACT.email;

  const groups: { key: GroupKey; title: string; items: FaqItemView[] }[] = [
    {
      key: 'candidates',
      title: t('groups.candidates'),
      items: [
        {
          id: 'become',
          q: t('candidates.becomeQ'),
          a: t('candidates.becomeA', {
            written: EXAM.writtenMinutes,
            practical: EXAM.practicalMinutes,
            pass: EXAM.passScore,
            max: EXAM.maxScore,
          }),
          link: { href: '/certifications/postpartum-doula', label: t('candidates.becomeLink') },
        },
        { id: 'experience', q: t('candidates.experienceQ'), a: t('candidates.experienceA') },
        {
          id: 'cost',
          q: t('candidates.costQ'),
          a: t('candidates.costA', { fee: usd(EXAM.feeUsd) }),
          link: { href: '/exam-dates', label: t('candidates.costLink') },
        },
        {
          id: 'scholarship',
          q: t('candidates.scholarshipQ'),
          a: t('candidates.scholarshipA'),
          link: { href: '/programs/scholarship', label: t('candidates.scholarshipLink') },
        },
        { id: 'languages', q: t('candidates.languagesQ'), a: t('candidates.languagesA', { languages }) },
        {
          id: 'training',
          q: t('candidates.trainingQ'),
          a: t('candidates.trainingA', { days: range(TRAINING.inPersonDays), modules: TRAINING.moduleCount }),
          link: { href: '/programs', label: t('candidates.trainingLink') },
        },
        {
          id: 'register',
          q: t('candidates.registerQ'),
          a: t('candidates.registerA', { email, phone: CONTACT.phone.display }),
        },
        {
          id: 'location',
          q: t('candidates.locationQ'),
          a: t('candidates.locationA', { location: EXAM.location.oneLine }),
        },
        {
          id: 'results',
          q: t('candidates.resultsQ'),
          a: t('candidates.resultsA', {
            days: range(EXAM.resultsBusinessDays),
            wait: EXAM.retakeWaitDays,
            retakeFee: usd(EXAM.retakeFeeUsd),
          }),
          link: { href: '/exam-day', label: t('candidates.resultsLink') },
        },
      ],
    },
    {
      key: 'doulas',
      title: t('groups.doulas'),
      items: [
        {
          id: 'validity',
          q: t('doulas.validityQ'),
          a: t('doulas.validityA', { years: CERTIFICATE.validityYears }),
        },
        {
          id: 'renew',
          q: t('doulas.renewQ'),
          a: t('doulas.renewA', { fee: usd(RENEWAL.feeUsd) }),
          link: { href: '/for-doulas/renew', label: t('doulas.renewLink') },
        },
        {
          id: 'checked',
          q: t('doulas.checkedQ'),
          a: t('doulas.checkedA'),
          link: { href: '/verify', label: t('doulas.checkedLink'), tone: 'registry' },
        },
      ],
    },
    {
      key: 'families',
      title: t('groups.families'),
      items: [
        {
          id: 'check',
          q: t('families.checkQ'),
          a: t('families.checkA'),
          link: { href: '/verify', label: t('families.checkLink'), tone: 'registry' },
        },
        {
          id: 'find',
          q: t('families.findQ'),
          a: t('families.findA', { email }),
          link: { href: '/for-families/find-a-doula', label: t('families.findLink') },
        },
        { id: 'insurance', q: t('families.insuranceQ'), a: t('families.insuranceA', { insurers }) },
        {
          id: 'concern',
          q: t('families.concernQ'),
          a: t('families.concernA', { email }),
          link: { href: '/for-doulas/code-of-conduct', label: t('families.concernLink') },
        },
      ],
    },
    {
      key: 'insurers',
      title: t('groups.insurers'),
      items: [
        {
          id: 'source',
          q: t('insurers.sourceQ'),
          a: t('insurers.sourceA'),
          link: { href: '/verify', label: t('insurers.sourceLink'), tone: 'registry' },
        },
        { id: 'recognition', q: t('insurers.recognitionQ'), a: t('insurers.recognitionA', { insurers }) },
        { id: 'bulk', q: t('insurers.bulkQ'), a: t('insurers.bulkA', { email }) },
      ],
    },
    {
      key: 'providers',
      title: t('groups.providers'),
      items: [
        {
          id: 'approved',
          q: t('providers.approvedQ'),
          a: t('providers.approvedA', { email }),
          link: { href: '/programs', label: t('providers.approvedLink') },
        },
        { id: 'registration', q: t('providers.registrationQ'), a: t('providers.registrationA') },
        {
          id: 'curriculum',
          q: t('providers.curriculumQ'),
          a: t('providers.curriculumA', {
            count: TRAINING.moduleCount,
            modules: list(TRAINING_MODULES.map((m) => moduleName[m.key])),
          }),
        },
      ],
    },
    {
      key: 'about',
      title: t('groups.about'),
      items: [
        {
          id: 'what',
          q: t('about.whatQ'),
          a: t('about.whatA', { taxCode: ENTITY.taxCode, legalName: ENTITY.legalName }),
        },
        { id: 'different', q: t('about.differentQ'), a: t('about.differentA', { languages, insurers }) },
        { id: 'only-asian', q: t('about.onlyAsianQ'), a: t('about.onlyAsianA') },
      ],
    },
  ];

  const jsonLd = faqJsonLd(groups.flatMap((g) => g.items.map((i) => ({ q: i.q, a: i.a }))));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: t('breadcrumb.help'), path: '/support' },
              { name: t('breadcrumb.current'), path: '/support/faq' },
            ])
          ),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumb items={[{ label: t('breadcrumb.help'), href: '/support' }, { label: t('breadcrumb.current') }]} />
      <InnerPage
        rail={<CtaBox title={t('cta.title')} action={{ href: '/support/contact', label: t('cta.action') }} />}
      >
        <div className="flex flex-col gap-12">
          <PageIntro title={t('intro.title')} lead={t('intro.lead')} note={t('intro.note')} />
          <JumpList
            id="otp-title"
            title={t('onThisPage')}
            items={groups.map((g) => ({ href: `#${g.key}`, label: g.title }))}
          />
        </div>
        {groups.map((g) => (
          <PageSection key={g.key} id={g.key} title={g.title}>
            <FaqAccordion items={g.items.map((i) => ({ ...i, id: `${g.key}-${i.id}` }))} />
          </PageSection>
        ))}
      </InnerPage>
    </>
  );
}
