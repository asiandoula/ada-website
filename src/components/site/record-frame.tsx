/**
 * KIT:RECORD-FRAME. A registry record inside the page chrome ("pages talk,
 * records attest"). The page owns the header, breadcrumb band and footer;
 * this renders the grey desk band, the page-side pill toolbar on it, and the
 * white sheet, which is A's design copied from VerifyRecord.dc.html:
 * serif title, seal, RETRIEVED stamp, thick-thin rule, numbered articles,
 * uppercase labels, "None" rows and mono IDs. Do not restyle the sheet.
 *
 *   <RecordFrame recordId="#25-3107" retrievedAt={new Date()} permalink="asiandoula.org/verify/K7QM2XRA">
 *     <RecordArticle number={1} id="art-1" title="Holder">
 *       <RecordRow label="Name as certified" variant="name">Mei Lin Chen</RecordRow>
 *     </RecordArticle>
 *     <RecordPublicActions number={4} />
 *   </RecordFrame>
 */
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import type { Locale } from '@/i18n/config';
import { formatRetrievedAt } from '@/lib/site-dates';
import { cn } from '@/lib/utils';
import { CopyValueButton, RecordToolbar } from './record-actions';
import { StatusTag, type StatusKind } from './status-tag';

const MARK = '/images/2026/ada-mark.svg';

// ---------------------------------------------------------------------------

export interface RecordFrameProps {
  /** Sheet title (h1). Default: site.record.title, "ADA Doula Registry — Official record". */
  title?: ReactNode;
  /** Label above the head ID. Default: site.record.doulaId ("Doula ID"). */
  idLabel?: string;
  /** The head ID, e.g. "#25-3107". */
  recordId: string;
  /** When the registry was read. Printed as the RETRIEVED stamp in Pacific time. */
  retrievedAt: Date;
  /** Permalink for the sheet foot, without protocol, e.g. "asiandoula.org/verify/K7QM2XRA". */
  permalink: string;
  /** "Request a verification letter" pill. Omitted when not given (no letter route exists yet). */
  letterHref?: string;
  /** "Report a concern" pill. Default /for-doulas/code-of-conduct; null hides it. */
  reportHref?: string | null;
  /** Extra pills for the desk toolbar. */
  toolbarExtra?: ReactNode;
  /** Something on the desk above the toolbar (rare). */
  deskTop?: ReactNode;
  /** h1 id. Default "rec-title". */
  headingId?: string;
  /** The articles (RecordArticle, RecordPublicActions, RecordLinkBar…). */
  children: ReactNode;
}

export function RecordFrame({
  title,
  idLabel,
  recordId,
  retrievedAt,
  permalink,
  letterHref,
  reportHref = '/for-doulas/code-of-conduct',
  toolbarExtra,
  deskTop,
  headingId = 'rec-title',
  children,
}: RecordFrameProps) {
  const t = useTranslations('site.record');
  const locale = useLocale() as Locale;
  const label = idLabel ?? t('doulaId');

  return (
    <section aria-label={t('label')} className="bg-ada2-band pt-6 pb-12 px-[clamp(0px,3vw,48px)] print:bg-white print:p-0">
      <div className="max-w-[880px] mx-auto flex flex-col gap-4">
        {deskTop}
        <RecordToolbar letterHref={letterHref} reportHref={reportHref} extra={toolbarExtra} />

        {/* ===== THE SHEET (A, from VerifyRecord.dc.html) ===== */}
        <article
          aria-labelledby={headingId}
          className="bg-white border border-ada2-record-hairline py-[clamp(24px,5vw,56px)] px-[clamp(16px,6vw,64px)] flex flex-col gap-8 text-ada2-record-ink leading-[27px] print:border-0"
        >
          {/* Sheet head + date stamp + thick-thin rule */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-6 items-center">
              <div className="relative w-[88px] h-[88px] flex-none">
                <svg viewBox="0 0 200 200" width={88} height={88} role="img" aria-label={t('seal')} className="absolute left-0 top-0 block">
                  <circle cx="100" cy="100" r="98" fill="none" stroke="#606090" strokeWidth={3} />
                  <circle cx="100" cy="100" r="90" fill="none" stroke="#606090" strokeWidth={1.5} />
                </svg>
                <Image
                  src={MARK}
                  alt=""
                  width={55}
                  height={55}
                  unoptimized
                  loading="eager"
                  className="absolute left-1/2 top-1/2 w-[62%] h-[62%] -translate-x-1/2 -translate-y-1/2 block"
                />
              </div>
              <div className="flex-[1_1_280px] min-w-0 flex flex-col gap-1.5">
                <p className="m-0 font-record-serif font-semibold text-[15px] leading-5 tracking-[0.12em] uppercase text-ada2-record-ink">
                  Asian Doula Alliance
                </p>
                <h1 id={headingId} className="m-0 font-record-serif font-semibold text-[24px] leading-8 [text-wrap:balance]">
                  {title ?? t('title')}
                </h1>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-[13px] leading-4 tracking-[0.08em] uppercase text-ada2-record-muted">{label}</span>
                <span className="flex items-center gap-2">
                  <RecordId size="lg">{recordId}</RecordId>
                  <CopyValueButton value={recordId} label={label} />
                </span>
              </div>
            </div>
            <div className="inline-flex flex-col gap-0.5 py-2 px-3 border border-ada2-record-ink rounded-[2px] self-start">
              <span className="font-record-mono font-medium text-[13px] leading-[18px] tracking-[0.04em] uppercase [font-variant-numeric:tabular-nums_slashed-zero]">
                {t('retrieved', { when: formatRetrievedAt(retrievedAt, locale) })}
              </span>
              <span className="text-[13px] leading-[19px] text-ada2-record-muted">{t('source')}</span>
            </div>
            <div className="box-content h-[3px] border-t-2 border-b border-ada2-record-ink" />
          </div>

          {children}

          {/* Sheet foot */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-5 border-t border-ada2-record-hairline">
            <span className="font-record-mono font-medium text-[13px] leading-5 tracking-[0.02em] whitespace-nowrap [font-variant-numeric:tabular-nums_slashed-zero]">
              {permalink}
            </span>
            <p className="m-0 flex-[1_1_280px] min-w-0 text-[13px] leading-[19px] text-ada2-record-muted [text-wrap:pretty]">{t('footNote')}</p>
            <Image src={MARK} alt="" width={32} height={32} unoptimized className="block w-8 h-8 flex-none" />
          </div>
        </article>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

/** A numbered section of the sheet ("1 Holder"). Numbers are blossom serif. */
export function RecordArticle({
  number,
  title,
  id,
  note,
  stack = false,
  children,
}: {
  number: number | string;
  title: ReactNode;
  /** Heading id, e.g. "art-1". */
  id: string;
  /** Small muted note under the article. */
  note?: ReactNode;
  /** 20px gaps between children (Standing, Self-reported, About) instead of flush ruled rows. */
  stack?: boolean;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className={cn('flex flex-col', stack && 'gap-5')}>
      <div className="flex gap-3 items-baseline pb-3 border-b-2 border-ada2-record-ink">
        <span className="font-record-serif font-semibold text-[15px] leading-5 tracking-[0.04em] text-ada2-blossom">{number}</span>
        <h2 id={id} className="m-0 font-record-serif font-semibold text-[20px] leading-7 [text-wrap:balance]">
          {title}
        </h2>
      </div>
      {children}
      {note ? (
        <p className={cn('m-0 text-[13px] leading-[19px] text-ada2-record-muted [text-wrap:pretty]', !stack && 'pt-3')}>{note}</p>
      ) : null}
    </section>
  );
}

/**
 * A label/value row. `variant`:
 *   serif (default) Source Serif 18/27, for "None" and short values
 *   name            the holder's name, Source Serif 600 at 30–40px
 *   plain           the sheet's sans body (lists, mixed content)
 */
export function RecordRow({
  label,
  children,
  variant = 'serif',
  className,
}: {
  label: ReactNode;
  children: ReactNode;
  variant?: 'serif' | 'name' | 'plain';
  className?: string;
}) {
  return (
    <div className={cn('flex flex-wrap items-baseline gap-x-8 gap-y-1.5 py-3.5 border-b border-ada2-record-hairline', className)}>
      <span className="flex-[1_1_180px] max-w-[200px] font-semibold text-[13px] leading-5 tracking-[0.08em] uppercase text-ada2-record-muted">
        {label}
      </span>
      <span
        className={cn(
          'flex-[999_1_360px] min-w-0',
          variant === 'serif' && 'font-record-serif font-normal text-[18px] leading-[27px]',
          variant === 'name' && 'font-record-serif font-semibold text-[clamp(30px,3vw,40px)] leading-[1.15]'
        )}
      >
        {children}
      </span>
    </div>
  );
}

/**
 * A registry ID in IBM Plex Mono (certificate numbers, Doula IDs, permalinks).
 * Inside the sheet it takes the record ink; on pages pass tone="page" (blossom).
 */
export function RecordId({
  children,
  size = 'sm',
  tone = 'record',
  className,
}: {
  children: ReactNode;
  /** sm 15/500 · md 17/600 (link bar) · lg 22/600 (sheet head). */
  size?: 'sm' | 'md' | 'lg';
  tone?: 'record' | 'page';
  className?: string;
}) {
  return (
    <span
      className={cn(
        'font-record-mono whitespace-nowrap [font-variant-numeric:tabular-nums_slashed-zero]',
        size === 'sm' && 'font-medium text-[15px] tracking-[0.02em]',
        size === 'md' && 'font-semibold text-[17px] leading-6 tracking-[0.02em]',
        size === 'lg' && 'font-semibold text-[22px] leading-7 tracking-[0.04em]',
        tone === 'page' && 'text-ada2-blossom',
        className
      )}
    >
      {children}
    </span>
  );
}

/**
 * "Public actions on file": Suspension · Revocation · Other public action,
 * each "None" unless a value is given. Every category is always printed.
 */
export function RecordPublicActions({
  number = 4,
  id = 'art-public-actions',
  suspension,
  revocation,
  other,
  note,
}: {
  number?: number | string;
  id?: string;
  suspension?: ReactNode;
  revocation?: ReactNode;
  other?: ReactNode;
  /** Default: site.record.publicActions.note. Pass false to hide. */
  note?: ReactNode | false;
}) {
  const t = useTranslations('site.record.publicActions');
  return (
    <RecordArticle number={number} id={id} title={t('title')} note={note === false ? undefined : (note ?? t('note'))}>
      <RecordRow label={t('suspension')}>{suspension ?? t('none')}</RecordRow>
      <RecordRow label={t('revocation')}>{revocation ?? t('none')}</RecordRow>
      <RecordRow label={t('other')}>{other ?? t('none')}</RecordRow>
    </RecordArticle>
  );
}

/** The "Certificate on this link" bar under the sheet head. */
export function RecordLinkBar({
  label,
  recordId,
  status,
  children,
}: {
  /** Default: site.record.certificateOnLink. */
  label?: ReactNode;
  recordId: string;
  status?: StatusKind;
  /** One line, e.g. "This is the holder's current certificate." */
  children?: ReactNode;
}) {
  const t = useTranslations('site.record');
  return (
    <div className="bg-ada2-record-panel border-t-2 border-ada2-record-ink py-3.5 px-[18px] flex flex-col gap-2">
      <p className="m-0 font-semibold text-[13px] leading-4 tracking-[0.08em] uppercase text-ada2-record-muted">
        {label ?? t('certificateOnLink')}
      </p>
      <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2">
        <RecordId size="md">{recordId}</RecordId>
        {status ? <StatusTag status={status} /> : null}
        {children ? <span className="text-[15px] leading-[22px] text-ada2-record-soft">{children}</span> : null}
      </div>
    </div>
  );
}
