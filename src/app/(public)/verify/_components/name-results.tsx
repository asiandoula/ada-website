/**
 * Name search results (board Verify.dc.html, "N records match"). A dark-header
 * table from md up; stacked rows on phones. Each row opens the record by
 * Doula ID. Statuses come from registry.ts; nothing here reads the DB.
 */
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/config';
import { StatusTag } from '@/components/site';
import { ArrowIcon } from '@/components/site/icons';
import { todayInPacific } from '@/lib/site-dates';
import { recordPath, type PublicRecord } from '../_lib/registry';
import { credentialLabel, credentialMeaning, formatRetrievedLine, nativeNameLang } from '../_lib/text';

function Credentials({ record, today }: { record: PublicRecord; today: string }) {
  const t = useTranslations('record');
  const tv = useTranslations('verify.results');
  const locale = useLocale() as Locale;
  if (record.credentials.length === 0) {
    return <span className="text-[15px] leading-[22px] text-ada2-muted [text-wrap:pretty]">{tv('noCredential')}</span>;
  }
  return (
    <div className="flex flex-col gap-3">
      {record.credentials.map((c) => (
        <div key={c.type} className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            <StatusTag status={c.status} />
            <span className="font-semibold text-ada2-ink">{credentialLabel(t, c.type)}</span>
          </div>
          <span className="text-[15px] leading-[22px] text-ada2-muted [text-wrap:pretty]">{credentialMeaning(t, c, locale, today)}</span>
        </div>
      ))}
    </div>
  );
}

function NameLink({ record, className }: { record: PublicRecord; className?: string }) {
  const lang = record.nativeName ? nativeNameLang(record.nativeName) : undefined;
  return (
    <Link href={recordPath(record)} className={`flex flex-col gap-0.5 min-h-[44px] text-ada2-blossom no-underline hover:text-ada2-blossom-hover ${className ?? ''}`}>
      <span className="text-[17px] leading-6 font-semibold underline underline-offset-[3px] [overflow-wrap:anywhere]">{record.name}</span>
      {record.nativeName ? (
        <span lang={lang} className="text-[15px] leading-[22px] text-ada2-muted">
          {record.nativeName}
        </span>
      ) : null}
    </Link>
  );
}

export function NameResults({
  query,
  records,
  truncated,
  retrievedAt,
}: {
  query: string;
  records: PublicRecord[];
  truncated: boolean;
  retrievedAt: Date;
}) {
  const t = useTranslations('verify.results');
  const locale = useLocale() as Locale;
  const today = todayInPacific(retrievedAt);
  const th = 'text-left align-bottom py-3 px-4 text-[14px] leading-[18px] font-semibold';
  const td = 'py-3.5 px-4 border-t border-solid border-ada2-hairline align-top';

  return (
    <section id="results" aria-labelledby="res-h" className="flex flex-col gap-4 scroll-mt-4">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <h2 id="res-h" className="m-0 text-[28px] leading-[35px] font-light text-ada2-ink [text-wrap:balance] [overflow-wrap:anywhere]">
          {t('heading', { count: records.length, query })}
        </h2>
        <span className="text-[14px] leading-[21px] text-ada2-muted [font-variant-numeric:tabular-nums_lining-nums]">
          {t('retrieved', { when: formatRetrievedLine(retrievedAt, locale) })}
        </span>
      </div>
      <p className="m-0 max-w-[720px] text-[16px] leading-[25px] text-ada2-body [text-wrap:pretty]">{t('scope')}</p>

      {/* md and up: the board's table */}
      <div className="hidden md:block relative overflow-x-auto border border-solid border-ada2-hairline">
        <table className="w-full border-collapse bg-white text-[16px] leading-[22px] [font-variant-numeric:tabular-nums_lining-nums]">
          <caption className="ada2-sr">{t('caption')}</caption>
          <thead>
            <tr className="bg-ada2-table-head text-white">
              <th scope="col" className={th}>
                {t('colName')}
              </th>
              <th scope="col" className={th}>
                {t('colId')}
              </th>
              <th scope="col" className={th}>
                {t('colCredential')}
              </th>
              <th scope="col" className="py-3 px-4">
                <span className="ada2-sr">{t('colRecord')}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.doulaId}>
                <td className={td}>
                  <NameLink record={r} />
                </td>
                <td className={td}>
                  <span className="font-semibold text-ada2-blossom whitespace-nowrap leading-6">{r.doulaId}</span>
                </td>
                <td className={td}>
                  <Credentials record={r} today={today} />
                </td>
                <td className="py-1 px-4 border-t border-solid border-ada2-hairline align-top text-right">
                  <Link
                    href={recordPath(r)}
                    aria-label={t('viewRecordFor', { name: r.name })}
                    className="inline-flex items-center gap-1.5 min-h-[44px] text-ada2-blossom font-semibold no-underline whitespace-nowrap hover:text-ada2-blossom-hover"
                  >
                    {t('viewRecord')}
                    <ArrowIcon />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phones: the same rows, stacked */}
      <ul className="md:hidden m-0 p-0 list-none border-t-2 border-solid border-ada2-ink" aria-label={t('caption')}>
        {records.map((r) => (
          <li key={r.doulaId} className="flex flex-col gap-2.5 py-3.5 border-b border-solid border-ada2-hairline">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <NameLink record={r} className="min-w-0" />
              <span className="font-semibold text-ada2-blossom whitespace-nowrap [font-variant-numeric:tabular-nums_lining-nums]">{r.doulaId}</span>
            </div>
            <Credentials record={r} today={today} />
            <Link
              href={recordPath(r)}
              aria-label={t('viewRecordFor', { name: r.name })}
              className="self-start inline-flex items-center gap-1.5 min-h-[44px] text-ada2-blossom font-semibold no-underline hover:text-ada2-blossom-hover"
            >
              {t('viewRecord')}
              <ArrowIcon />
            </Link>
          </li>
        ))}
      </ul>

      <p className="m-0 text-[15px] leading-[22px] text-ada2-muted [text-wrap:pretty]">
        {truncated ? t('showingFirst', { count: records.length }) : t('showingAll', { count: records.length })}
        {locale === 'en' ? ' ' : ''}
        {t.rich('notRight', {
          link: (chunks) => (
            <Link
              href="/verify?by=number#search"
              className="text-ada2-ink font-semibold underline underline-offset-[3px] hover:text-black"
            >
              {chunks}
            </Link>
          ),
        })}
      </p>
    </section>
  );
}
