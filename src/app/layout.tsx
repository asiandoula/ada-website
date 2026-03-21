import type { Metadata } from "next";
import { DM_Serif_Display, Outfit } from "next/font/google";
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
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSerif.variable} ${outfit.variable} antialiased`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
