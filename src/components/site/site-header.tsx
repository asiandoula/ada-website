'use client';

/**
 * KIT:HEADER (lg and up) and KIT:PHONE-HEADER (below lg).
 *
 * Desktop: the black utility bar (languages · Contact · Doula sign in), then
 * the white header: indigo logo tile + wordmark, the blossom verify field
 * (replaces site search), and the audience nav (no dropdowns). The current
 * audience gets aria-current and a 3px ink underline (see site-nav.ts).
 *
 * Phone: the black language row with Sign in, then the logo, a blossom Verify
 * pill and a Menu disclosure holding the audience nav. The verify block is
 * the first block under the header, except on the routes in
 * NO_PHONE_VERIFY_BLOCK (the verify form and record pages, the portal, exams).
 *
 * Languages switch through the existing ADA_LOCALE cookie action; URLs have no
 * locale prefix.
 */
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState, useTransition } from 'react';
import { setLocale } from '@/i18n/actions';
import { htmlLang, localeShortNames, locales, type Locale } from '@/i18n/config';
import { ENTITY } from '@/lib/facts';
import { cn } from '@/lib/utils';
import { CloseIcon, GlobeIcon, MenuIcon, PersonIcon } from './icons';
import { ArrowLink } from './pill';
import { AUDIENCES, UTILITY_LINKS, audienceForPath, showPhoneVerifyBlock, type AudienceKey } from './site-nav';
import { VerifyField } from './verify-field';

const LOCALE_FONT: Record<Locale, string> = {
  en: '',
  'zh-cn': 'font-noto-sc',
  'zh-tw': 'font-noto-tc',
  ja: 'font-noto-jp',
  ko: 'font-noto-kr',
};

const WORDMARK = 'Asian Doula Alliance';

function useAudienceLabels() {
  const t = useTranslations('site.audience');
  const labels: Record<AudienceKey, string> = {
    candidates: t('candidates'),
    doulas: t('doulas'),
    families: t('families'),
    insurers: t('insurers'),
    providers: t('providers'),
    about: t('about'),
  };
  return labels;
}

function LanguageLinks({ compact = false }: { compact?: boolean }) {
  const t = useTranslations('site.utility');
  const current = useLocale() as Locale;
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function choose(next: Locale) {
    if (next === current || pending) return;
    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });
  }

  return (
    <nav
      aria-label={t('languageNav')}
      aria-busy={pending || undefined}
      className={cn('flex flex-wrap items-center text-[14px] leading-5', !compact && 'gap-x-0.5')}
    >
      {!compact && <GlobeIcon className="mr-1 text-ada2-hairline" />}
      {locales.map((l, i) => {
        const active = l === current;
        return (
          <button
            key={l}
            type="button"
            lang={htmlLang[l]}
            aria-current={active ? 'true' : undefined}
            onClick={() => choose(l)}
            className={cn(
              'inline-flex items-center min-h-[44px] bg-transparent border-0 cursor-pointer text-[14px] leading-5',
              compact ? (i === 0 ? 'pl-0 pr-[7px]' : 'px-[7px]') : 'px-2',
              active
                ? 'text-white font-semibold underline decoration-2 underline-offset-[6px]'
                : 'text-ada2-hairline font-normal no-underline hover:text-white',
              LOCALE_FONT[l]
            )}
          >
            {localeShortNames[l]}
          </button>
        );
      })}
    </nav>
  );
}

function LogoTile({ size }: { size: 40 | 48 }) {
  const mark = size === 48 ? 36 : 30;
  return (
    <span
      aria-hidden="true"
      className={cn('flex-none flex items-center justify-center bg-ada2-indigo', size === 48 ? 'w-12 h-12' : 'w-10 h-10')}
    >
      <Image src="/images/2026/ada-mark-white.svg" alt="" width={mark} height={mark} unoptimized className="block" />
    </span>
  );
}

export function SiteHeader() {
  const t = useTranslations('site');
  const labels = useAudienceLabels();
  const pathname = usePathname();
  const current = audienceForPath(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  // Close the menu on navigation.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Escape closes the menu and returns focus to its button.
  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const ariaCurrentFor = (key: AudienceKey, href: string) =>
    current === key ? (pathname === href ? ('page' as const) : ('true' as const)) : undefined;

  return (
    <div className="print:hidden">
      {/* ===================== Desktop: KIT:HEADER ===================== */}
      <div className="hidden lg:block">
        <div className="bg-ada2-black text-white">
          <div className="ada2-wrap flex flex-wrap items-center justify-between gap-x-6">
            <LanguageLinks />
            <div className="flex flex-wrap items-center gap-x-3 text-[14px] leading-5">
              <Link
                href={UTILITY_LINKS.contact}
                className="inline-flex items-center min-h-[44px] px-1 text-ada2-hairline no-underline hover:text-white"
              >
                {t('utility.contact')}
              </Link>
              <span aria-hidden="true" className="w-px h-5 bg-ada2-util-divider" />
              <Link
                href={UTILITY_LINKS.signIn}
                className="inline-flex items-center gap-2 min-h-[44px] px-1 text-white font-semibold no-underline whitespace-nowrap hover:text-white hover:underline underline-offset-4"
              >
                <PersonIcon />
                {t('utility.signIn')}
              </Link>
            </div>
          </div>
        </div>
        <header className="bg-white border-b border-ada2-hairline">
          <div className="ada2-wrap pt-4 pb-1 flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
            <Link
              href="/"
              aria-label={t('brand.homeLabel')}
              className="inline-flex items-center gap-3 min-h-[48px] text-ada2-ink no-underline hover:text-ada2-ink"
            >
              <LogoTile size={48} />
              <span className="text-[21px] leading-[26px] font-semibold text-ada2-ink">{WORDMARK}</span>
            </Link>
            <VerifyField variant="header" id="hdr-verify" />
          </div>
          <div className="ada2-wrap">
            <nav aria-label={t('audience.navLabel')} className="flex flex-wrap items-center gap-x-7">
              {AUDIENCES.map((a) => {
                const active = current === a.key;
                return (
                  <Link
                    key={a.key}
                    href={a.href}
                    aria-current={ariaCurrentFor(a.key, a.href)}
                    className={cn(
                      'inline-flex items-center min-h-[52px] box-border pt-[3px] border-b-[3px] border-solid text-[16px] leading-5 no-underline whitespace-nowrap',
                      active
                        ? 'border-ada2-ink text-ada2-ink font-semibold'
                        : 'border-transparent text-ada2-body font-normal hover:text-ada2-ink hover:border-ada2-hairline'
                    )}
                  >
                    {labels[a.key]}
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>
      </div>

      {/* ===================== Phone: KIT:PHONE-HEADER ===================== */}
      <div className="lg:hidden">
        <div className="bg-ada2-black text-white">
          <div className="px-4 flex flex-wrap items-center justify-between gap-x-2">
            <LanguageLinks compact />
            <Link
              href={UTILITY_LINKS.signIn}
              className="inline-flex items-center min-h-[44px] text-white text-[14px] leading-5 font-semibold no-underline whitespace-nowrap hover:text-white"
            >
              {t('utility.signInShort')}
            </Link>
          </div>
        </div>
        <div className="relative">
          <header className="bg-white border-b border-ada2-hairline">
            <div className="py-2 px-4 flex items-center justify-between gap-2">
              <Link
                href="/"
                aria-label={t('brand.homeLabel')}
                className="inline-flex items-center gap-2.5 min-h-[44px] min-w-0 text-ada2-ink no-underline hover:text-ada2-ink"
              >
                <LogoTile size={40} />
                <span className="min-w-0 text-[16px] leading-5 font-semibold text-ada2-ink">{WORDMARK}</span>
              </Link>
              <div className="flex-none flex items-center gap-1.5">
                <Link
                  href={UTILITY_LINKS.verify}
                  className="inline-flex items-center justify-center min-h-[44px] box-border px-3.5 rounded-full bg-ada2-blossom text-white text-[15px] leading-5 font-semibold no-underline hover:bg-ada2-blossom-hover hover:text-white"
                >
                  {t('verify.submit')}
                </Link>
                <button
                  ref={menuButton}
                  type="button"
                  aria-expanded={menuOpen}
                  aria-controls="site-menu"
                  onClick={() => setMenuOpen((o) => !o)}
                  className="inline-flex items-center gap-1.5 min-h-[44px] box-border px-3 bg-white border-[1.5px] border-solid border-ada2-ink rounded-full text-ada2-ink text-[15px] leading-5 font-semibold cursor-pointer hover:bg-ada2-band"
                >
                  {menuOpen ? <CloseIcon /> : <MenuIcon />}
                  {t('menu.open')}
                </button>
              </div>
            </div>
          </header>
          <div
            id="site-menu"
            hidden={!menuOpen}
            className="absolute left-0 right-0 top-full z-50 bg-white border-b-2 border-ada2-ink box-border pt-2 px-4 pb-6 flex-col gap-6 max-h-[calc(100dvh-105px)] overflow-y-auto [&:not([hidden])]:flex"
          >
            <nav aria-label={t('audience.navLabel')} className="flex flex-col">
              {AUDIENCES.map((a) => {
                const active = current === a.key;
                return (
                  <Link
                    key={a.key}
                    href={a.href}
                    aria-current={ariaCurrentFor(a.key, a.href)}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      'flex items-center min-h-[52px] box-border border-b border-ada2-hairline text-ada2-ink no-underline text-[18px] leading-6 hover:bg-ada2-band hover:text-ada2-ink',
                      active ? 'font-semibold pl-3 shadow-[inset_3px_0_0_#111827]' : 'font-normal'
                    )}
                  >
                    {labels[a.key]}
                  </Link>
                );
              })}
            </nav>
            <ArrowLink href={UTILITY_LINKS.contact} className="self-start">
              {t('utility.contact')}
            </ArrowLink>
            <p className="m-0 text-[14px] leading-[21px] text-ada2-muted [text-wrap:pretty]">
              {t('footer.entityShort', {
                dba: ENTITY.dba,
                legalName: ENTITY.legalName,
                taxCode: ENTITY.taxCode,
                ein: ENTITY.ein,
              })}
            </p>
          </div>
        </div>
        {showPhoneVerifyBlock(pathname) && (
          <section aria-label={t('verify.label')} className="bg-ada2-band border-b border-ada2-hairline pt-4 px-4 pb-[18px]">
            <VerifyField variant="block" id="ph-verify" />
          </section>
        )}
      </div>
    </div>
  );
}
