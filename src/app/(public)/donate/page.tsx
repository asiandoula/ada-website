import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import { Breadcrumb } from '@/components/site';
import { ArrowLink, pillClassName } from '@/components/site/pill';
import type { Locale } from '@/i18n/config';
import { ENTITY, PROGRAM_LANGUAGES } from '@/lib/facts';
import { breadcrumbJsonLd } from '@/lib/json-ld';
import { cn } from '@/lib/utils';
import { DefRows, PageIntro, h2Class, inlineLink, registryLink } from '../support/_kit/page-shell';

// Donorbox campaign slug — public value, safe to hardcode.
// Live: https://donorbox.org/general-fund-938446
// The payment mechanism is unchanged: a link to the hosted Donorbox page in a
// new tab, plus mailto:finance@ for check, wire and employer-match questions.
const DONORBOX_CAMPAIGN = 'general-fund-938446';
const DONORBOX_URL = `https://donorbox.org/${DONORBOX_CAMPAIGN}`;
const FINANCE_EMAIL = 'finance@asiandoula.org';

/** Month of the ADA training photos (board caption "August 2024"). */
const PHOTO_MONTH = { year: 2024, month: 8 } as const;

const INTL: Record<Locale, string> = { en: 'en-GB', 'zh-cn': 'zh-CN', 'zh-tw': 'zh-TW', ja: 'ja-JP', ko: 'ko-KR' };

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('donate.meta');
  const description = t('description', { taxCode: ENTITY.taxCode });
  return {
    title: t('title'),
    description,
    openGraph: { title: `${t('title')} | Asian Doula Alliance`, description, url: 'https://asiandoula.org/donate' },
  };
}

function SplitSection({
  id,
  title,
  side,
  children,
}: {
  id: string;
  title: ReactNode;
  side: ReactNode;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={`${id}-title`} className="flex flex-wrap items-start gap-x-16 gap-y-6">
      <div className="flex-[1_1_280px] min-w-0 flex flex-col gap-3">
        <h2 id={`${id}-title`} className={h2Class}>
          {title}
        </h2>
        {side}
      </div>
      <div className="flex-[999_1_560px] min-w-0">{children}</div>
    </section>
  );
}

export default async function DonatePage() {
  const t = await getTranslations('donate');
  const tLang = await getTranslations('faq.lang');
  const locale = (await getLocale()) as Locale;

  const langName = { en: tLang('en'), zh: tLang('zh'), ja: tLang('ja'), ko: tLang('ko') } as const;
  const languages = new Intl.ListFormat(INTL[locale] ?? 'en-GB', { style: 'long', type: 'conjunction' }).format(
    PROGRAM_LANGUAGES.map((l) => langName[l.code])
  );
  const photoDate = new Intl.DateTimeFormat(INTL[locale] ?? 'en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(PHOTO_MONTH.year, PHOTO_MONTH.month - 1, 1)));

  const financeMail = (chunks: ReactNode, subject?: string) => (
    <a
      href={`mailto:${FINANCE_EMAIL}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`}
      className={cn(inlineLink, 'whitespace-nowrap')}
    >
      {chunks}
    </a>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([{ name: t('breadcrumb'), path: '/donate' }])),
        }}
      />
      <Breadcrumb items={[{ label: t('breadcrumb') }]} />
      <div className="ada2-wrap pt-12 pb-[104px] flex flex-col gap-16">
        <PageIntro className="max-w-[880px]" title={t('title')} lead={t('lead')}>
          <p className="m-0 text-[17px] leading-6 font-semibold text-ada2-ink [font-variant-numeric:tabular-nums_lining-nums] [text-wrap:pretty]">
            {t('status', { taxCode: ENTITY.taxCode, ein: ENTITY.ein })}
          </p>
          <p className="m-0 text-[14px] leading-[21px] text-ada2-muted [text-wrap:pretty]">
            {t('taxNote', { legalName: ENTITY.legalName })}
          </p>
        </PageIntro>

        <div className="flex flex-wrap items-stretch gap-x-12 gap-y-8">
          <section
            aria-labelledby="give-title"
            className="flex-[1_1_520px] min-w-0 box-border flex flex-col gap-6 pt-7 px-[clamp(20px,2.4vw,32px)] pb-8 bg-ada2-band border-t-2 border-ada2-ink"
          >
            <h2 id="give-title" className={h2Class}>
              {t('give.title')}
            </h2>
            <p className="m-0 max-w-[560px] text-ada2-body [text-wrap:pretty]">{t('give.body')}</p>
            <div className="flex flex-col items-start gap-2.5 pt-1">
              <a
                href={DONORBOX_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('give.actionLabel')}
                className={pillClassName('primary', 'md')}
              >
                {t('give.action')}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
                </svg>
              </a>
              <p className="m-0 text-[14px] leading-[21px] text-ada2-muted">{t('give.newTab')}</p>
            </div>
            <div className="flex flex-col gap-1.5 pt-5 border-t border-ada2-hairline text-[14px] leading-[21px] text-ada2-muted">
              <p className="m-0 [text-wrap:pretty]">{t('give.secure')}</p>
              <p className="m-0 [text-wrap:pretty]">{t('give.receipt')}</p>
            </div>
          </section>
          <figure className="flex-[1_1_440px] min-w-0 m-0 flex flex-col gap-2.5">
            <div className="relative flex-[1_1_auto] min-h-[320px]">
              <Image
                src="/images/2026/ada-care-seated.jpg"
                alt={t('photo.alt')}
                fill
                sizes="(min-width: 1120px) 45vw, 100vw"
                className="object-cover"
                style={{ objectPosition: '30% 50%' }}
              />
            </div>
            <figcaption className="text-[14px] leading-5 text-ada2-muted">
              {t('photo.caption', { date: photoDate })}
            </figcaption>
          </figure>
        </div>

        <SplitSection
          id="funds"
          title={t('funds.title')}
          side={
            <>
              <p className="m-0 text-[16px] leading-[25px] text-ada2-muted [text-wrap:pretty]">{t('funds.side')}</p>
              <ArrowLink href="/about-us/financials" className="self-start">
                {t('funds.sideLink')}
              </ArrowLink>
            </>
          }
        >
          <DefRows
            labelWidth={200}
            rowClassName="py-3.5"
            rows={[
              {
                label: t('funds.scholarships'),
                value: (
                  <>
                    {t('funds.scholarshipsValue')}{' '}
                    <Link href="/programs/scholarship" className={cn(inlineLink, 'font-semibold whitespace-nowrap')}>
                      {t('funds.scholarshipsLink')}
                    </Link>
                  </>
                ),
              },
              {
                label: t('funds.materials'),
                value: t.rich('funds.materialsValue', {
                  languages,
                  zhHans: (chunks) => (
                    <span lang="zh-Hans" className="font-noto-sc">
                      {chunks}
                    </span>
                  ),
                  zhHant: (chunks) => (
                    <span lang="zh-Hant" className="font-noto-tc">
                      {chunks}
                    </span>
                  ),
                  ja: (chunks) => (
                    <span lang="ja" className="font-noto-jp">
                      {chunks}
                    </span>
                  ),
                  ko: (chunks) => (
                    <span lang="ko" className="font-noto-kr">
                      {chunks}
                    </span>
                  ),
                }),
              },
              {
                label: t('funds.registry'),
                value: t.rich('funds.registryValue', {
                  registry: (chunks) => (
                    <Link href="/verify" className={cn(registryLink, 'whitespace-nowrap')}>
                      {chunks}
                    </Link>
                  ),
                }),
              },
            ]}
          />
        </SplitSection>

        <SplitSection
          id="ways"
          title={t('ways.title')}
          side={
            <p className="m-0 text-[16px] leading-[25px] text-ada2-muted [text-wrap:pretty]">
              {t.rich('ways.side', { email: FINANCE_EMAIL, mail: (c) => financeMail(c) })}
            </p>
          }
        >
          <DefRows
            labelWidth={200}
            rowClassName="py-3.5"
            rows={[
              {
                label: t('ways.check'),
                value: t.rich('ways.checkValue', {
                  email: FINANCE_EMAIL,
                  mail: (c) => financeMail(c, 'Donation — Check or Wire Instructions'),
                }),
              },
              {
                label: t('ways.daf'),
                value: t('ways.dafValue', { legalName: ENTITY.legalName, dba: ENTITY.dba, ein: ENTITY.ein }),
              },
              {
                label: t('ways.employer'),
                value: t.rich('ways.employerValue', { mail: (c) => financeMail(c, 'Employer Match Question') }),
              },
            ]}
          />
        </SplitSection>
      </div>
    </>
  );
}
