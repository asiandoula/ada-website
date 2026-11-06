/**
 * The record on a phone (board VerifyMobile.dc.html): the standing first, then
 * the holder, credentials, public actions, actions, certificate history and
 * about. Shown below md; the sheet (RecordSheet) is used from md up and for
 * printing, so a printed record is always the full sheet.
 */
import { useLocale, useTranslations } from 'next-intl';
import { Fragment } from 'react';
import type { Locale } from '@/i18n/config';
import { StatusTag } from '@/components/site';
import { CONTACT, SITE } from '@/lib/facts';
import { formatRetrievedAt, todayInPacific } from '@/lib/site-dates';
import { cn } from '@/lib/utils';
import type { RecordLookup, Standing } from '../../_lib/registry';
import { certificateTag, credentialLabel, credentialMeaning, formatDay, joinSentences, nativeNameLang } from '../../_lib/text';
import { MobileRecordActions } from './mobile-actions';
import { CertificateTag, linkBarText } from './record-sheet';
import { publicActionText, standingCopy, StandingPath } from './standing';

const label = 'font-semibold text-[12px] leading-4 tracking-[0.08em] uppercase text-ada2-record-muted';
const mono = 'font-record-mono font-medium tracking-[0.02em] whitespace-nowrap [font-variant-numeric:tabular-nums_slashed-zero]';

const BANNER: Record<Standing, string> = {
  good: 'bg-ada2-good text-white',
  retired: 'bg-ada2-retired-bg text-ada2-retired-text',
  lapsed: 'bg-white text-ada2-lapsed-text border-[1.5px] border-solid border-ada2-lapsed',
  suspended: 'bg-ada2-suspended text-white',
  revoked: 'bg-ada2-revoked text-white',
};

export function RecordMobile({ lookup, retrievedAt }: { lookup: RecordLookup; retrievedAt: Date }) {
  const t = useTranslations('record');
  const tp = useTranslations('site.record');
  const locale = useLocale() as Locale;
  const { record, linked, permalinkPath } = lookup;
  const today = todayInPacific(retrievedAt);
  const standing = standingCopy(record, t, locale);
  const actions = publicActionText(record, t, locale);
  const nativeLang = record.nativeName ? nativeNameLang(record.nativeName) : undefined;
  const linkIdClass = cn(mono, 'text-[15px]');

  return (
    <article aria-labelledby="m-rec-name" className="flex flex-col px-4 pt-4 pb-10 text-ada2-record-ink leading-[27px]">
      {/* Above the fold: link line, standing, meaning, retrieved */}
      <div className="flex flex-col gap-3">
        {linked ? (
          <div className="flex flex-col gap-1">
            <p className={cn('m-0', label)}>{tp('certificateOnLink')}</p>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
              <span className={cn(mono, 'font-semibold text-[15px] leading-[22px]')}>{linked.number}</span>
              <CertificateTag cert={linked} t={t} />
            </div>
            {linked.state !== 'current' ? (
              <p className="m-0 text-[15px] leading-[22px] text-ada2-record-soft [text-wrap:pretty]">
                {linkBarText(linked, t, locale, linkIdClass)}
              </p>
            ) : null}
          </div>
        ) : null}
        <div className="flex flex-col gap-2.5">
          <p
            className={cn(
              'm-0 flex items-center justify-center gap-2.5 min-h-12 box-border px-4 py-2 rounded-[2px] font-bold text-[16px] leading-5 tracking-[0.08em] uppercase text-center',
              BANNER[record.standing]
            )}
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="square" aria-hidden="true" focusable="false" className="flex-none">
              <StandingPath standing={record.standing} />
            </svg>
            {t(`standing.banner.${record.standing}`)}
          </p>
          <p className="m-0 text-[16px] leading-6 text-ada2-record-soft [text-wrap:pretty]">{standing.body}</p>
          <div className="inline-flex self-start py-1.5 px-2.5 border border-solid border-ada2-record-ink rounded-[2px] max-w-full">
            <span className={cn(mono, 'text-[12px] leading-[18px] tracking-[0.04em] whitespace-normal uppercase')}>
              {tp('retrieved', { when: formatRetrievedAt(retrievedAt, locale) })}
            </span>
          </div>
        </div>
      </div>

      {/* Holder */}
      <div className="flex flex-col pt-5">
        <div className="flex flex-col gap-1 pt-4 border-t border-solid border-ada2-record-hairline">
          <h1 id="m-rec-name" className="m-0 font-record-serif font-semibold text-[28px] leading-[34px] [text-wrap:balance] [overflow-wrap:anywhere]">
            {record.name}
          </h1>
          <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-0.5">
            {record.nativeName ? (
              <span lang={nativeLang} className="font-medium text-[18px] leading-[26px] text-ada2-record-soft">
                {record.nativeName}
              </span>
            ) : null}
            <span className="inline-flex items-baseline gap-1.5">
              <span className="text-[13px] leading-[19px] text-ada2-record-muted">{t('holder.doulaId')}</span>
              <span className={cn(mono, 'text-[16px] leading-[26px]')}>{record.doulaId}</span>
            </span>
          </div>
        </div>

        {/* Credentials: label over value */}
        <dl className="m-0 flex flex-col">
          {record.credentials.length === 0 ? (
            <div className="flex flex-col py-2.5 border-b border-solid border-ada2-record-hairline">
              <dt className={label}>{t('credentials.colCredential')}</dt>
              <dd className="m-0 text-[17px] leading-6">{t('credentials.empty')}</dd>
            </div>
          ) : (
            record.credentials.map((c) => (
              <Fragment key={c.type}>
                <div className="flex flex-col gap-1 py-2.5 border-b border-solid border-ada2-record-hairline">
                  <dt className={label}>{t('credentials.colCredential')}</dt>
                  <dd className="m-0 flex flex-col gap-1">
                    <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[17px] leading-6">
                      {credentialLabel(t, c.type)}
                      <StatusTag status={c.status} />
                    </span>
                    {c.status !== 'active' ? (
                      <span className="text-[15px] leading-[22px] text-ada2-record-soft [text-wrap:pretty]">
                        {credentialMeaning(t, c, locale, today)}
                      </span>
                    ) : null}
                  </dd>
                </div>
                {c.status !== 'revoked' ? (
                  <div className="flex flex-col py-2.5 border-b border-solid border-ada2-record-hairline">
                    <dt className={label}>{c.status === 'expired' ? t('credentials.colEnded') : t('credentials.colEnds')}</dt>
                    <dd className="m-0 text-[17px] leading-6 [font-variant-numeric:tabular-nums_lining-nums]">
                      {c.periodEnds ? formatDay(c.periodEnds, locale) : t('credentials.noEnd')}
                    </dd>
                  </div>
                ) : null}
                {c.currentCertificate ? (
                  <div className="flex flex-col py-2.5 border-b border-solid border-ada2-record-hairline">
                    <dt className={label}>{t('credentials.colCert')}</dt>
                    <dd className="m-0 text-[17px] leading-6">
                      <span className={cn(mono, 'text-[15px] leading-6')}>{c.currentCertificate}</span>
                    </dd>
                  </div>
                ) : null}
              </Fragment>
            ))
          )}
        </dl>

        {/* Public actions on file: every category printed */}
        <section aria-labelledby="m-pa-h" className="flex flex-col gap-1.5 pt-3.5">
          <h2 id="m-pa-h" className={cn('m-0', label)}>
            {tp('publicActions.title')}
          </h2>
          <ul className="m-0 p-0 list-none flex flex-col text-[17px] leading-6">
            <li>
              <span className="text-ada2-record-soft">{t('mobile.rowLabel', { label: tp('publicActions.suspension') })}</span>
              <span className="font-semibold">{actions.suspension}</span>
            </li>
            <li>
              <span className="text-ada2-record-soft">{t('mobile.rowLabel', { label: tp('publicActions.revocation') })}</span>
              <span className="font-semibold">{actions.revocation}</span>
            </li>
            <li>
              <span className="text-ada2-record-soft">{t('mobile.rowLabel', { label: tp('publicActions.other') })}</span>
              <span className="font-semibold">{tp('publicActions.none')}</span>
            </li>
          </ul>
        </section>
      </div>

      {/* Below the fold */}
      <div className="flex flex-col gap-8 pt-7">
        <MobileRecordActions />

        <section aria-labelledby="m-hist-h" className="flex flex-col gap-2">
          <h2 id="m-hist-h" className={cn('m-0', label)}>
            {t('history.title')}
          </h2>
          <div className="flex flex-col border-t border-solid border-ada2-record-hairline">
            {record.certificates.length === 0 ? (
              <p className="m-0 py-3 border-b border-solid border-ada2-record-hairline text-[16px] leading-6 text-ada2-record-soft">
                {t('history.empty')}
              </p>
            ) : (
              record.certificates.map((c) => {
                const parts: string[] = [];
                if (c.issued) parts.push(t('history.issued', { date: formatDay(c.issued, locale) }));
                if (c.state === 'current') parts.push(t('link.current'));
                if (c.state === 'superseded')
                  parts.push(
                    c.replacedBy?.issued
                      ? t.markup('history.replacedBy', { number: c.replacedBy.number, date: formatDay(c.replacedBy.issued, locale), id: (chunks) => chunks })
                      : t('history.replaced')
                  );
                if (c.state === 'withdrawn' && c.withdrawnOn) parts.push(t('history.withdrawnOn', { date: formatDay(c.withdrawnOn, locale) }));
                if (c.state === 'notCurrent') parts.push(linkBarText(c, t, locale, '') as string);
                return (
                  <div key={c.number} className="flex flex-col gap-1 py-3 border-b border-solid border-ada2-record-hairline">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                      <span className={cn(mono, 'text-[15px] leading-6')}>{c.number}</span>
                      <StatusTag status={certificateTag(c).status}>{certificateTag(c).notCurrent ? t('notCurrent') : undefined}</StatusTag>
                    </div>
                    <p className="m-0 text-[16px] leading-6 text-ada2-record-soft [text-wrap:pretty]">
                      {credentialLabel(t, c.type)} · {joinSentences(parts, locale)}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section aria-labelledby="m-about-h" className="flex flex-col gap-2.5">
          <h2 id="m-about-h" className={cn('m-0', label)}>
            {t('about.title')}
          </h2>
          <p className="m-0 text-[16px] leading-6 text-ada2-record-soft [text-wrap:pretty]">{t('mobile.aboutPrimary')}</p>
          <p className="m-0 text-[16px] leading-6 text-ada2-record-soft [text-wrap:pretty]">
            {t.rich('mobile.aboutUse', {
              email: CONTACT.email,
              link: (chunks) => (
                <a href={`mailto:${CONTACT.email}`} className="text-ada2-record-ink underline underline-offset-[3px] whitespace-nowrap">
                  {chunks}
                </a>
              ),
            })}
          </p>
          <p className={cn('m-0', mono, 'text-[15px] leading-[22px] whitespace-normal break-all')}>
            {SITE.host}/verify/{permalinkPath}
          </p>
        </section>
      </div>
    </article>
  );
}
