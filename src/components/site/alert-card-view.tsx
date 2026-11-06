'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DismissIcon } from './icons';
import { inlineLinkClassName } from './pill';

/** Client half of AlertCard: the markup and the dismiss button. Use <AlertCard>. */
export function AlertCardView({
  storageKey,
  label,
  title,
  body,
  linkLabel,
  href,
  dismissLabel,
}: {
  storageKey: string;
  label: string;
  title: string;
  body: string;
  linkLabel: string;
  href: string;
  dismissLabel: string;
}) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(storageKey) === '1') setHidden(true);
    } catch {
      // Storage can be unavailable (private mode); the card just shows.
    }
  }, [storageKey]);

  if (hidden) return null;

  function dismiss() {
    setHidden(true);
    try {
      window.sessionStorage.setItem(storageKey, '1');
    } catch {
      // ignore
    }
  }

  return (
    <section aria-label={label} className="bg-ada2-band py-6 print:hidden">
      <div className="ada2-wrap flex justify-center">
        <div className="relative w-full max-w-[760px] box-border flex flex-col gap-1.5 pt-[18px] pr-[60px] pb-5 pl-6 bg-white border border-ada2-hairline border-t-2 border-t-ada2-ink">
          <p className="m-0 text-[19px] leading-[26px] font-semibold text-ada2-ink [text-wrap:balance]">{title}</p>
          <p className="m-0 text-[16px] leading-[25px] text-ada2-body [text-wrap:pretty]">
            {body}{' '}
            <Link href={href} className={`${inlineLinkClassName} font-semibold`}>
              {linkLabel}
            </Link>
          </p>
          <button
            type="button"
            onClick={dismiss}
            aria-label={dismissLabel}
            className="absolute top-1.5 right-1.5 flex items-center justify-center w-11 h-11 p-0 bg-transparent border-0 rounded-full text-ada2-tag-text cursor-pointer hover:bg-ada2-band"
          >
            <DismissIcon />
          </button>
        </div>
      </div>
    </section>
  );
}
