import { Header } from '@/components/public/header';
import { Footer } from '@/components/public/footer';
import { CookieBanner } from '@/components/public/cookie-banner';
import { WelcomePopup } from '@/components/public/welcome-popup';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-outfit min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-ada-purple focus:text-white focus:rounded-full focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
      <CookieBanner />
      <WelcomePopup />
    </div>
  );
}
