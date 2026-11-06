/**
 * "No ADA record matches …" (board Verify.dc.html, not-found view). Used by the
 * search page and by /verify/[code] when a link matches nothing public.
 */
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/config';
import { inlineLinkClassName, Pill } from '@/components/site';
import { CONTACT } from '@/lib/facts';
import { cn } from '@/lib/utils';
import { formatRetrievedLine } from '../_lib/text';

export function RegistryNotFound({
  query,
  numberLike,
  retrievedAt,
  headingLevel = 'h2',
  headingId = 'nf-h',
}: {
  query: string;
  /** The query was a number or code (the switch then offers a name search). */
  numberLike: boolean;
  retrievedAt: Date;
  headingLevel?: 'h1' | 'h2';
  headingId?: string;
}) {
  const t = useTranslations('verify.notFound');
  const tr = useTranslations('verify.results');
  const locale = useLocale() as Locale;
  const H = headingLevel;
  return (
    <section
      aria-labelledby={headingId}
      className="flex flex-col gap-3 pt-6 px-7 pb-7 max-[480px]:px-4 bg-white border border-solid border-ada2-hairline border-t-2 border-t-ada2-ink"
    >
      <H id={headingId} className="m-0 text-[28px] leading-[35px] font-light text-ada2-ink [text-wrap:balance] break-words">
        {t('heading', { query })}
      </H>
      <p className="m-0 max-w-[680px] text-ada2-body [text-wrap:pretty]">{t('body')}</p>
      <p className="m-0 text-[14px] leading-[21px] text-ada2-muted [font-variant-numeric:tabular-nums_lining-nums]">
        {tr('retrieved', { when: formatRetrievedLine(retrievedAt, locale) })}
      </p>
      <ul className="mt-2 mb-0 p-0 list-none max-w-[680px] border-t border-solid border-ada2-hairline">
        <li className="py-3 border-b border-solid border-ada2-hairline [text-wrap:pretty]">{t('tipNative')}</li>
        <li className="py-3 border-b border-solid border-ada2-hairline [text-wrap:pretty]">
          {t.rich('tipNumber', {
            pattern: 'ADA-PD-YYYY-NNNN',
            id: (chunks) => (
              <span className="font-semibold text-ada2-blossom whitespace-nowrap [font-variant-numeric:tabular-nums_lining-nums]">{chunks}</span>
            ),
          })}
        </li>
        <li className="py-3 border-b border-solid border-ada2-hairline [text-wrap:pretty]">{t('tipHash')}</li>
      </ul>
      <p className="m-0 max-w-[680px] [text-wrap:pretty]">
        {t.rich('contact', {
          email: CONTACT.email,
          link: (chunks) => (
            <a href={`mailto:${CONTACT.email}`} className={cn(inlineLinkClassName, 'whitespace-nowrap')}>
              {chunks}
            </a>
          ),
        })}
      </p>
      <div className="flex flex-wrap gap-3 pt-2">
        <Pill href={numberLike ? '/verify?by=name#search' : '/verify?by=number#search'} variant="secondary">
          {numberLike ? t('byName') : t('byNumber')}
        </Pill>
      </div>
    </section>
  );
}
