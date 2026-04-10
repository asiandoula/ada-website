import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Outfit } from "next/font/google";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="PTujhWjQmd56vwAnC1mRv23EweQBPEpnsIuyRl2zlHY" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-P7D4D4SEHL"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-P7D4D4SEHL');`}
        </Script>
      </head>
      <body className={`${dmSerif.variable} ${outfit.variable} antialiased`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
