import { useTranslations } from 'next-intl';
import { CookieBanner } from '@/components/site/cookie-banner';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';

/**
 * Public chrome (Direction C, KitC): SiteHeader, the page, SiteFooter.
 * The welcome popup is gone (a timed modal conflicts with the design: the
 * verify field lives in the header). The cookie banner stays (the privacy
 * policy refers to it).
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('site');
  return (
    <div className="ada2-root font-site min-h-screen flex flex-col bg-white text-ada2-body text-[17px] leading-[1.6]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[120] focus:px-4 focus:py-2 focus:bg-ada2-indigo focus:text-white focus:rounded-full focus:text-[15px] focus:font-semibold"
      >
        {t('skipToContent')}
      </a>
      <SiteHeader />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <CookieBanner />
    </div>
  );
}
