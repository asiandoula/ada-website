import type { Metadata, Viewport } from "next";
import {
  DM_Serif_Display,
  Outfit,
  Source_Sans_3,
  Source_Serif_4,
  IBM_Plex_Mono,
} from "next/font/google";
import Script from "next/script";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { htmlLang, type Locale } from "@/i18n/config";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-dm-serif",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

// ---- Direction C (2026-11) fonts --------------------------------------------
// Pages: Source Sans 3. Records only: Source Serif 4 + IBM Plex Mono. All via
// next/font (self-hosted, a few Latin files). Source Sans 3 and Source Serif 4
// are variable, so one file covers every weight used (300/400/600/700).
//
// CJK: Noto Sans SC/TC/JP/KR come from Google Fonts' CSS at runtime instead
// (see cjkFontHrefs below). next/font would self-host them by downloading
// ~450 unicode-range slice files in parallel at build time, which fails on
// constrained networks (verified 2026-11-06: mass parallel TLS connections to
// fonts.gstatic.com get reset). The runtime CSS is the same @font-face +
// unicode-range set next/font would inline, so the browser still fetches only
// the slices a page renders. globals.css maps --font-noto-* to these families
// and picks one per :lang().
const sourceSans = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  variable: "--font-source-sans",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
  preload: false,
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
  preload: false,
});

const fontVariables = [
  dmSerif.variable,
  outfit.variable,
  sourceSans.variable,
  sourceSerif.variable,
  plexMono.variable,
].join(" ");

const CJK_FAMILY: Partial<Record<Locale, string>> = {
  "zh-cn": "Noto+Sans+SC",
  "zh-tw": "Noto+Sans+TC",
  ja: "Noto+Sans+JP",
  ko: "Noto+Sans+KR",
};

/** The language switcher shows each language in its own script: 简体 繁體 日本語 한국어. */
const SWITCHER_GLYPHS = encodeURIComponent("简体繁體日本語한국어");

/**
 * Google Fonts stylesheets for the CJK fallback:
 *  1. the current locale's Noto family, full (variable 300–700, unicode-range slices);
 *  2. on every page, a tiny `text=` subset of all four families for the switcher labels.
 */
function cjkFontHrefs(locale: Locale): string[] {
  const hrefs: string[] = [];
  const family = CJK_FAMILY[locale];
  if (family) hrefs.push(`https://fonts.googleapis.com/css2?family=${family}:wght@300..700&display=swap`);
  hrefs.push(
    "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;600&family=Noto+Sans+TC:wght@400;600" +
      `&family=Noto+Sans+JP:wght@400;600&family=Noto+Sans+KR:wght@400;600&text=${SWITCHER_GLYPHS}&display=swap`
  );
  return hrefs;
}

export const metadata: Metadata = {
  metadataBase: new URL("https://asiandoula.org"),
  title: {
    default: "Asian Doula Alliance",
    template: "%s | Asian Doula Alliance",
  },
  description:
    "Asian Doula Alliance — Setting standards in postpartum care through culturally integrated training and certification.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Asian Doula Alliance",
    images: [{ url: '/images/hero.webp', width: 1200, height: 630 }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={htmlLang[locale as Locale] ?? locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {cjkFontHrefs(locale as Locale).map((href) => (
          // eslint-disable-next-line @next/next/no-page-custom-font
          <link key={href} rel="stylesheet" href={href} />
        ))}
        <meta name="google-site-verification" content="PTujhWjQmd56vwAnC1mRv23EweQBPEpnsIuyRl2zlHY" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-P7D4D4SEHL"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`try { if (localStorage.getItem('ada-cookie-consent') === 'declined') { window['ga-disable-G-P7D4D4SEHL'] = true; } } catch (e) {}
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-P7D4D4SEHL');`}
        </Script>
      </head>
      <body className={`${fontVariables} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Toaster position="top-right" richColors />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
