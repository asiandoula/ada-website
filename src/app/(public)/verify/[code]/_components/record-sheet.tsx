/**
 * The record sheet (boards VerifyRecord / VerifyRecordLapsed / VerifyRecordZh),
 * A style, inside RecordFrame. Desktop and tablet; phones get RecordMobile.
 *
 *   link bar   only when the URL is a certificate code or number
 *   1 Holder · 2 Standing · 3 Credentials · 4 Public actions on file ·
 *   5 Certificate history · 6 About this record
 *
 * The board's "Self-reported information" article is left out: the registry
 * has no directory opt-in, so nothing here is self-reported by the doula.
 */
import { useLocale, useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import type { Locale } from '@/i18n/config';
import {
  RecordArticle,
  RecordFrame,
  RecordId,
  RecordLinkBar,
  RecordPublicActions,
  RecordRow,
  StatusTag,
} from '@/components/site';
import { CONTACT, SITE } from '@/lib/facts';
import { todayInPacific } from '@/lib/site-dates';
import { cn } from '@/lib/utils';
import type { PublicCertificate, RecordLookup } from '../../_lib/registry';
import { certificateTag, credentialLabel, credentialMeaning, formatDay, nativeNameLang, type Translate } from '../../_lib/text';
import { standingCopy, StandingGlyph, publicActionRows } from './standing';

export type RecordT = ReturnType<typeof useTranslations<'record'>>;

const thCol =
  'text-left align-bottom py-3 pr-4 border-b border-solid border-ada2-record-ink font-semibold text-[13px] leading-4 tracking-[0.08em] uppercase text-ada2-record-soft';
const tdCell = 'py-4 pr-4 border-b border-solid border-ada2-record-hairline align-top';

/** The tag for a certificate, with the "Not current" label when its credential has lapsed. */
export function CertificateTag({ cert, t }: { cert: PublicCertificate; t: Translate }) {
  const tag = certificateTag(cert);
  return <StatusTag status={tag.status}>{tag.notCurrent ? t('notCurrent') : undefined}</StatusTag>;
}

/** The line next to "Certificate on this link". */
export function linkBarText(cert: PublicCertificate, t: RecordT, locale: Locale, idClass: string): ReactNode {
  switch (cert.state) {
    case 'current':
      return t('link.current');
    case 'withdrawn':
      return t('link.withdrawn');
    case 'superseded':
      return cert.replacedBy && cert.replacedBy.issued
        ? t.rich('link.replaced', {
            number: cert.replacedBy.number,
            date: formatDay(cert.replacedBy.issued, locale),
            id: (chunks: ReactNode) => <span className={idClass}>{chunks}</span>,
          })
        : t('link.replacedNoCurrent');
    case 'notCurrent':
      if (cert.credentialState === 'suspended') return t('link.suspended');
      if (cert.credentialState === 'retired') return t('link.retired');
      return cert.credentialEnded ? t('link.expiredOn', { date: formatDay(cert.credentialEnded, locale) }) : t('link.expired');
  }
}

function historyNote(cert: PublicCertificate, t: RecordT, locale: Locale): ReactNode {
  if (cert.state === 'superseded') {
    if (!cert.replacedBy || !cert.replacedBy.issued) return t('history.replaced');
    return t.rich('history.replacedBy', {
      number: cert.replacedBy.number,
      date: formatDay(cert.replacedBy.issued, locale),
      id: (chunks) => (
        <span className="font-record-mono font-medium text-[14px] tracking-[0.02em] whitespace-nowrap [font-variant-numeric:tabular-nums_slashed-zero]">
          {chunks}
        </span>
      ),
    });
  }
  if (cert.state === 'withdrawn' && cert.withdrawnOn) return t('history.withdrawnOn', { date: formatDay(cert.withdrawnOn, locale) });
  return null;
}

export function RecordSheet({ lookup, retrievedAt }: { lookup: RecordLookup; retrievedAt: Date }) {
  const t = useTranslations('record');
  const locale = useLocale() as Locale;
  const { record, linked, permalinkPath } = lookup;
  const today = todayInPacific(retrievedAt);
  const standing = standingCopy(record, t, locale);
  const actions = publicActionRows(record, t, locale);
  const linkIdClass =
    'font-record-mono font-medium text-[14px] tracking-[0.02em] whitespace-nowrap [font-variant-numeric:tabular-nums_slashed-zero]';
  const nativeLang = record.nativeName ? nativeNameLang(record.nativeName) : undefined;

  return (
    <RecordFrame
      recordId={record.doulaId}
      retrievedAt={retrievedAt}
      permalink={`${SITE.host}/verify/${permalinkPath}`}
    >
      {linked ? (
        linked.state === 'notCurrent' ? (
          <RecordLinkBar recordId={linked.number}>
            <span className="inline-flex flex-wrap items-center gap-x-3.5 gap-y-2">
              <CertificateTag cert={linked} t={t} />
              <span>{linkBarText(linked, t, locale, linkIdClass)}</span>
            </span>
          </RecordLinkBar>
        ) : (
          <RecordLinkBar recordId={linked.number} status={certificateTag(linked).status}>
            {linkBarText(linked, t, locale, linkIdClass)}
          </RecordLinkBar>
        )
      ) : null}

      {/* 1 Holder */}
      <RecordArticle number={1} id="art-1" title={t('holder.title')}>
        <RecordRow label={t('holder.name')} variant="name">
          <span className="[overflow-wrap:anywhere]">{record.name}</span>
        </RecordRow>
        {record.nativeName ? (
          <RecordRow label={t('holder.native')} variant="plain">
            <span lang={nativeLang} className="font-medium text-[26px] leading-[34px] text-ada2-record-soft">
              {record.nativeName}
            </span>
          </RecordRow>
        ) : null}
        <RecordRow label={t('holder.doulaId')} variant="plain">
          <RecordId>{record.doulaId}</RecordId>
        </RecordRow>
      </RecordArticle>

      {/* 2 Standing */}
      <RecordArticle number={2} id="art-2" title={t('standing.title')} stack note={t('standing.note')}>
        <div className="flex gap-4 items-start">
          <StandingGlyph standing={record.standing} size={44} />
          <div className="flex flex-col gap-1.5 min-w-0">
            <p className="m-0 font-record-serif font-semibold text-[30px] leading-[38px] text-ada2-record-ink [text-wrap:balance]">
              {standing.title}
            </p>
            <p className="m-0 text-[17px] leading-[27px] text-ada2-record-soft max-w-[600px] [text-wrap:pretty]">{standing.body}</p>
          </div>
        </div>
      </RecordArticle>

      {/* 3 Credentials */}
      <RecordArticle number={3} id="art-3" title={t('credentials.title')} note={t('credentials.note')}>
        {record.credentials.length === 0 ? (
          <p className="m-0 py-3.5 border-b border-solid border-ada2-record-hairline font-record-serif text-[18px] leading-[27px]">
            {t('credentials.empty')}
          </p>
        ) : (
          <div className="overflow-x-auto" tabIndex={0} role="region" aria-labelledby="art-3">
            <table aria-labelledby="art-3" className="w-full border-collapse text-[16px] leading-6">
              <thead>
                <tr>
                  <th scope="col" className={thCol}>
                    {t('credentials.colCredential')}
                  </th>
                  <th scope="col" className={thCol}>
                    {t('credentials.colStatus')}
                  </th>
                  <th scope="col" className={thCol}>
                    {t('credentials.colFirst')}
                  </th>
                  <th scope="col" className={thCol}>
                    {t('credentials.colEnds')}
                  </th>
                  <th scope="col" className={cn(thCol, 'pr-0')}>
                    {t('credentials.colCert')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {record.credentials.map((c) => (
                  <tr key={c.type}>
                    <th scope="row" className={cn(tdCell, 'text-left font-record-serif font-semibold text-[18px] leading-[26px] min-w-[172px]')}>
                      {credentialLabel(t, c.type)}
                    </th>
                    <td className={cn(tdCell, '[font-variant-numeric:tabular-nums_lining-nums]')}>
                      <div className="flex flex-col items-start gap-2">
                        <StatusTag status={c.status} />
                        <span className="text-[15px] leading-[22px] text-ada2-record-soft [text-wrap:pretty] min-w-[150px]">
                          {credentialMeaning(t, c, locale, today)}
                        </span>
                      </div>
                    </td>
                    <td className={cn(tdCell, 'pt-[17px] whitespace-nowrap [font-variant-numeric:tabular-nums_lining-nums]')}>
                      {c.firstCertified ? formatDay(c.firstCertified, locale) : '—'}
                    </td>
                    <td className={cn(tdCell, 'pt-[17px] whitespace-nowrap [font-variant-numeric:tabular-nums_lining-nums]')}>
                      {c.status === 'revoked' ? '—' : c.periodEnds ? formatDay(c.periodEnds, locale) : t('credentials.noEnd')}
                    </td>
                    <td className={cn(tdCell, 'pt-[17px] pr-0')}>
                      {c.currentCertificate ? <RecordId>{c.currentCertificate}</RecordId> : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </RecordArticle>

      {/* 4 Public actions on file */}
      <RecordPublicActions number={4} suspension={actions.suspension} revocation={actions.revocation} />

      {/* 5 Certificate history */}
      <RecordArticle number={5} id="art-5" title={t('history.title')}>
        {record.certificates.length === 0 ? (
          <p className="m-0 py-3.5 border-b border-solid border-ada2-record-hairline font-record-serif text-[18px] leading-[27px]">
            {t('history.empty')}
          </p>
        ) : (
          <div className="overflow-x-auto" tabIndex={0} role="region" aria-labelledby="art-5">
            <table aria-labelledby="art-5" className="w-full border-collapse text-[16px] leading-6">
              <thead>
                <tr>
                  <th scope="col" className={thCol}>
                    {t('history.colNumber')}
                  </th>
                  <th scope="col" className={thCol}>
                    {t('history.colCredential')}
                  </th>
                  <th scope="col" className={thCol}>
                    {t('history.colIssued')}
                  </th>
                  <th scope="col" className={cn(thCol, 'pr-0')}>
                    {t('history.colStatus')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {record.certificates.map((c) => {
                  const note = historyNote(c, t, locale);
                  return (
                    <tr key={c.number}>
                      <th scope="row" className={cn(tdCell, 'pt-[17px] text-left font-medium')}>
                        <RecordId>{c.number}</RecordId>
                      </th>
                      <td className={cn(tdCell, 'pt-[17px] whitespace-nowrap')}>{credentialLabel(t, c.type)}</td>
                      <td className={cn(tdCell, 'pt-[17px] whitespace-nowrap [font-variant-numeric:tabular-nums_lining-nums]')}>
                        {c.issued ? formatDay(c.issued, locale) : '—'}
                      </td>
                      <td className={cn(tdCell, 'pr-0')}>
                        <div className="flex flex-col items-start gap-2">
                          <CertificateTag cert={c} t={t} />
                          {note ? (
                            <span className="text-[15px] leading-[22px] text-ada2-record-soft [text-wrap:pretty] min-w-[200px]">{note}</span>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </RecordArticle>

      {/* 6 About this record */}
      <RecordArticle number={6} id="art-6" title={t('about.title')} stack>
        <ol className="m-0 p-0 list-none grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-x-8 gap-y-4 text-[13px] leading-[19px] text-ada2-record-muted">
          {(['primary', 'currency', 'use', 'corrections'] as const).map((k, i) => (
            <li key={k} className="flex gap-2.5 items-baseline">
              <span className="flex-none min-w-3 font-semibold text-ada2-record-ink [font-variant-numeric:tabular-nums_lining-nums]">{i + 1}</span>
              <p className="m-0 [text-wrap:pretty]">
                {t.rich(`about.${k}`, {
                  email: CONTACT.email,
                  b: (chunks) => <strong className="font-semibold text-ada2-record-ink">{chunks}</strong>,
                  link: (chunks) => (
                    <a href={`mailto:${CONTACT.email}`} className="text-ada2-record-ink underline underline-offset-[3px] whitespace-nowrap">
                      {chunks}
                    </a>
                  ),
                })}
              </p>
            </li>
          ))}
        </ol>
      </RecordArticle>
    </RecordFrame>
  );
}
