/**
 * Legal.dc.html template, shared by /privacy-policy and /terms-of-service.
 *
 * Page chrome (title, lead, "Legal pages", "On this page", the CTA) comes from
 * the `legal` namespace. The legal text itself is passed in as `sections` and
 * stays exactly as published on the live pages, in English, in every locale
 * (it is reviewed separately; scripts/check-banned.mjs excludes these two
 * folders). Other locales get a note that the English text governs, and the
 * body is marked lang="en".
 */
import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import { Breadcrumb, CtaBox } from '@/components/site';
import { htmlLang, type Locale } from '@/i18n/config';
import { ENTITY } from '@/lib/facts';
import { breadcrumbJsonLd } from '@/lib/json-ld';
import { formatExamDate } from '@/lib/site-dates';
import { cn } from '@/lib/utils';
import { PageIntro, h2Class } from '../support/_kit/page-shell';

export interface LegalSection {
  id: string;
  /** Section heading, verbatim from the live page. */
  title: string;
  body: ReactNode;
}

const PAGES = [
  { key: 'privacy', href: '/privacy-policy' },
  { key: 'terms', href: '/terms-of-service' },
] as const;

export async function LegalPage({
  current,
  updatedIso,
  intro,
  sections,
}: {
  current: 'privacy' | 'terms';
  /** "Last updated" date of the live text, YYYY-MM-DD. */
  updatedIso: string;
  /** The unheaded opening paragraph, verbatim. */
  intro: ReactNode;
  sections: LegalSection[];
}) {
  const t = await getTranslations('legal');
  const locale = (await getLocale()) as Locale;
  const title = current === 'privacy' ? t('privacy') : t('terms');
  const path = current === 'privacy' ? '/privacy-policy' : '/terms-of-service';
  const pageLabel = { privacy: t('privacy'), terms: t('terms') };

  const cta =
    current === 'privacy' ? (
      <CtaBox
        title={t('privacyCta.title')}
        action={{ href: 'mailto:privacy@asiandoula.org?subject=Privacy%20Request', label: t('privacyCta.action') }}
      />
    ) : (
      <CtaBox
        title={t('termsCta.title')}
        action={{ href: 'mailto:contact@asiandoula.org', label: t('termsCta.action') }}
      />
    );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: title, path }])) }}
      />
      <Breadcrumb items={[{ label: title }]} />
      <div className="ada2-wrap pt-12 pb-[104px] flex flex-col gap-12">
        <PageIntro
          className="max-w-[880px]"
          title={title}
          lead={current === 'privacy' ? t('privacyLead') : t('termsLead')}
          note={
            <>
              {t('updated', { date: formatExamDate(updatedIso, locale, { weekday: false }) })}
              {' · '}
              {t('entity', { legalName: ENTITY.legalName, dba: ENTITY.dba })}
            </>
          }
        >
          {locale !== 'en' ? (
            <p className="m-0 mt-2 max-w-[760px] pt-4 px-5 pb-[18px] bg-white border border-ada2-hairline text-[16px] leading-6 text-ada2-ink [text-wrap:pretty]">
              {t('englishNote')}
            </p>
          ) : null}
        </PageIntro>

        <div className="flex flex-wrap items-start gap-x-12 gap-y-10">
          <div className="flex-[1_1_220px] min-w-0 flex flex-col gap-8 min-[1120px]:sticky min-[1120px]:top-6 min-[1120px]:max-h-[calc(100vh-48px)] min-[1120px]:overflow-y-auto">
            <nav aria-labelledby="pages-title" className="flex flex-col gap-2">
              <h2 id="pages-title" className="m-0 text-[17px] leading-[22px] font-semibold text-ada2-ink">
                {t('pages')}
              </h2>
              <ul className="m-0 p-0 list-none border-t-2 border-ada2-ink">
                {PAGES.map((p) => {
                  const on = p.key === current;
                  return (
                    <li key={p.key} className="border-b border-ada2-hairline">
                      <Link
                        href={p.href}
                        aria-current={on ? 'page' : undefined}
                        className={cn(
                          'flex items-center min-h-[44px] box-border pl-3 pr-1 text-[16px] leading-[22px] no-underline focus-visible:![outline-offset:-3px]',
                          on
                            ? 'shadow-[inset_3px_0_0_#111827] text-ada2-ink font-semibold hover:text-ada2-ink'
                            : 'text-ada2-body hover:bg-ada2-band hover:text-ada2-body'
                        )}
                      >
                        {pageLabel[p.key]}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <nav aria-labelledby="toc-title" className="flex flex-col gap-2">
              <h2 id="toc-title" className="m-0 text-[17px] leading-[22px] font-semibold text-ada2-ink">
                {t('onThisPage')}
              </h2>
              <ul lang="en" className="m-0 p-0 list-none border-t-2 border-ada2-ink">
                {sections.map((s) => (
                  <li key={s.id} className="border-b border-ada2-hairline">
                    <a
                      href={`#${s.id}`}
                      className="flex items-center min-h-[44px] box-border py-1.5 px-1 text-ada2-body text-[15px] leading-[21px] no-underline hover:bg-ada2-band hover:text-ada2-body focus-visible:![outline-offset:-3px]"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div lang={locale === 'en' ? undefined : htmlLang.en} className="flex-[999_1_560px] min-w-0 flex flex-col gap-14">
            <div className="max-w-[720px] text-ada2-body [text-wrap:pretty]">{intro}</div>
            {sections.map((s) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="flex flex-col gap-4 scroll-mt-6">
                <h2 id={`${s.id}-title`} className={h2Class}>
                  {s.title}
                </h2>
                {s.body}
              </section>
            ))}
          </div>

          {cta}
        </div>
      </div>
    </>
  );
}

/** Body paragraph of the legal text (max 720px). */
export function LegalP({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('m-0 max-w-[720px] text-ada2-body [text-wrap:pretty]', className)}>{children}</p>;
}
