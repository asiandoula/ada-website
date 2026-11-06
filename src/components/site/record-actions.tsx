'use client';

/** Client parts of the record frame: the desk toolbar and the copy-ID button. */
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect, useState, type ReactNode } from 'react';
import { CopyIcon, FlagIcon, LetterIcon, LinkIcon, PrintIcon } from './icons';
import { pillClassName } from './pill';

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function useFlash(ms = 2000) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!on) return;
    const id = window.setTimeout(() => setOn(false), ms);
    return () => window.clearTimeout(id);
  }, [on, ms]);
  return [on, () => setOn(true)] as const;
}

export function RecordToolbar({
  letterHref,
  reportHref,
  extra,
}: {
  letterHref?: string;
  reportHref?: string | null;
  extra?: ReactNode;
}) {
  const t = useTranslations('site.record');
  const [copied, flashCopied] = useFlash();

  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      <button type="button" onClick={() => window.print()} className={pillClassName('secondary', 'toolbar')}>
        <PrintIcon />
        {t('print')}
      </button>
      <button
        type="button"
        onClick={async () => {
          if (await copyText(window.location.href)) flashCopied();
        }}
        className={pillClassName('secondary', 'toolbar')}
      >
        <LinkIcon />
        {copied ? t('linkCopied') : t('copyLink')}
      </button>
      <span aria-live="polite" className="ada2-sr">
        {copied ? t('linkCopied') : ''}
      </span>
      {letterHref ? (
        <Link href={letterHref} className={pillClassName('registry', 'toolbar')}>
          <LetterIcon />
          {t('requestLetter')}
        </Link>
      ) : null}
      {extra}
      {reportHref ? (
        <Link href={reportHref} className={pillClassName('secondary', 'toolbar', 'ml-auto')}>
          <FlagIcon />
          {t('reportConcern')}
        </Link>
      ) : null}
    </div>
  );
}

export function CopyValueButton({ value, label }: { value: string; label: string }) {
  const t = useTranslations('site.record');
  const [copied, flashCopied] = useFlash();
  return (
    <>
      <button
        type="button"
        aria-label={t('copyValue', { label })}
        onClick={async () => {
          if (await copyText(value)) flashCopied();
        }}
        className="flex-none w-11 h-11 p-0 border border-solid border-ada2-record-control rounded-[2px] bg-white text-ada2-record-ink cursor-pointer flex items-center justify-center hover:bg-ada2-record-panel print:hidden"
      >
        <CopyIcon />
      </button>
      <span aria-live="polite" className="ada2-sr">
        {copied ? t('copied') : ''}
      </span>
    </>
  );
}
