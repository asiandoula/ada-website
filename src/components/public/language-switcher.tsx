'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Globe, Check } from 'lucide-react';
import { locales, localeNames, type Locale } from '@/i18n/config';
import { setLocale } from '@/i18n/actions';

export function LanguageSwitcher({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  function handleSelect(locale: Locale) {
    setIsOpen(false);
    startTransition(async () => {
      await setLocale(locale);
      router.refresh();
    });
  }

  const triggerStyle =
    variant === 'dark'
      ? 'text-white/90 hover:text-white'
      : 'text-ada-navy/70 hover:text-ada-navy';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
        aria-expanded={isOpen}
        className={`flex items-center gap-1.5 text-sm font-medium py-2 px-2 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${triggerStyle}`}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{localeNames[currentLocale]}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 z-50">
          <div className="bg-white rounded-lg shadow-xl py-2 min-w-[180px] border border-gray-200">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => handleSelect(locale)}
                className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-ada-navy/80 hover:bg-ada-purple/5 hover:text-ada-purple transition-colors"
              >
                <span>{localeNames[locale]}</span>
                {locale === currentLocale && (
                  <Check className="w-4 h-4 text-ada-purple" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
