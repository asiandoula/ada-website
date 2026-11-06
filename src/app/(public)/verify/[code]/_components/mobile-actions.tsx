'use client';

/** Phone record actions (board VerifyMobile): Save as PDF, Copy link, Report a concern. Full-width, record style. */
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { CopyIcon, FlagIcon, LinkIcon, PrintIcon } from '@/components/site/icons';

const btn =
  'flex items-center justify-center gap-2 w-full min-h-12 box-border px-[22px] rounded-[2px] font-semibold text-[16px] leading-5 cursor-pointer no-underline bg-white text-ada2-record-ink border border-solid border-ada2-record-ink hover:bg-ada2-record-panel';

export function MobileRecordActions({ reportHref = '/for-doulas/code-of-conduct' }: { reportHref?: string }) {
  const t = useTranslations('record.mobile');
  const ts = useTranslations('site.record');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  return (
    <div className="flex flex-col gap-2 print:hidden">
      <button type="button" onClick={() => window.print()} className={btn}>
        <PrintIcon />
        {t('savePdf')}
      </button>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
          } catch {
            /* clipboard blocked: nothing to do */
          }
        }}
        className={btn}
      >
        {copied ? <CopyIcon /> : <LinkIcon />}
        {copied ? ts('linkCopied') : ts('copyLink')}
      </button>
      <span aria-live="polite" className="ada2-sr">
        {copied ? ts('linkCopied') : ''}
      </span>
      <Link href={reportHref} className={btn}>
        <FlagIcon />
        {ts('reportConcern')}
      </Link>
    </div>
  );
}
