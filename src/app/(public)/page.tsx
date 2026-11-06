/**
 * Home (boards HomeC, HomeCMobile, HomeCZh).
 *
 * Gates: the hero's dated line and the tile's "Next exam" appear only from a
 * real exam session; the alert card shows itself only within 14 days of one.
 * Registry counts are read live (see getRegistryCounts) and the line is left
 * out if the read fails. Every other figure comes from src/lib/facts.ts.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { unstable_cache } from 'next/cache';
import type { ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import { getLocale, getTranslations } from 'next-intl/server';
import { AlertCard, ArrowLink, Hero, LinkList, RuledRows, Tiles, VerifyField } from '@/components/site';
import { ChevronIcon } from '@/components/site/icons';
import type { Locale } from '@/i18n/config';
import { getUpcomingExamSessions } from '@/lib/exam-sessions';
import { CERTIFICATE, CONTACT, EXAM, INSURANCE_RECOGNITION, TRAINING, range, usd } from '@/lib/facts';
import { organizationJsonLd } from '@/lib/json-ld';
import { formatExamDate, todayInPacific } from '@/lib/site-dates';
import { cn } from '@/lib/utils';
import { formatList, programLanguages } from './exam-dates/_components';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('home.meta');
  return {
    title: { absolute: t('title') },
    description: t('description'),
    alternates: { canonical: '/' },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: 'https://asiandoula.org',
      images: [{ url: '/images/hero.webp', width: 1200, height: 630 }],
    },
  };
}

// ---------------------------------------------------------------------------
// Registry counts (live)
// ---------------------------------------------------------------------------

/** PostgREST returns at most this many rows per read; at the cap the count would be short, so it is not shown. */
const ROW_CAP = 1000;

/** Doula-level states under which the record does not read as active (same overrides as /verify/[code]). */
const NOT_ACTIVE_DOULA = new Set(['revoked', 'suspended', 'under_investigation', 'retired']);

interface RegistryCounts {
  /** Doulas with at least one credential that reads as active on their record today. */
  doulas: number;
  /** Certificates issued and not revoked (current or superseded by a renewal). */
  certificates: number;
  /** The Pacific calendar day the counts were taken, "YYYY-MM-DD". */
  asOf: string;
}

/**
 * Same read as the verify API (service role, server only). A credential
 * counts when its status is `active` and its expiration date has not passed,
 * because the record page shows a past-dated credential as expired whatever
 * its status says. Throws on any error so a failed read is not cached.
 */
async function readRegistryCounts(): Promise<RegistryCounts> {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
  const today = todayInPacific();
  const [creds, certs] = await Promise.all([
    supabase
      .from('doula_credentials')
      .select('doula_id, expiration_date, doulas!inner(status)')
      .eq('status', 'active')
      .or(`expiration_date.is.null,expiration_date.gte.${today}`)
      .range(0, ROW_CAP - 1),
    supabase.from('certificates').select('id', { count: 'exact', head: true }).neq('status', 'revoked'),
  ]);
  if (creds.error || !creds.data) throw new Error('registry counts: credentials read failed');
  if (certs.error || typeof certs.count !== 'number') throw new Error('registry counts: certificates read failed');
  if (creds.data.length >= ROW_CAP) throw new Error('registry counts: row cap reached');

  const doulas = new Set<string>();
  for (const row of creds.data as { doula_id: string; doulas: { status: string | null } | { status: string | null }[] | null }[]) {
    const doula = Array.isArray(row.doulas) ? row.doulas[0] : row.doulas;
    if (!doula || NOT_ACTIVE_DOULA.has(doula.status ?? '')) continue;
    doulas.add(row.doula_id);
  }
  if (doulas.size === 0 || certs.count === 0) throw new Error('registry counts: empty');
  return { doulas: doulas.size, certificates: certs.count, asOf: today };
}

const cachedRegistryCounts = unstable_cache(readRegistryCounts, ['home-registry-counts-v1'], { revalidate: 600 });

/** Live counts for the registry band, or null (the line is then left out). */
async function getRegistryCounts(): Promise<RegistryCounts | null> {
  try {
    return await cachedRegistryCounts();
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Page parts
// ---------------------------------------------------------------------------

/** Board example IDs: checked to match no real record. Labelled "For example" on the page. */
const EXAMPLE = { cert: 'ADA-PD-2026-0142', id: '#25-3107', name: 'Mei Lin Chen' };

const nowrap = (chunks: ReactNode) => <span className="whitespace-nowrap">{chunks}</span>;
const strong = (chunks: ReactNode) => <strong className="font-semibold text-ada2-ink">{chunks}</strong>;

/** HomeC families / insurers column: a ruled heading, one sentence and ruled sublinks. */
function AudienceColumn({
  id,
  title,
  body,
  links,
}: {
  id: string;
  title: ReactNode;
  body: ReactNode;
  links: { href: string; label: ReactNode; registry?: boolean }[];
}) {
  return (
    <article aria-labelledby={id} className="flex-[1_1_440px] min-w-0 flex flex-col border-t-2 border-ada2-ink">
      <h2
        id={id}
        className="m-0 pt-4 pb-1.5 text-[26px] leading-[32px] sm:pt-5 sm:pb-2 sm:text-[28px] sm:leading-[35px] font-light text-ada2-ink"
      >
        {title}
      </h2>
      <p className="m-0 pb-[18px] text-[16px] leading-6 text-ada2-body [text-wrap:pretty]">{body}</p>
      <ul className="m-0 p-0 list-none border-b border-ada2-hairline">
        {links.map((l) => (
          <li key={l.href} className="border-t border-ada2-hairline">
            <Link
              href={l.href}
              className={cn(
                'flex items-center justify-between gap-3 min-h-[48px] text-[16px] leading-[22px] no-underline hover:bg-ada2-band',
                l.registry ? 'text-ada2-blossom hover:text-ada2-blossom-hover' : 'text-ada2-body hover:text-ada2-body'
              )}
            >
              {l.label}
              <ChevronIcon />
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}

const h2Band = 'm-0 text-[28px] leading-[34px] sm:text-[36px] sm:leading-[44px] font-light text-ada2-ink [text-wrap:balance]';

export default async function HomePage() {
  const [t, tSite, locale, sessions, counts] = await Promise.all([
    getTranslations('home'),
    getTranslations('site'),
    getLocale() as Promise<Locale>,
    getUpcomingExamSessions(),
    getRegistryCounts(),
  ]);

  // sessions[0] is getNextExamSession() (same query, ascending); reused to save a round-trip.
  const next = sessions[0] ?? null;
  const nextPostpartum = sessions.find((s) => s.examType === 'postpartum') ?? null;
  const languages = programLanguages(
    { en: t('languages.en'), zh: t('languages.zh'), ja: t('languages.ja'), ko: t('languages.ko') },
    locale);

  const heroDeadline = next
    ? tSite('hero.nextExam', { type: tSite(`examType.${next.examType}`), date: formatExamDate(next.date, locale) })
    : undefined;

  const pdFacts = [
    ...(nextPostpartum
      ? [{ label: t('programs.postpartum.nextExam'), value: formatExamDate(nextPostpartum.date, locale) }]
      : []),
    { label: t('programs.postpartum.fee'), value: t('programs.postpartum.feeValue', { fee: usd(EXAM.feeUsd) }) },
    {
      label: t('programs.postpartum.validity'),
      value: t('programs.postpartum.validityValue', { years: CERTIFICATE.validityYears }),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />

      <AlertCard sessions={sessions} />

      <Hero
        title={t.rich('hero.title', { nw: nowrap })}
        line={heroDeadline ? undefined : t('hero.line', { languages })}
        deadline={heroDeadline}
        actions={[
          { href: '/exam-dates', label: t('hero.register') },
          { href: '/programs', label: t('hero.findCourse') },
        ]}
        image={{ src: '/images/2026/ada-training-band.jpg', alt: t('hero.imageAlt'), position: '20% 50%' }}
      />

      {/* REGISTRY BAND. On phones the verify block under the header holds the field, so the band does not repeat it. */}
      <section aria-labelledby="registry-title" className="bg-ada2-band border-b border-ada2-band-rule pt-8 pb-3 lg:pt-14 lg:pb-8">
        <div className="ada2-wrap flex flex-col gap-3 lg:gap-9">
          <div className="flex flex-wrap items-end gap-x-16 gap-y-7">
            <div className="flex-[1_1_440px] min-w-0 flex flex-col gap-3">
              <h2 id="registry-title" className={h2Band}>
                {t.rich('registry.title', { nw: nowrap })}
              </h2>
              <p className="m-0 max-w-[540px] text-[16px] leading-[25px] lg:text-[17px] lg:leading-[1.6] text-ada2-body [text-wrap:pretty]">
                {t('registry.body')}
              </p>
              <p className="lg:hidden m-0 text-[15px] leading-[22px] text-ada2-muted [text-wrap:pretty]">
                {t.rich('registry.exampleLong', { ...EXAMPLE, nw: nowrap })}
              </p>
            </div>
            <div className="hidden lg:flex flex-[1_1_560px] min-w-0 flex-col gap-2">
              <VerifyField variant="inline" id="home-registry-q" className="max-w-none" />
              <p className="m-0 text-[15px] leading-[22px] text-ada2-muted [text-wrap:pretty]">
                {t.rich('registry.example', { ...EXAMPLE, nw: nowrap })}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-1 mt-2 pt-3 border-t border-ada2-hairline text-[15px] leading-[22px] text-ada2-muted lg:mt-0 lg:pt-2 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-x-8">
            {counts ? (
              <p className="m-0 [font-variant-numeric:tabular-nums_lining-nums] [text-wrap:pretty]">
                {t.rich('registry.counts', {
                  date: formatExamDate(counts.asOf, locale, { weekday: false }),
                  doulas: counts.doulas,
                  certificates: counts.certificates,
                  b: strong,
                })}
              </p>
            ) : null}
            <ArrowLink href="/verify" tone="registry" size="sm">
              {t('registry.trainer')}
            </ArrowLink>
          </div>
        </div>
      </section>

      <div className="pt-9 pb-10 sm:py-[72px]">
        <Tiles
          title={t('programs.title')}
          primary={{
            title: t('programs.postpartum.title'),
            href: '/certifications/postpartum-doula',
            description: t('programs.postpartum.description', { modules: TRAINING.moduleCount }),
            facts: pdFacts,
            action: { href: '/exam-dates', label: t('programs.postpartum.register') },
            link: { href: '/certifications/postpartum-doula', label: t('programs.postpartum.requirements') },
          }}
          others={[
            {
              title: t('programs.birth.title'),
              href: '/certifications/birth-doula',
              description: t('programs.birth.description'),
              links: [
                { href: '/certifications/birth-doula', label: t('programs.birth.program') },
                { href: '/exam-dates#birth-doula', label: t('programs.birth.examDates') },
              ],
            },
            {
              title: t('programs.education.title'),
              href: '/programs',
              description: t('programs.education.description'),
              links: [
                { href: '/certifications/ibclc', label: t('programs.education.ibclc') },
                { href: '/programs#continuing-education', label: t('programs.education.ce') },
                { href: '/programs#train-the-trainer', label: t('programs.education.trainer') },
              ],
            },
          ]}
        />
      </div>

      <RuledRows
        id="exam-day-title"
        title={t('examDay.title')}
        className="bg-ada2-band pt-9 pb-8 sm:py-[72px]"
        image={{
          src: '/images/2026/ada-exam-written.jpg',
          alt: t('examDay.imageAlt'),
          caption: t('examDay.caption'),
        }}
        rows={[
          { label: t('examDay.bring'), value: t('examDay.bringValue') },
          { label: t('examDay.where'), value: EXAM.location.oneLine },
          { label: t('examDay.written'), value: t('examDay.writtenValue', { minutes: EXAM.writtenMinutes, languages }) },
          { label: t('examDay.practical'), value: t('examDay.practicalValue', { minutes: EXAM.practicalMinutes }) },
          {
            label: t('examDay.results'),
            value: t('examDay.resultsValue', {
              days: range(EXAM.resultsBusinessDays),
              pass: EXAM.passScore,
              max: EXAM.maxScore,
            }),
          },
        ]}
        link={{ href: '/exam-day', label: t('examDay.link') }}
      />

      <section aria-label={t('audiences.label')} className="bg-white pt-9 pb-2 sm:pt-[72px] sm:pb-6">
        <div className="ada2-wrap flex flex-wrap items-stretch gap-x-12 gap-y-8">
          <AudienceColumn
            id="families-title"
            title={t('audiences.families.title')}
            body={t('audiences.families.body')}
            links={[
              { href: '/verify', label: t('audiences.families.verify'), registry: true },
              { href: '/for-families/find-a-doula', label: t('audiences.families.find') },
              { href: '/programs', label: t('audiences.families.training') },
            ]}
          />
          <AudienceColumn
            id="insurers-title"
            title={t('audiences.insurers.title')}
            body={t('audiences.insurers.body', { insurers: formatList(INSURANCE_RECOGNITION, locale) })}
            links={[
              { href: '/verify', label: t('audiences.insurers.verify'), registry: true },
              { href: '/for-doulas/code-of-conduct', label: t('audiences.insurers.conduct') },
              { href: '/support/contact', label: t('audiences.insurers.contact') },
            ]}
          />
        </div>
      </section>

      <div className="pt-8 pb-11 sm:pt-12 sm:pb-[88px]">
        <LinkList
          title={t('about.title')}
          items={[
            { href: '/about-us', label: t('about.what'), description: t('about.whatDescription') },
            { href: '/about-us/board', label: t('about.governance'), description: t('about.governanceDescription') },
            { href: '/for-doulas/code-of-conduct', label: t('about.conduct'), description: t('about.conductDescription') },
            { href: '/programs', label: t('about.providers'), description: t('about.providersDescription') },
            {
              href: '/support/contact',
              label: t('about.contact'),
              description: t('about.contactDescription', { email: CONTACT.email }),
            },
          ]}
        />
      </div>
    </>
  );
}
