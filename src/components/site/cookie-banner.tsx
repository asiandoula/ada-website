'use client';

/**
 * Analytics consent banner (restyled from components/public/cookie-banner).
 * Kept because the privacy policy tells visitors they can turn off
 * non-essential cookies "through ... the cookie banner on first visit".
 * Same behaviour and storage key; the GA opt-out is also honoured on later
 * visits by the gtag snippet in src/app/layout.tsx.
 */
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { pillClassName } from './pill';

const STORAGE_KEY = 'ada-cookie-consent';
const GA_DISABLE = 'ga-disable-G-P7D4D4SEHL';

export function CookieBanner() {
  const t = useTranslations('site.cookie');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let consent: string | null = null;
    try {
      consent = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      return;
    }
    if (!consent) {
      const timer = window.setTimeout(() => setVisible(true), 1000);
      return () => window.clearTimeout(timer);
    }
  }, []);

  function decide(value: 'accepted' | 'declined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore
    }
    if (value === 'declined') {
      (window as unknown as Record<string, unknown>)[GA_DISABLE] = true;
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <section aria-label={t('label')} className="fixed bottom-0 left-0 right-0 z-[100] bg-ada2-black text-white border-t border-ada2-footer-rule print:hidden">
      <div className="ada2-wrap py-4 flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
        <p className="m-0 flex-[1_1_480px] min-w-0 text-[15px] leading-[22px] text-ada2-band-rule [text-wrap:pretty]">
          {t('text')}{' '}
          <Link href="/privacy-policy" className="text-white underline underline-offset-[3px] hover:text-white">
            {t('learnMore')}
          </Link>
        </p>
        <div className="flex flex-none flex-wrap gap-3">
          <button type="button" onClick={() => decide('declined')} className={pillClassName('onIndigoSecondary', 'sm', 'hover:bg-white/10')}>
            {t('decline')}
          </button>
          <button type="button" onClick={() => decide('accepted')} className={pillClassName('onIndigo', 'sm', 'text-ada2-ink hover:text-ada2-ink')}>
            {t('accept')}
          </button>
        </div>
      </div>
    </section>
  );
}
